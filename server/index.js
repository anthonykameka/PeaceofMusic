const express = require('express')
const helmet = require("helmet");
const morgan = require("morgan")
const bodyParser = require('body-parser');

// const { auth, requiresAuth } = require('express-openid-connect');
const router = require("express").Router();
// require('dotenv').config();
const app = express();
const port = 8000

const {
  getUsers,
  addUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUser,
  matchUser,
  updateUserName,
  updateDisplayName,
  updatePicture,
} = require("./handlers/userhandlers")

const { 
  getChords,
} = require("./handlers/chordhandlers")

const {
  addSong,
  getSongs,
  getSong,
  getArtists,
  deleteSong,
  addEdit,
  getEdits,
  getEdit,
  reviewEdit,
  updateAllSongs,
  addView,
} = require("./handlers/musichandlers")

const {
  getComments,
  postComment,
} = require("./handlers/commenthandlers")

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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



    /// ENDPOINTS///

    //USERS//
  app.get("/api/get-users", getUsers)
  app.get("/api/get-user/:auth0", getUser)
  app.get("/api/match-user/:id", matchUser)
  app.post("/api/add-user", addUser)
  app.patch("/api/update-username", updateUserName )
  app.patch("/api/update-displayname", updateDisplayName)
  app.patch("/api/deactivate-user/:id", deactivateUser)
  app.patch("/api/activate-user/:id", activateUser)
  app.patch("/api/update-picture", updatePicture)
  app.delete("/api/delete-user/:id", deleteUser)


  ///EDIT HANDLERS//
  app.patch("/add-edit", addEdit)
  app.patch("/api/review-edit", reviewEdit)
  app.get("/api/get-edits", getEdits)
  app.get("/api/get-edit/:id", getEdit)

  //CHORD HANDLERS //
  app.get("/api/get-chords", getChords)

  //SONG HANDLERS ///
  app.post("/api/add-song", addSong)
  app.get("/api/get-songs", getSongs)
  app.get("/api/get-song/:id", getSong)
  app.get("/api/get-artists", getArtists)
  app.delete("/api/delete-song/:id", deleteSong)
  app.get("/api/update-songs", updateAllSongs) // used to update all songs when required
  app.patch("/api/view-song/", addView)

  //COMMENT HANDLERS //
  app.get("/api/get-comments/:targetId", getComments)
  app.post("/api/post-comment", postComment)





    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});