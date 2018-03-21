const searchButton = document.getElementById('search-btn')
const searchInputField = document.getElementById('image-search')
const localWindowStorage = window.localStorage
const showPreviousSearches = document.querySelector('.show-previous-searches')

searchButton.addEventListener('click', (e) => {
    e.preventDefault
    const userSearchValue = searchInputField.value

    userSearchValue === "" ? requestNasaApi() : requestNasaApi(userSearchValue)
    userSearchValue !== "" ? displayPastSavedSearches(userSearchValue) : ''
})


const requestNasaApi= (SearchValue = 'stars') => {
    fetch(`https://images-api.nasa.gov/search?q=${SearchValue}&media_type=image`)
    .then((response) => response.json())
    .then((response) => {
        const { items: imagesFromSearchArray } = response.collection
        displayImagesFromApi(imagesFromSearchArray)
    })
}

const displayImagesFromApi = (imagesArray) => {
    const imageContainer = document.querySelector('.image-container')

    const displayImages = imagesArray.map((imgItem) => {
        const createImageDiv = document.createElement('div')
        const createImage = new Image()

        createImage.src = imgItem.links[0].href
        createImageDiv.appendChild(createImage)
        return imageContainer.appendChild(createImageDiv)
        })
}

const displayPastSavedSearches = (searchValue) => {
    localWindowStorage.setItem(`searchTerm`, searchValue)
    const getSavedSearches = localWindowStorage.getItem(`searchTerm`)
    showPreviousSearches.innerHTML += `${getSavedSearches} `
}