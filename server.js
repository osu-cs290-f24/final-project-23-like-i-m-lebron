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

    // if (!newAlbum.title || !newAlbum.artist || !newAlbum.year || !newAlbum.photoURL || !newAlbum.review || !newAlbum.rating || !newAlbum.song) {
    //     res.status(400).send("Missing required fields.")
    //     return
    // }

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
    // only display two or less albums for the queue, reviews, and most popular
    let queued_albums_displayed = 0
    let reviewed_albums_displayed = 0
    homepage_albums_to_display = []
    for (let i = 0; i < albumArray.length; i++) {
        // Add the first two albums no matter what since they are the most popular
        if(i < 2) {
            homepage_albums_to_display.push(albumArray[i])
            // check if the two albums have a review or are queued
            if (albumArray[i].queued == true) {
                queued_albums_displayed += 1
            } if (albumArray[i].review != "") {
                reviewed_albums_displayed += 1
            }
        }
        else {
            if (albumArray[i].queued == true && queued_albums_displayed < 2) {
                homepage_albums_to_display.push(albumArray[i])
                queued_albums_displayed += 1
                if (albumArray[i].review != "") {
                    reviewed_albums_displayed += 1
                }
            }
            else if (albumArray[i].review != "" && reviewed_albums_displayed < 2) {
                homepage_albums_to_display.push(albumArray[i])
                reviewed_albums_displayed += 1
            }
        }
        
      }
    res.status(200).render("homePage", {
        albums: homepage_albums_to_display
    })
})

app.get('*', function (req, res, next) {
    res.status(404).render("errorPage")
})

app.listen(3000, function () {
    console.log("== Server listening for requests")
})