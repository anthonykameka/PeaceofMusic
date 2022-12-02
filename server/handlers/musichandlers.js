"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

///////////////////////////////////////////
///add song handler 
const addSong = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    let rawSong = req.body // data received
    console.log(rawSong)
    if (!rawSong.thisSong) { // if cant find song online, it will not function
        return res.status(444).json({status:444, message:"Can't find the song online. Try again"})
    }

    //initialize SONG DATA STRUCTURE
    if (!rawSong.thisSong.title.includes("by")) {
        return res.status(444).json({status:444, message:"Can't find the song online. Try again"})
    }
    let title = rawSong.thisSong.title
    let slicedTitle = title.split("by")
    let songTitle = slicedTitle[0].trim();
    let artistName = slicedTitle[1].trim()

    rawSong.artistName = artistName // artist name 
    rawSong.songTitle = songTitle // songtitile
    rawSong._id = uuidv4(); // idcreation
    rawSong.artistId = uuidv4(); // artist id creation
    rawSong.dateAdded = new Date(); // date right now
    rawSong.virgin = true; // edit status. if never edited = true . will help with renders.
    rawSong.editPending = false; // are there edits waiting for approval
    rawSong.edits = {
        mostRecent : null,
        pending : [],
        approved : [],
        declined: [],
    } // keep track of past edits
    rawSong.annotations = {
        annotations: {
            pending: [],
            approved: [],
            declined: [],
        },
        
    }
    rawSong.comments = {
        pending: [],
        approved: [],
        declined: [],
    };

    rawSong.poms = {
        pending: [],
        approved: [],
    }
    rawSong.youTubeUrl = null;
    rawSong.spotifyUrl = null;
    rawSong.albumId = null;
    rawSong.albumTitle = null;
    rawSong.albumRelease = null;

    // initialize artist for DB when a new song is added
    const thisArtist = {
                        _id: rawSong.artistId,
                        artistName: artistName,
                        bio: null, albums: [], 
                        spotifyUrl: null, 
                        lastFmUrl:null, 
                        artistPhotos: [], 
                        edits: 
                            { 
                                pending: [],
                                approved: []
                            }
                        }
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisSong = await db.collection("songs").findOne({songTitle: songTitle, artistName: artistName})
        if (!thisSong) {
           
                const artistCheck = await db.collection("artists").findOne({artistName: artistName})
                console.log(artistCheck)
                if (artistCheck) {
                    console.log("this artist already exists, proceeding without adding new artist")
                }
            
                else {
                    await db.collection("artists").insertOne(thisArtist)
                }
            await db.collection("songs").insertOne(rawSong)
            console.log("test")
            
            const contributor = await db.collection("users").findOne({_id: rawSong.thisSong.addedBy})
            console.log(contributor)
            const previousAddCount = contributor.adds
            console.log(previousAddCount)
            await db.collection("users").updateOne({_id: rawSong.thisSong.addedBy}, {$inc: {adds: +1 }})
            res.status(200).json({status: 200, message: "success", data: rawSong})
            console.log("successfully updated")
            }
        if (thisSong) {
            res.status(400).json({status: 400, message: "this song already exists", data:thisSong})
        }
    } catch (err) {
        res.status(404).json({ status: 404, message: "error in this operation" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    } 
}

const updateAllSongs = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        await db.collection("songs").updateMany({}, {$set: {views: 0}})
        res.status(200).json({status: 200, message: "all songs update"})
    } catch (err) {
        res.status(404).json({ status: 404, messages: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const addView = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const id = req.body.songId
    console.log(id)
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const song = await db.collection("songs").findOne({_id: id})
        await db.collection("songs").updateOne({_id: id}, {$inc: {views: 1}})
        res.status(200).json({status: 200, message: "song found, view added", data: song})
    } catch (err) {
        res.status(404).json({ status: 404, messages: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }

}


const getSongs = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const songs = await db.collection("songs").find().toArray();
        res.status(200).json({ status: 200, data: songs })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const getSong = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const _id = req.params
    console.log(_id)
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisSong = await db.collection("songs").findOne({_id: _id.id})
        console.log(thisSong)
        if (thisSong) {
            res.status(200).json({status: 200, message: "success", data: thisSong})
        }
        if (!thisSong) {
            res.status(400).json({status: 400, message: "this song does NotExist", data:_id})
        }
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const getArtists = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
    await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const songs = await db.collection("songs").find().toArray();
        console.log(songs)
        res.status(200).json({ status: 200, data: songs })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}
const deleteSong = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const id = req.params.id
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisSong = await db.collection("songs").findOne({_id: id})
        console.log(thisSong)
        await db.collection("songs").deleteOne({_id: id})
        console.log(thisSong.thisSong.addedBy)
        await db.collection("users").updateOne({_id: thisSong.thisSong.addedBy}, {$inc: {adds: -1 }})
        res.status(200).json({status: 200, data: id, message: "success. song deleted"})
       
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}



const addEdit = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const edit = req.body
    console.log(edit)
    
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisSong = await db.collection("songs").findOne({_id: edit.targetId}) // find the song
        // console.log(thisSong)//



        const pendingEdit = {
            ...edit,
            _id: uuidv4(),
            type: "song", 
            status: "pending",
            submitTime: new Date(),
            reviewTime: null,
            reviewedBy: null,
            reviewComments: null,
            editDetails: {
                editedTitle: edit.editedTitle,
                editedArtist: edit.editedArtist,
                editedLyrics: edit.editedLyrics
            },
            currentDetails: {
                currentArtist: thisSong.artistName,
                currentTitle: thisSong.songTitle,
                currentLyrics: thisSong.thisSong.lyrics,
                
            }
            
        }
    
        // console.log(pendingEdit)
        const miniEditDetails = {
            _id: pendingEdit._id,
            date: pendingEdit.submitTime,
            status: pendingEdit.status,
        }
    
        // console.log(pendingEdit.editedBy)



        await db.collection("edits").insertOne(pendingEdit)
        await db.collection("users").updateOne(
            {
                _id: pendingEdit.editedBy
            }, 
            {
                $push: {
                        "edits.pending": miniEditDetails
                    }
            }
        )

        
        await db.collection("songs").updateOne(
        
            {
                "_id": pendingEdit.targetId
            },
            {
                $push: {
                    "edits.pending": miniEditDetails
                },
                $set: {
                    editPending: true
                }
            }
        )

        res.status(200).json({status: 200, data: pendingEdit, message: "edit submission received."})


    } catch (err) {
        res.status(404).json({ status: 404, data: "Error in this operation" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

// const reviewEdit = async (req, res) => {

//     const client = new MongoClient(MONGO_URI, options)
//     const review = req.body



// }

const getEdits = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
    await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const edits = await db.collection("edits").find().toArray();
        console.log(edits)
        res.status(200).json({ status: 200, data: edits })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const getEdit = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const id = req.params.id
    try {
    await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const edit = await db.collection("edits").findOne({_id: id})
        console.log(edit)
        res.status(200).json({ status: 200, data: edit })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const reviewEdit = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const details = req.body
    const editId = req.body.editId
    const reviewerId = req.body.reviewerId
    const status = req.body.status
    const reviewComments = req.body.reviewComments
    const songId = req.body.targetId

    try {
    await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const edit = await db.collection("edits").findOne({_id: editId})
        console.log(edit)
        /// IF EDIT IS APPROVED ////
        if(status === "approved" ) {
            const reviewTime = new Date()
            await db.collection("edits").updateOne(
                {
                    _id: editId
                },
                {
                    $set: {
                        status: "approved",
                        reviewTime: reviewTime,
                        reviewedBy: reviewerId,
                        reviewComments: reviewComments,

                    }
                }
            )

            const review = {
                _id: edit._id,
                date: reviewTime,
                status: "approved"
            }
            // reviewer edit
            await db.collection("users").updateOne(
                {
                    _id: reviewerId
                },
                {
                    $push: {
                        "reviews.approved": review
                    }
                }
            )

            // editor edit //
            await db.collection("users").updateOne(
                {
                    _id: edit.editedBy
                },
                {
                    $push: {
                        "edits.approved": review
                    },
                    
                    $pull: {
                        "edits.pending": {_id: editId}
                    }
                }

            )
    

            // push edit into approved array
            await db.collection("songs").updateOne(
                {
                    _id: songId
                },
                {
                    $set: {
                        virgin: false,

                        },
                    $push: {
                        "edits.approved":review
                    }
                }
            )
            await db.collection("songs").updateOne(
                {
                    _id:songId
                },
                {
                    $set: {
                        "edits.mostRecent": {_id: editId}
                    }
                },
                {
                    $pull: {
                        "edits.pending": {_id: editId}
                    }
                }
            )

                if (edit.editDetails.editedTitle) {
                    await db.collection("songs").updateOne(
                        {
                            _id: songId
                        },
                        {
                            $set: {
                                songTitle: edit.editDetails.editedTitle
                            }
                        }
                    )
                }

                if (edit.editDetails.editedArtist) {
                    await db.collection("songs").updateOne(
                        {
                            _id: songId
                        },
                        {
                            $set: {
                                artistName: edit.editDetails.editedArtist,
                                declined: true,
                            }
                        }
                    )
                }

                if (edit.editDetails.editedLyrics) {
                    await db.collection("songs").updateOne(
                        {
                            _id: songId
                        },
                        {
                            $set: {
                               "songTitle.lyrics": edit.editDetails.editedLyrics
                            }
                        }
                    )
                }
                // check pending
        }
        /////////// this completed review approval handler///

        /// DECLINED HANDLER

        if (status === "declined" ) {
            const reviewTime = new Date()
            await db.collection("edits").updateOne(
                {
                    _id: editId
                },
                {
                    $set: {
                        status: "declined",
                        reviewTime: reviewTime,
                        reviewedBy: reviewerId,
                        reviewComments: reviewComments,

                    }
                }
            )
            const review = {
                _id: edit._id,
                date: reviewTime,
                status: "declined",
            }

            // reviewer edit
            await db.collection("users").updateOne(
                {
                    _id: reviewerId
                },
                {
                    $push: {
                        "reviews.declined": review
                    }
                }
            )

                        // editor edit //
            await db.collection("users").updateOne(
                {
                    _id: edit.editedBy
                },
                {
                    $push: {
                        "edits.declined": review
                    },
                    
                    $pull: {
                        "edits.pending": {_id: editId}
                    }
                }
        
            )
            

             // push edit into approved array
             await db.collection("songs").updateOne(
                {
                    _id: songId
                },


                {

                    $push: {
                        "edits.declined":review
                    }
                }
            )
            await db.collection("songs").updateOne(
                {
                    _id:songId
                },
                {
                    $pull: {
                        "edits.pending": {_id: editId}
                    }
                }
            )

        }

        // for either approval, or decline, edit db pending length

        const songAfterReview = await db.collection("songs").findOne({_id: songId}) 
                if (songAfterReview.edits.pending.length === 0) {
                    await db.collection("songs").updateOne(
                        {
                            _id: songId
                        },
                        {
                            $set: {
                                editPending: false
                            }
                        }
                    )
                }

        
    res.status(200).json({ status: 200, approved: approved, data: details })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}






// "flight": reservation.flight, "seats": {"$elemMatch": {"id": reservation.seat}} for future reference

// const addArtist = async (req, res) => {
//     const client = new MongoClient(MONGO_URI, options);
//     try {
//     await client.connect();
//         const db = client.db("peaceofmusic");
//         console.log("connected")
//         res.status(200).json({ status: 200 })
//     } catch (err) {
//         res.status(404).json({ status: 404, data: "Not Found" });
//     } finally {
//     client.close(); 
//     }
// }

        

module.exports = {
    addSong,
    getSongs,
    getSong,
    deleteSong,
    getArtists,
    addEdit,
    getEdits,
    getEdit,
    reviewEdit,
    updateAllSongs,
    addView,
    // addArtist,
}