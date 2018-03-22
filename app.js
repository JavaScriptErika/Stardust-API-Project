/*
🌎 Global variables 🌎
*/
const displayFetchError = document.querySelector('.display-error')
const imageContainer = document.querySelector('.image-container')
const isLoading = document.querySelector('.loading')
const localWindowStorage = window.localStorage
const searchButton = document.getElementById('search-btn')
const searchInputField = document.getElementById('image-search')
const showPreviousSearches = document.querySelector('.show-previous-searches')

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
    userSearchValue !== "" ? displayPastSavedSearches(userSearchValue) : ''
}

/*
🌌 Nasa Image API
    1) Fetch Nasa api - called from button click / retreieve user search
    2) Check if status is ok
    3) Call displayImagesFromAPi with deconstructed argument
*/
const requestNasaApi= (searchValue = 'stars') => {
    fetch(`https://images-api.nasa.gov/search?q=${searchValue}&media_type=image`)
    .then((response) => {
        if(!response.ok){
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

/*🖼️ Display images from Nasa Api (user search)
    1) Map through images array
        a) For each picture, create a div, image element
           and source from api response.
    2) Append created image to created div, append to image container
*/
const displayImagesFromApi = (imagesArray) => {
    const displayImages = imagesArray.map((imgItem) => {
        const createImageDiv = document.createElement('div')
        const createImage = new Image()

        createImage.src = imgItem.links[0].href
        createImageDiv.appendChild(createImage)
        return imageContainer.appendChild(createImageDiv)
        })
}

/*️🗝️️ Display saved searches
    1) Set key and value on window storage object
    2) Display saved searches
*/
const displayPastSavedSearches = (searchValue) => {
    localWindowStorage.setItem(`searchTerm`, searchValue)
    const getSavedSearches = localWindowStorage.getItem(`searchTerm`)
    showPreviousSearches.innerHTML += `${getSavedSearches} `
}