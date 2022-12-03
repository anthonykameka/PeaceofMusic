"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

const getComments = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
     const id = req.params.targetId
     console.log(id)
    // 
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const comments = await db.collection("comments").find({target: id}).toArray();
        console.log(comments)
        res.status(200).json({ status: 200, data: comments })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    }
    

}

const postComment = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    let comment = req.body //data received 
    console.log(comment);
    comment = {...comment, _id: uuidv4()}
    console.log(comment)
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const comments = await db.collection("comments").find().toArray();
        await db.collection("comments").insertOne(comment)
        await db.collection("users").updateOne({_id: comment.author}, {$push: {"comments.approved": comment._id}})
        res.status(200).json({ status: 200, data: comment, message: "success" })
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    } finally {
    client.close();
    }

}



module.exports = {
    getComments,
    postComment,
}