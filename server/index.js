const express = require('express')
const helmet = require("helmet");
const morgan = require("morgan")
const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const SpotifyWebApi = require('spotify-web-api-node');


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
  updateAllUsers,
  getThisUser,
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
  addFav,
  removeFav,
  getAccessToken,
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
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))



    /// ENDPOINTS///

  

    //USERS//
  app.get("/api/get-users", getUsers)
  app.get("/api/get-user/:auth0", getUser)
  app.get("/api/get-this-user/:id", getThisUser)
  app.get("/api/match-user/:id", matchUser)
  app.post("/api/add-user", addUser)
  app.patch("/api/update-username", updateUserName )
  app.patch("/api/update-displayname", updateDisplayName)
  app.patch("/api/deactivate-user/:id", deactivateUser)
  app.patch("/api/activate-user/:id", activateUser)
  app.patch("/api/update-picture", updatePicture)
  app.delete("/api/delete-user/:id", deleteUser)
  app.get("/api/update-users", updateAllUsers)


  ///EDIT HANDLERS//
  app.patch("/add-edit", addEdit)
  app.patch("/api/review-edit", reviewEdit)
  app.get("/api/get-edits", getEdits)
  app.get("/api/get-edit/:id", getEdit)

  //CHORD HANDLERS //
  app.get("/api/get-chords", getChords)

  //SONG HANDLERS ///
  app.get("/api/get-access-token", getAccessToken)
  app.post("/api/add-song", addSong)
  app.get("/api/get-songs", getSongs)
  app.get("/api/get-song/:id", getSong)
  app.get("/api/get-artists", getArtists)
  app.delete("/api/delete-song/:id", deleteSong)
  app.get("/api/update-songs", updateAllSongs) // used to update all songs when required
  app.patch("/api/view-song/", addView)
  app.patch("/api/remove-fav/", removeFav)
  app.patch("/api/add-fav/", addFav)

  //COMMENT HANDLERS //
  app.get("/api/get-comments/:targetId", getComments)
  app.post("/api/post-comment", postComment)

  //SPOTIFY

const spotifyId = process.env.spotifyId
const spotifySecret = process.env.spotifysecret
const redirectUri = 'http://localhost:3000';

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${spotifyId}:${spotifySecret}`).toString('base64')}`,
    },
    json: true,
  }
})

  app.get('/spotifylogin', (req, res) => {
    const scopes = encodeURIComponent('user-read-private user-read-email streaming user-read-currently-playing user-modify-playback-state user-read-playback-state');
    const url = `https://accounts.spotify.com/authorize?client_id=${spotifyId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;
    res.redirect({ url });
  });


  app.post('/auth', (req, res) => {
    const code = req.body.code;
    console.log(req.body)
    console.log(code)

    const spotifyApi = new SpotifyWebApi({
      clientId: spotifyId,
      clientSecret: spotifySecret,
      redirectUri: redirectUri
    })

    const userJSON = {};

    spotifyApi.authorizationCodeGrant(code)
      .then(data => {
        userJSON['expiresIn'] = data.body['expires_in']
        userJSON['accessToken'] = data.body['access_token']
        userJSON['refreshToken'] = data.body['refresh_token']

              //retrieve the current user's info
        spotifyApi.setAccessToken(data.body['access_token']);
        return spotifyApi.getMe();
      })
      .then(data => {
        userJSON['userId'] = data.body['id'];
        userJSON['name'] = data.body['display_name'];
        userJSON['email'] = data.body['email'];
  
        const image = data.body.images[0].url;
        userJSON['image'] = image;
        userJSON['product'] = data.body['product'];
  
        res.status(201).send(userJSON);
      })
      .catch(err => {
        res.status(500).send(err);
      })
  })

  app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
  
    const spotifyApi = new SpotifyWebApi({
      clientId: spotifyId,
      clientSecret: spotifySecret,
      redirectUri: redirectUri,
      refreshToken
    })
  
    spotifyApi.refreshAccessToken()
      .then(data => {
        console.log('The access token has been refreshed!');
        res.status(201).json({
          accessToken: data.body.access_token,
          expires_in: data.body.expires_in
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).send(err)
      })
  })

  app.post('/api/token', (req, res) => {
    const code = req.body.code;
    console.log(code)
    if (!code) {
      return res.status(400).json({status: 400, message: "code is missing"})
    }

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${spotifyId}:${spotifySecret}`)
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
  })
  .then(res => res.json())
  .then(data => res.send({ access_token: data.access_token }))
  .catch(error => res.status(400). send({ error: "error, verify login"}))
    })



  


  


    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});