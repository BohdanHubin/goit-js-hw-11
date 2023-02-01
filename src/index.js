import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";




const fornRef = document.getElementById('search-form');
const inputREf = document.querySelector('[name="searchQuery"]')
const galleryRef = document.querySelector('.gallery');
const loadMoreButton =document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY ='33243113-062ba664c841c8d43d517954c'

let pageNumber = 1;

fornRef.addEventListener('submit', onSubmit)

async function fetchPicrute (searchName) {
   const url = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`)
    const data = await url.data
    const hits = await data.hits
    return hits
}

function onSubmit(event) {
    event.preventDefault();

    const pictureToFind = event.target.searchQuery.value.trim()
   
    fetchPicrute(pictureToFind).then(renderPictureCard).catch(error => {console.log(error)})
}

function renderPictureCard (picture) {
    galleryRef.innerHTML = picture.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card card" style="width: 18rem;">
                <a class="gallery__item" href="${largeImageURL}"><img class="card-img-top" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                <div class="info card-body">
                <p class="info-item">
                <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                <b>Viewes: ${views}</b>
                </p>
                <p class="info-item">
                <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                <b>Downlads: ${downloads}</b>
                </p>
                </div>
                </div>`
    }).join('');
    lightbox.refresh();
}

const lightbox = new SimpleLightbox(".gallery a", {captionDelay: 250, });