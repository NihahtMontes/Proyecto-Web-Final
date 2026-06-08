const multer = require('multer');

// Usamos el almacenamiento en memoria para no guardar los archivos temporalmente en el disco duro, 
// ya que los pasaremos directamente a Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };