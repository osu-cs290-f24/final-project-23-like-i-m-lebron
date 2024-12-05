var express = require("express")
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

app.use(express.static("static"))

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