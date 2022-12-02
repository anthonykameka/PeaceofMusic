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
    const _id = req.params._id
    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const comments = await db.collection("comments").find().toArray();
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
    

}



module.exports = {
    getComments,
    postComment,
}