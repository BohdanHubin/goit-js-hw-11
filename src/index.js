
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import  fetchImages  from './js/fetchImages'


const formRef = document.querySelector('.search-form');
const galleryItems = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const textМessageAboutGallery = document.querySelector('.text-message');


 function renderPictureCard(picture) {
  const markup = picture.map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads,}) => {
        return `<div class='photo-card'>
  <a href='${largeImageURL}'>
    <img src='${webformatURL}' alt='${tags}' loading='lazy' />
  </a>
  <div class='info'>
    <p class='info-item'>
      <b>Likes</b>
      ${likes}
    </p>
    <p class='info-item'>
      <b>Views</b>
      ${views}
    </p>
    <p class='info-item'>
      <b>Comments</b>
      ${comments}
    </p>
    <p class='info-item'>
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
      }
    ).join('');

  galleryItems.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {captions: true,captionDelay: 250});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

formRef.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value.trim();
  
  if (!searchQuery) {
      Notify.warning('The search field is empty! Please, enter a search term')
      formRef.reset()
    return;
  }
    

    const dataFetch = await fetchImages(searchQuery, currentPage);
    const response = await dataFetch.data;
    currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreButton.classList.remove('is-hidden');
  } else {
    loadMoreButton.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      galleryItems.innerHTML = '';
      renderPictureCard(response.hits);
      lightbox.refresh();
      textМessageAboutGallery.classList.add('is-hidden');

      const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * -50,
        behavior: 'smooth',
      });
    }
    if (response.totalHits === 0) {
      galleryItems.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreButton.classList.add('is-hidden');
      textМessageAboutGallery.classList.add('is-hidden');
    }
      
  } catch (error) {
    console.log(error);
  }
}

loadMoreButton.addEventListener('click', clickOnLoadMoreButton);

async function clickOnLoadMoreButton() {
  currentPage += 1;
    const dataFetch = await fetchImages(searchQuery, currentPage);
    const response = await dataFetch.data;
  renderPictureCard(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreButton.classList.add('is-hidden');
    textМessageAboutGallery.classList.remove('is-hidden');
  }
}