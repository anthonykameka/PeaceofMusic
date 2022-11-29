"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const animalsRaw = require("./data/animals")
const adjectivesRaw = require("./data/adjectives")

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

const animals = animalsRaw[0]
const adjectives = adjectivesRaw[0]


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
        long_bio: null,
        handle: null,
        profile_picture_src: null,
        role: "basic",
        tags: null,
        following: null,
        follows: null,
        setList: null,
        annotations: 0,
        poms: 0,
        comments: 0,
        edits: 0,
        adds: 0,
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
    
}