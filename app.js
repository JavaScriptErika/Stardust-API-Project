/*
🌎 Global variables
*/
const displayFetchError = document.querySelector('.display-error')
const imageContainer = document.querySelector('.image-container')
const mainContainer = document.querySelector('.container')
const isLoading = document.querySelector('.loading')
const localWindowStorage = window.localStorage
const searchButton = document.getElementById('search-btn')
const searchInputField = document.getElementById('image-search')
const showPreviousSearches = document.querySelector('.show-previous-searches')
const newArr = []
let counter = 10

/*
🐭 Event Listeners
*/
searchButton.addEventListener('click', (e) => {
    e.preventDefault
    showLoadingIndicator(true)
    checkUserSearchValue()
})

/*
🍭 Display loading indicator
    1) Displays or doesn't depending on true/false state
*/
const showLoadingIndicator = (state) => {
    (state) ? isLoading.style.display = 'block' : isLoading.style.display = 'none'
}

/*
🐀 Check User Search Value
    1) Checks if user search value is empty string
        a) If empty, calls requestNasaApi with no argument, has default parameter
        b) If user provides argument, passes it to requestNasaApi for search term
    2) Checks if user search value is not empty string
        a) If not, passes value to displayPastSavedSearches to display search history
            via local storage
*/
const checkUserSearchValue = () => {
    const userSearchValue = searchInputField.value
    userSearchValue === "" ? requestNasaApi() : requestNasaApi(userSearchValue)
    userSearchValue === "" ? displayPastSavedSearches() : displayPastSavedSearches(userSearchValue)
    clearUserSearchValue(userSearchValue)
}

/*
🌌 Nasa Image API
    1) Fetch Nasa api - called from button click / retreieve user search
    2) Check if status is ok
    3) Call displayImagesFromAPi with deconstructed argument
*/
const requestNasaApi = (searchValue = 'stars') => {
    fetch(`https://images-api.nasa.gov/search?q=${searchValue}&media_type=image`)
        .then((response) => {
            if (!response.ok) {
                throw Error(response.status)
            } else {
                showLoadingIndicator(false)
                return response
            }
        })
        .then((response) => response.json())
        .then((response) => {
            const { items: imagesFromSearchArray } = response.collection
            displayImagesFromApi(imagesFromSearchArray)
        })
        .catch((error) => {
            showLoadingIndicator(false)
            displayFetchError.innerText = `${error}`
        })
}

//Checks imageArray length to only show 10 at a time depending on what API gives us

const displayImagesFromApi = (imagesArray) => {
    if (imagesArray.length > 10) {
        showMoreButton()
        limitDisplayToTen(imagesArray)
    } else {
        displayImages(imagesArray)
    }
}

//Push 10 items onto a new array, we do this so when we map over the array, only 10 items will display
const limitDisplayToTen = (imagesArray) => {
    newArr.length === 0 ? displayFirstTen(imagesArray) : displayNextTen(imagesArray)
    showButtonClicked(imagesArray)
}

const displayFirstTen = (imagesArray) => {
    for (var i = 0; i < 10; i++) {
        newArr.push(imagesArray[i])
    }
    displayImages(newArr)
}

const displayNextTen = (imagesArray) => {

    console.log(counter)

    for (var i = newArr.length; i < counter; i++) {
        newArr.push(imagesArray[i])
    }

    displayImages(newArr.slice(counter - 10))
}


/*🖼️ Display images from Nasa Api (user search)
    1) Map through images array
        a) For each picture, create a div, image element
           and source from api response.
    2) Append created image to created div, append to image container
*/
const displayImages = (imagesArray) => {
    let displayedImages = imagesArray.map((imgItem) => {
        const createImageDiv = document.createElement('div')
        const createParagraph = document.createElement('p')
        const createImage = new Image()

        createImageDiv.classList.add('image-div')
        createParagraph.innerHTML = imgItem.data[0].description
        createParagraph.classList.add("image-description")
        createImage.src = imgItem.links[0].href

        createImageDiv.appendChild(createImage)
        createImageDiv.appendChild(createParagraph)

        imageContainer.appendChild(createImageDiv)
    })

    displayImageDescription()
}

const displayImageDescription = () => {
    const imageDiv = document.querySelectorAll('.image-div')

    imageDiv.forEach(function (item, index) {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.image-description').style.display = 'inline'
        })

        item.addEventListener('mouseleave', () => {
            item.querySelector('.image-description').style.display = 'none'
        })
    })
}

const showMoreButton = () => {
    const showMoreBtn = document.createElement("BUTTON")
    const btnText = document.createTextNode("Show More")
    showMoreBtn.appendChild(btnText)
    mainContainer.appendChild(showMoreBtn)
}

const showButtonClicked = (imagesArray) => {
    const showMoreBtn = document.querySelector('button')
    showMoreBtn.addEventListener("click", () => {
        counter += 10
        displayNextTen(imagesArray)
    })
}

/*️🗝️️ Display saved searches
    1) Set key and value on window storage object
    2) Display saved searches
*/
const displayPastSavedSearches = (searchValue = 'stars') => {
    localWindowStorage.setItem(`searchTerm`, searchValue)
    const getSavedSearches = localWindowStorage.getItem(`searchTerm`)
    showPreviousSearches.innerHTML += `${getSavedSearches} `
}

const clearUserSearchValue = () => {
    searchInputField.value = ""
}