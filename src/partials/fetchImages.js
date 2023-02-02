import axios from "axios";
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY ='33243113-062ba664c841c8d43d517954c'

export default async function fetchImages(value, page) {
    const filter = `?key=${API_KEY}&q=${value}$&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    return await axios.get(`${BASE_URL}${filter}`).then(response => response.data);
}