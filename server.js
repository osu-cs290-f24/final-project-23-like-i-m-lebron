var path = require('path')
var express = require('express')
var exphbs = require('express-handlebars')

var albumData = require("./albumData.json")

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs.engine({
    default: "main"
}))
app.set("view engine", "handlebars")

app.use(express.static('static'))

app.get('*', function (req, res) {
    res.status(404).render("errorPage")
})

app.listen(port, function () {
    console.log("== Server is listening on port", port)
})
