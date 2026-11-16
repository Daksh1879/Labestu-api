const bcrypt = require('bcryptjs');
const express= require('express');
const Officer = require('../models/Officer');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register',async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if((typeof name != 'string'||!name.trim())||
            (typeof email != 'string'||!email.trim())||
            (typeof password != 'string'||!password)){
               return res.status(400).json({message: 'name,email,password are required'})
            }
            const normalizedEmail = email.trim().toLowerCase();
         const existingOfficer = await Officer.findOne({ email:normalizedEmail });
        if(existingOfficer!=null){ return res.status(409).json({
        message: 'Email already registered'
    });;}
        else{
            const hashedPassword = await bcrypt.hash(password, 12);
            const normalizedEmail = email.trim().toLowerCase();
        const newData = await Officer.create({name,email:normalizedEmail,password:hashedPassword});}
       res.status(201).json({
    message: 'Officer registered successfully'
});;
    }
    catch(error){
         console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }
        return res.status(500).json({
            error: 'Registration failed'
        });
    }
})


router.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body;
      const existingOfficer = await Officer.findOne({email:email});
        if(!existingOfficer){
           return res.status(401).json({message:'Invalid email or password'});
        }
        if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid input' });
}
console.log('Password:', password, typeof password);
console.log('Stored hash:', existingOfficer.password, typeof existingOfficer.password);
      const isMatch= await bcrypt.compare(password, existingOfficer.password);
       if(!isMatch){
           return res.status(401).json({message:'Invalid email or password'});
        }
        
       const token = jwt.sign(
        { id: existingOfficer._id ,
        
             role: existingOfficer.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
        );
        res.status(200).json({
            message:"Logged in successfully",
            token:token
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: 'Login failed'
        });}
})

module.exports = router;

