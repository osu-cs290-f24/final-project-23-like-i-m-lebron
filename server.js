var express = require("express")
var app = express()
var exphbs = require('express-handlebars')

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
    res.status(200).render("highestratedPage")
})

app.get('/queue', function (req, res, next) {
    res.status(200).render("myqueuePage")
})

app.get('/reviews', function (req, res, next) {
    res.status(200).render("myreviewsPage")
})

app.get('/', function (req, res, next) {
    res.status(200).render("homePage")
})

app.get('*', function (req, res, next) {
    res.status(404).render("errorPage")
})

app.listen(3000, function () {
    console.log("== Server listening for requests")
})