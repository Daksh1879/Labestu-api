const Scan = require('../models/Scan');
const ocrService = require('./ocrService');
const labelParser = require('./labelParser');
async function processScan(scanId) {


const scan = await Scan.findById(scanId);
 if (!scan) {   
      return ;
    }

let updatedScan = await Scan.findByIdAndUpdate(scanId,    { status:'processing' },   { returnDocument: 'after' })
try{
const text = await ocrService(scan.imagePath);
const extractedData = labelParser(text);
 updatedScan = await Scan.findByIdAndUpdate(scanId,    { status:'completed' , extractedText:text,    extractedData: extractedData },    { returnDocument: 'after' })
 }
 catch(error){     console.error(error);
    updatedScan= await Scan.findByIdAndUpdate(scanId,{status:'failed'},{returnDocument: 'after'})
 }
}

module.exports =processScan;