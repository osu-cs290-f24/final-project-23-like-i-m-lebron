var express = require("express")
var fs = require("fs")
var app = express()
var exphbs = require('express-handlebars')

var albumData = require("./albumData.json")

app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
  }));
app.set('view engine', 'handlebars')

app.use(function (req, res, next) {
    console.log("== Request received")
    next()
})

app.use(express.json())
app.use(express.static("static"))

app.post('/add-album', function (req, res) {
    const newAlbum = req.body

    if (!newAlbum.title || !newAlbum.artist || !newAlbum.year || !newAlbum.photoURL || !newAlbum.review || !newAlbum.rating || !newAlbum.song) {
        res.status(400).send("Missing required fields.")
        return
    }

    //check if the album already exists
    if (albumData[newAlbum.title]) {
        res.status(400).send("Album already exists.");
        return;
    }

    //add the new album to albumData
    albumData[newAlbum.title] = newAlbum

    //write the updated albumData to the file
    fs.writeFile("./albumData.json", JSON.stringify(albumData, null, 2), function (err) {
        if (err) {
            console.error("Error writing to albumData.json:", err)
            res.status(500).send("Error saving album.")
            return
        }
        res.status(200).send("Album added successfully.")
    })
})

app.get('/popular', function (req, res, next) {
    var albumArray = Object.values(albumData)
    // Sort the albumArray by "integer-rating" in descending order (highest to lowest)
    albumArray.sort((a, b) => b['integer-rating'] - a['integer-rating']);
    res.status(200).render("highestratedPage", {
        albums: albumArray
    })
})

app.get('/queue', function (req, res, next) {
    var albumArray = Object.values(albumData)
    res.status(200).render("myqueuePage", {
        albums: albumArray
    })
})

app.get('/reviews', function (req, res, next) {
    var albumArray = Object.values(albumData)
    res.status(200).render("myreviewsPage", {
        albums: albumArray
    })
})

app.get('/', function (req, res, next) {
    var albumArray = Object.values(albumData)
    // Sort the albumArray by "integer-rating" in descending order (highest to lowest)
    albumArray.sort((a, b) => b['integer-rating'] - a['integer-rating']);
    res.status(200).render("homePage", {
        albums: albumArray
    })
})

app.get('*', function (req, res, next) {
    res.status(404).render("errorPage")
})

app.listen(3000, function () {
    console.log("== Server listening for requests")
})