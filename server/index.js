const express = require('express')
const helmet = require("helmet");
const morgan = require("morgan")
const { auth } = require('express-openid-connect');
const port = 8000


express()
.use(function (req, res, next) {
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

        .use(express.json())
        .use(morgan("tiny"))
        .use(express.urlencoded({ extended: false }))
        .use("/", express.static(__dirname + "/"))
        .use(function (req, res, next) {
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


    /// ENDPOINTS

    .get('/hello', (req, res) => {
    res.status(200).json({status: 200, message: "Hello World!" })
})

    .listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});