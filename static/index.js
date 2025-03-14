///////////////////////////////////////////////////////////////////////////
// INSERT A NEW ALBUM USING HANDLEBARS TEMPLATE (if adding an album)

function insertNewAlbumWithHandleBars(title, year, artist, photoURL, rating) {

    //use albumTemplate.handlebars to generate a new album 
    var newAlbum = Handlebars.templates.albumTemplate({
        title: title,
        year: year,
        artist: artist,
        photoURL: photoURL,
        rating: rating
    })

  
    //select the the review and ratings sections by their ids (not queue) so that new albums can be inserted
    var albumSections = document.querySelectorAll("#review-section, #rating-section")

    //go thru all album sections (queue, reviews, popular)
    albumSections.forEach(function (section) {

        //get the links at bottom of homepage sections
        var seeAllLink = section.querySelector(".see-more-link")

        //if above exists (if you are on the homepage):
        if (seeAllLink) {

            //insert the new album just after the container title
            seeAllLink.insertAdjacentHTML("beforebegin", newAlbum)

        } else {

            //default
            section.insertAdjacentHTML("beforeend", newAlbum)
        }
    })
    
}

///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
// SHOWING AND HIDING THE ADD ALBUM MODAL

//show the add album modal when clicked
function showModal(event) {
    var modal = document.getElementById("add-album-modal")
    var backdrop = document.getElementById("modal-backdrop")
    modal.classList.remove("hidden")
    backdrop.classList.remove("hidden")
}


//get the button from the navBar - then add event 
var addAlbumButton = document.getElementById("add-album-button")
addAlbumButton.addEventListener("click", showModal)


//clear all input fields if X or Cancel are clicked
function clearInputFields() {
    document.getElementById("album-title-input").value = ""
    document.getElementById("album-year-input").value = ""
    document.getElementById("album-artist-input").value = ""
    document.getElementById("post-photo-input").value = ""
    document.getElementById("album-review-input").value = ""
    document.querySelector('#album-rating-input').selectedIndex = 0
    document.getElementById("album-song-input").value = ""
}


//close the add album modal when X or cancel clicked
function closeModal(event) {
    var modal = document.getElementById("add-album-modal")
    var backdrop = document.getElementById("modal-backdrop")
    modal.classList.add("hidden")
    backdrop.classList.add("hidden")

    clearInputFields()
}


//get the X and cancel buttons from modal - then add events
var closeX = document.getElementById("modal-close")
var cancelButton = document.getElementById("modal-cancel")
closeX.addEventListener("click", closeModal)
cancelButton.addEventListener("click", closeModal)
//////////////////////////////////////////////////////////////////////////


//array to store all of the albums
var allAlbums = []


//////////////////////////////////////////////////////////////////////////
// ADDING THE ALBUM IF "ADD" IS CLICKED IN MODAL
function addNewAlbum() {

    console.log("Add album clicked")

    //get the values of each field
    var title = document.getElementById("album-title-input").value
    var year = document.getElementById("album-year-input").value
    var artist = document.getElementById("album-artist-input").value
    var photoURL = document.getElementById("post-photo-input").value
    var review = document.getElementById("album-review-input").value
    var rating = document.querySelector('#album-rating-input').value
    var song = document.getElementById("album-song-input").value

    var integer_rating = rating.split("☆").length - 1

    //alert if not all fields are filled out
    if (!title || !year || !artist || !photoURL || !review || !song) {
        alert("You must fill in all of the fields!")
    } else {
        console.log("Adding album:", title, year, artist, photoURL, rating, song)

        const newAlbum = {
            title,
            year,
            artist,
            photoURL,
            review,
            rating,
            queued: false,
            "integer-rating": integer_rating,
            reviewExists: review.trim() !== "",
            song
        }

        //send the new album to the server
        fetch('/add-album', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlbum)
        })
        .then(response => {
            if (response.ok) {
                console.log("Album added successfully")
                allAlbums.push(newAlbum)
                renderAllAlbums()
                closeModal()
            } else {
                return response.text().then(text => { throw new Error(text); })
            }
        })
        .catch(error => {
            console.error("Error adding album:", error)
            alert("Failed to add album: " + error.message)
        })

        //renderAllAlbums()

        //close the modal
        var modal = document.getElementById("add-album-modal")
        var backdrop = document.getElementById("modal-backdrop")
        modal.classList.add("hidden")
        backdrop.classList.add("hidden")
        clearInputFields()
    }
    
}


//uses insertNewAlbumWithHandleBars to render each album in allAlbums array
function renderAllAlbums() {
    allAlbums.forEach(album => {
        insertNewAlbumWithHandleBars(
            album.title,
            album.year,
            album.artist,
            album.photoURL,
            album.rating
        )
    })
}


var addButton = document.getElementById("modal-add")
addButton.addEventListener("click", addNewAlbum)

//////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////
// ADDING THE ALBUM TO THE QUEUE IF "QUEUE" IS CLICKED IN MODAL
function addAlbumToQueue() {

    console.log("Add album to queue clicked")

    //get the values of each field
    var title = document.getElementById("album-title-input").value
    var year = document.getElementById("album-year-input").value
    var artist = document.getElementById("album-artist-input").value
    var photoURL = document.getElementById("post-photo-input").value
    var review = document.getElementById("album-review-input").value
    var rating = document.querySelector('#album-rating-input').value
    var song = document.getElementById("album-song-input").value

    //alert if not all fields are filled out
    if (review || song) {
        alert("You must fill in ONLY the queue fields: Album Title, Release Date, Artist Name, Cover URL")
    } else if (!title || !year || !artist || !photoURL) {
        alert("You must fill in the necessary queue fields: Album Title, Release Date, Artist Name, Cover URL")
    } else {

        //only these fields for queued albums
        const newAlbum = {
            title,
            year,
            artist,
            photoURL,
            "queued": true,
            "reviewExists": false
        }

        //send the new album to the server
        fetch('/add-album', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlbum)
        })
        .then(response => {
            if (response.ok) {
                console.log("Album added successfully")
                allAlbums.push(newAlbum)
                renderAllAlbumsQueued()
                closeModal()
            } else {
                return response.text().then(text => { throw new Error(text); })
            }
        })
        .catch(error => {
            console.error("Error adding album:", error)
            alert("Failed to add album: " + error.message)
        })

        //renderAllAlbums()

        //close the modal
        var modal = document.getElementById("add-album-modal")
        var backdrop = document.getElementById("modal-backdrop")
        modal.classList.add("hidden")
        backdrop.classList.add("hidden")
        clearInputFields()
    }
    
}


function renderAllAlbumsQueued() {
    allAlbums.forEach(album => {
        insertNewAlbumWithHandleBars(
            album.title,
            album.year,
            album.artist,
            album.photoURL
        )
    })
}


var addQueueButton = document.getElementById("modal-queue")
addQueueButton.addEventListener("click", addAlbumToQueue)

//////////////////////////////////////////////////////////////////////////








