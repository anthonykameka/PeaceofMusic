const express = require('express')
const helmet = require("helmet");
const morgan = require("morgan")

// const { auth, requiresAuth } = require('express-openid-connect');
const router = require("express").Router();
// require('dotenv').config();
const app = express();
const port = 8000

const {
  getUsers,
  addUser,
  getUser,
  updateUserName,
  updateDisplayName,
} = require("./userhandlers")

const { 
  getChords,
} = require("./chordhandlers")

const {
  addSong,
  getSongs,
  getSong,
} = require("./musichandlers")



app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, HEAD, GET, PUT, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})


app.use(express.json())
app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))



    /// ENDPOINTS
  app.get("/api/get-users", getUsers)
  app.get("/api/get-user/:auth0", getUser)
  app.post("/api/add-user", addUser)
  app.patch("/api/update-username", updateUserName )
  app.patch("/api/update-displayname", updateDisplayName)
  app.get("/api/get-chords", getChords)
  app.post("/api/add-song", addSong)
  app.get("/api/get-songs", getSongs)
  app.get("/api/get-song/:id", getSong)



    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});