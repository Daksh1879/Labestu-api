const Tesseract = require('tesseract.js')

async function ocrService(imagePath) {
    const result = await Tesseract.recognize(imagePath, 'eng');
const imageData = result.data.text;

return imageData
   
}


module.exports= ocrService;