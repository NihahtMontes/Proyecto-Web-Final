const axios = require('axios');

// Caché en memoria para no gastar peticiones a la API
const imageCache = new Map();

const searchHotelImages = async (hotelName) => {
  if (imageCache.has(hotelName)) {
    return imageCache.get(hotelName);
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://booking-com.p.rapidapi.com/v1/hotels/search',
      params: { text: hotelName, locale: 'es' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    // Asumiendo que la API devuelve un array de resultados con url de imagen principal
    const images = response.data.result.slice(0, 5).map(hotel => hotel.main_photo_url);
    
    imageCache.set(hotelName, images);
    return images;
  } catch (error) {
    console.error('Error buscando imágenes en RapidAPI:', error.message);
    return []; // Retorna array vacío para no quebrar el frontend
  }
};

module.exports = { searchHotelImages };