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

    //initialize some values for the database

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
    } // keep track of past edits
    rawSong.annotations = {
        annotations: {
            pending: [],
            approved: [],
        },
        
    }
    rawSong.comments = {
        pending: [],
        approved: [],
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
            res.status(400).json({status: 400, message: "this song already exists", data:rawSong})
        }
    } catch (err) {
        res.status(404).json({ status: 404, message: "error in this operation" });
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
    const pendingEdit = {
        ...edit,  
        pending: true, // set pending edit for future moderation.
        approved: false  // approval of edit?
    }

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisSong = await db.collection("songs").findOne({_id: edit.songId}) // find the song
        console.log(thisSong)
        await db.collection("songs").updateOne({})


    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}


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
    // addArtist,
}