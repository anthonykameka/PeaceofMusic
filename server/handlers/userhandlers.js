"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const animalsRaw = require("../data/animals")
const adjectivesRaw = require("../data/adjectives")
const profilePicturesRaw = require("../data/profilepictures")

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

const animals = animalsRaw[0]
const adjectives = adjectivesRaw[0]
const profilePictures = profilePicturesRaw[0]


const usernameCreator = () => {
    const animal = animals[Math.floor(Math.random()*animals.length)];
    const adjective = adjectives[Math.floor(Math.random()*adjectives.length)]
    const number = Math.floor(1000 + Math.random() * 9000);
    return `@${adjective}${animal[0].toLowerCase()+animal.slice(1)}${number}`
}

const updateUserName = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const newUserName = req.body.newUserName
    const _id = req.body._id
    console.log(newUserName)
    console.log(_id)
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const newUser = await db.collection("users").findOne({_id: _id})
        const user = await db.collection("users").findOne({username: newUserName})

        user && res.status(402).json({ status: 402, message: "username already exists", data: "newUserName"})
        if (!user) {
            console.log(_id)
            await db.collection("users").updateOne({_id: _id}, {$set:{"username":newUserName}} )
            res.status(200).json({status: 200, message: "username successfuly updated.", data: newUserName})
        }
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const updateDisplayName = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const newDisplayName = req.body.newDisplayName
    const _id = req.body._id
    console.log(newDisplayName)
    console.log(_id)
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const newUser = await db.collection("users").findOne({_id: _id})
    
        await db.collection("users").updateOne({_id: _id}, {$set:{"displayname":newDisplayName}} )
        res.status(200).json({status: 200, message: "displayname successfuly updated.", data: newDisplayName})

    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const getUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const auth0_sub = req.params.auth0
        const thisUser = await db.collection("users").findOne({auth0_sub: auth0_sub})
        thisUser && res.status(200).json({status: 200, data: thisUser, message: "success"})
        !thisUser && res.status(403).json({status: 403, data: thisUser, message: "this is a new user"})
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const getThisUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    console.log(req.params)

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisUser = await db.collection("users").findOne({_id: req.params.id})
        // const thisUser = await db.collection("users").findOne({auth0_sub: auth0_sub})
        thisUser && res.status(200).json({status: 200, data: thisUser, message: "success"})
        // !thisUser && res.status(403).json({status: 403, data: thisUser, message: "this is a new user"})
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const deleteUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const id = req.params.id
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        await db.collection("users").deleteOne({_id: id})
        res.status(200).json({status: 200, data: id, message: "success. user deleted"})
       
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const matchUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        console.log(req.params)
        const id = req.params.id
        console.log(id)
        const thisUser = await db.collection("users").findOne({_id: id})
        console.log(thisUser)
        thisUser && res.status(200).json({status: 200, data: thisUser, message: "success"})
        !thisUser && res.status(403).json({status: 403, data: thisUser, message: "this user does not exist"})
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}


const getUsers = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const users = await db.collection("users").find().toArray();
        res.status(200).json({ status: 200, data: users })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
};

const addUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    //console.log(req.body)
    const email = req.body.user.email
    const updated_at = req.body.user.updated_at
    const email_verified = req.body.user.email_verified
    const auth0_sub = req.body.user.sub 
    const joined = new Date();
    const username = usernameCreator()
    const id = uuidv4();
    const profilePictureSrc = profilePictures[Math.floor(Math.random()*profilePictures.length)]
    

    const newUserInfo= {
        _id: id,
        active: true,
        username:username,
        displayname: null,
        updated_at: updated_at,
        joined_at: joined,
        email: email,
        email_verified: email_verified,
        auth0_sub: auth0_sub,
        short_bio: null,
        age: null,
        location: {
            city: null,
            region: null,
            country: null,
        },
        long_bio: null,
        handle: null,
        profile_picture_src: profilePictureSrc,
        role: "basic",
        tags: null,
        following: null,
        follows: null,
        ownSongs: {
            private: [],
            public: {
                approved: [],
                pending: [],
                declined: [],
            }
        },
        setLists: {
            private: [],
            public: []
        },
        annotations: {
            meanings: {
                approved: [],
                pending: [],
                declined: [],
            },
            theories: {
                approved: [],
                pending: [],
                declined: [],
            }
        },
        poms: {
            pending: [],
            approved: [],
            declined: [],
            private: [],
            workInProgress: [],
        },
        comments: {
            pending: [],
            approved: [],
            declined: [],
        },
        edits: {
            pending: [],
            approved: [],
            declined: [],
        },
        reviews: {
            approved: [],
            declined: [],
        },
        adds: 0,
        notifications: [],
        messages: [],
        favorites: [],
    }

    //console.log(newUserInfo)

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const users = await db.collection("users").find().toArray();
        const thisUser = await db.collection("users").findOne({email: email})
        if (!thisUser) {
            await db.collection("users").insertOne(newUserInfo)
            res.status(200).json({ status: 200, message: "success", data: newUserInfo})
        }
        if (thisUser) {
            res.status(400).json({status: 400, message:"this user already exists", data:thisUser})
        }
       
        
    } catch (err) {
        res.status(404).json({ status: 404, message: "user already exists" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }   
}

// disactivate user so their info is not lost forever
const deactivateUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const _id = req.params.id

    console.log(req.params)

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisUser = await db.collection("users").findOne({_id: _id})
    
        await db.collection("users").updateOne({_id: _id}, {$set:{"active":false}} )
        res.status(200).json({status: 200, message: "account deactivated", data: thisUser})

    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();


    console.log("disconnected from database.")
    }
}

const activateUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const _id = req.params.id

    console.log(req.params)

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisUser = await db.collection("users").findOne({_id: _id})
    
        await db.collection("users").updateOne({_id: _id}, {$set:{"active":true}} )
        res.status(200).json({status: 200, message: "account activated", data: thisUser})

    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const updatePicture = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const patch = req.body
    console.log(patch)

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const user = await db.collection("users").findOne({_id: patch._id})
        console.log(user)
         await db.collection("users").updateOne({_id: patch._id}, {$set: {"profile_picture_src": patch.src}})

         res.status(200).json({status: 200, message: "picture changed", data: patch})
    }
    catch (err) {
        res.status(404).json({ status: 404, data: "Issue completing this operation" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}

const updateAllUsers = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        await db.collection("users").updateMany({}, {$set: {favorites: []}})
        res.status(200).json({status: 200, message: "all users updated"})
    } catch (err) {
        res.status(404).json({ status: 404, messages: "Not Found" });
    } finally {
    client.close();
    console.log("disconnected from database.")
    }
}




module.exports = {
    getUsers,
    addUser,
    getUser,
    deleteUser,
    deactivateUser,
    activateUser,
    matchUser,
    updateUserName,
    updateDisplayName,
    updatePicture,
    updateAllUsers,
    getThisUser,
    
}