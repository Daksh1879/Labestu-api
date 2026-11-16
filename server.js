require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');

const Scan = require('./models/Scan');

const express = require('express');
const app = express();

const PORT = process.env.PORT||3002;

const cors = require('cors');
app.use(cors({
    origin: 'https://frontend-2-gilt.vercel.app'
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

const processScan = require('./services/scanProcessor');

const scanJson = path.join(__dirname,'scans.json')

const upload = require('./middleware/upload');

async function getData() {
    const data = await fs.readFile(scanJson,'utf8');
    return JSON.parse(data);
}

const verifyJWT = require('./middleware/verifyJWT');

app.get('/api/scans',verifyJWT,async (req,res)=>{try{
    let scans;
    if(req.user.role === 'Reviewer'){ scans = await Scan.find();}
else{scans = await Scan.find({ createdBy: req.user.id})}
    res.status(200).send(scans);
    //  const data =await getData();
    // res.json(data);
}
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
})

app.get('/api/scans/:id',verifyJWT,async (req,res)=>{
    try{
        const id = req.params.id;
         if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: 'Enter a valid ID' });
}
        const scans = await Scan.findById(id);
        
       
        if (!scans) {   
      return res.status(404).json({ message: 'Enter valid id' });
    }

    if(req.user.role =="Inspector" &&scans.createdBy.toString()!=req.user.id){
        return res.status(403).json({ message: 'Forbidden' });
    }
    else
       { res.status(200).json(scans);}
    
    }
    catch(error) {
    console.error(error);
        res.status(500).json({ error: 'Internal server error' });}

    })

app.post('/api/scans',verifyJWT,upload.single('image'),async (req,res)=>{
    let file = req.file.path;
    try{
    if(!req.file){return res.status(400).json({message:'Bad Request'})};
const { fileTypeFromFile } = await import('file-type');
    
    const detectedType = await fileTypeFromFile(file)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if(!detectedType || !allowedTypes.includes(detectedType.mime)){
       await fs.unlink(file);
        return res.status(400).json({message:'Upload appropriate filetype'})
    }
    const { category } = req.body;
    if (typeof category !== 'string' || !category.trim()) {
       await fs.unlink(file);
    return res.status(400).json({
        message: 'Category is required'
    });
}

    const newScan = await Scan.create({
    category: category.trim(),
    createdBy: req.user.id,
    imagePath: req.file.path,
});

processScan(newScan._id).catch(error => {
    console.error("Background processing failed:", error);
});
return res.status(201).json(newScan);}
     catch (error) {
      try{await fs.unlink(file); }
      catch(error){res.status(400)}
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    

}
})


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT,()=>{
    console.log(`Running on http://localhost:${PORT}`)
})
    }
    catch(error){console.log('MongoDB connection failed:', error.message)}
}

connectDB();
