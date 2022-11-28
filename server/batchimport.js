const guitar = require("./data/Chords/guitar.json")
const { MongoClient } = require("mongodb");
const { push } = require("./data/adjectives");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const main = guitar.main
// console.log(guitar)

const GUITAR = [{main: main, tunings: guitar.tunings, keys: guitar.keys, suffixes: guitar.suffixes, chords: guitar.chords }]

// console.log(GUITAR)
//IMPORTING CHORD INFORMATION INTOMONGODB

const batchImport = async () => {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("peaceofmusic");
    try {
        await db.collection("guitar").insertMany(GUITAR)
        console.log("success")
    } catch (err) {
        console.log(err)
    } finally {
        client.close();
    }
};

//  batchImport();
