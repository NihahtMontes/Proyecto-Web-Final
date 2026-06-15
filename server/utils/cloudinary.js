const cloudinary = require('cloudinary').v2;

// Configuración con las variables de entorno del equipo
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Usamos upload_stream porque el archivo viene desde la memoria (multer memoryStorage)
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'bytehotel' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { uploadImage };