"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

const addSong = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    let rawSong = req.body

    let title = rawSong.song.title
    let slicedTitle = title.split("by")
    console.log(slicedTitle)
    let songTitle = slicedTitle[0].trim();
    console.log(songTitle)
    let artistName = slicedTitle[1].trim()

    rawSong.artistName = artistName
    rawSong.songTitle = songTitle
    rawSong._id = uuidv4();

    try {
        await client.connect();
        const db = client.db("peaceofmusic");
        console.log("connected")
        const thisSong = await db.collection("songs").findOne({songTitle: songTitle, artistName: artistName})
        if (!thisSong) {
            await db.collection("songs").insertOne(rawSong)
            res.status(200).json({status: 200, message: "success", data: rawSong})
        }
        if (thisSong) {
            res.status(400).json({status: 400, message: "this song already exists", data:rawSong})
        }
    } catch (err) {
        res.status(404).json({ status: 404, message: "error in this operation" });
    } finally {
    client.close();
    
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
    }
}
        

module.exports = {
    addSong,
    getSongs,
    getSong,
    getArtists,
}