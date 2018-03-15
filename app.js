
fetch(`https://images-api.nasa.gov/search?q=milkyway&media_type=image`)
    .then((response) => response.json())
    .then((response) => {
        const { items: imagesFromSearchArray } = response.collection
        displayImagesFromApi(imagesFromSearchArray)
    })



    const displayImagesFromApi = (imagesArray) => {
        const imageContainer = document.querySelector('.image-container')

        const displayImages = imagesArray.map((imgItem) => {
                const createImage = new Image()
                const createImageDiv = document.createElement('div')

                createImage.src = imgItem.links[0].href
                createImageDiv.appendChild(createImage)
                return imageContainer.appendChild(createImageDiv)
            })
    }