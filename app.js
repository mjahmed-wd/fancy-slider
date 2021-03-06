const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// My own api key from pixbay

const KEY = '20271709-a117cc307e4d937a887a34de4';

// show images 
const showImages = (images, totalImageCount) => {

    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div)
    })
    const imgL = images.length.toString()
    const imgT = totalImageCount.toString()
    showCount(imgL, imgT);
    displaySpinner();
}

//fetch from link

const getImages = (query) => {
    fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => {
            if (data.total > 0) {
                showImages(data.hits, data.total);
                console.log('showing data of best ', data.hits.length, ' from ', data.total)
            } else { showError() }
        })
        .catch(err => console.log(err))
}

// slide index

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');
    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        sliders.pop(img);
    }
}

var timer

// slider creation

const createSlider = () => {

    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    let duration = parseFloat(document.getElementById('duration').value) || 1000;
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    setInterval(function() {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

// search button

searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    document.getElementById('search-found').classList.add('d-none')
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
    displaySpinner();
    document.getElementById('search-not-found').classList.add('d-none')
})

// create slider button click handler

sliderBtn.addEventListener('click', function() {
    createSlider()
})

// enter button on search

document.getElementById("search").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('search-btn').click()
    }
});

// enter button on create slider

document.getElementById("duration").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('create-slider').click()
    }
});

// extra feature 1-- spinner

const displaySpinner = () => {
    document.getElementById('loading-spinner').classList.toggle('d-none')
}

// extra feature 2-- if no result found show error

const showError = () => {
    document.getElementById('search-not-found').classList.remove('d-none')
    displaySpinner();
}

// extra feature 3-- total found image count
const showCount = (imageShown, totalImages) => {
    document.getElementById('search-found').classList.remove('d-none')
    document.getElementById('search-found').innerText = `showing data of best  ${imageShown} from  ${totalImages} matching results`;
}