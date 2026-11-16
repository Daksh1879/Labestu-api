const bcrypt = require('bcryptjs');
const express= require('express');
const Officer = require('../models/Officer');
const jwt = require('jsonwebtoken');
const router = express.Router();

const verifyJWT = ('/',async(req,res,next)=>{try{
    const header = req.get('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Token missing or invalid format'
            });
        }
    const token = header.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Invalid token"});
    }
    const verifiedToken = jwt.verify(token,process.env.JWT_SECRET);
    req.user = verifiedToken;

    next();}
    catch(error){
        res.status(401).json({message:"Invalid or expired token"})
    }
})

module.exports = verifyJWT;