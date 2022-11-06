const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')
const {check,validationResult} = require('express-validator')
router.post('/signin',[check('email','Please include a valid email')
.isEmail(),
check(
    'password',
    'password is requried'
).exists()],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
        const {email,password} = req.body;
        try{
         let user = await User.findOne({email});
         if(!user){
             res.status(400).json({errors:[{msg:'Invalid credentials'}]})
         }
     
         const isMatch = await bcrypt.compare(password,user.password);
         if(!isMatch){
             res.status(400).json({errors:[{msg:'Invalid credentials'}]})
         }
        
         const payload ={
             user:{
                 id:user.id
             }
         }
         jwt.sign(payload,"secretkey",{expiresIn:3000000}
         ,(err,token)=>{
             if(err) throw err;
             res.json({token});
         })
     
        }catch(err){
         console.log(err)
     
        }
     
         //see if users exists
     
         // get users avatar
     
         //encrypt password
     
         //return jsonwebtoken
         // res.send('User Route')
 })
    

 router.post('/signup',[check('name','Name is required')
 .not()
 .isEmpty(),
 check('email','Please include a valid email').isEmail(),
 check(
     'password',
     'Please enter a password with 6 or more characters'
 )],async (req,res)=>{
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()})
     }
     const {name,email,password} = req.body;
    try{
     let user = await User.findOne({email});
     if(user){
         res.status(400).json({errors:[{msg:'User already exists'}]})
     }
    
     user = new User({
         name,email,password
     });
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(password,salt);
 
     await user.save();
 
     const payload ={
         user:{
             id:user.id
         }
     }
     jwt.sign(payload,"secretkey",{expiresIn:360000}
     ,(err,token)=>{
         if(err) throw err;
         res.json({token});
     })
 
    }catch(err){
     console.log(err)
 
    }
 
     //see if users exists
 
 
     // get users avatar
 
     //encrypt password
 
     //return jsonwebtoken
     // res.send('User Route')
 })

 module.exports= router
     