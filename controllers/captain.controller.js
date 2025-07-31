const jwt = require('jsonwebtoken');
const captainservice = require('../services/captain.service');
const captainModel = require('../models/captain.model');
const userModel = require('../models/user.model');
const blacklistcaptainModel = require('../models/blacklistedcaptainToken');
const {validationResult} = require('express-validator')

module.exports.registerCaptain = async (req , res) =>{
 //  console.log('what2')
   const {fullname , email , password , vehicle} = req.body;
   const {firstname , lastname} = fullname
   const {color , plate , capacity , vehicleType } = vehicle

   if( !fullname  || !email || !password || !vehicle ){
      return res.status(400).json({msg:'All fields are required'})
   }
   
   const iscaptain = await  captainModel.findOne({email})
   if(iscaptain) return res.status(401).json({msg: 'captain already exist with given email'})

   const hashedpassword = await captainModel.hashpassword(password) ;
//console.log('what3')
   const captain = await captainservice.createcaptain({
    firstname , 
    lastname , 
    email , 
    color, 
     plate, 
    capacity , 
    vehicleType, 
    password: hashedpassword
});
   const token = captain.generateAuthtoken() ;
   return res.status(200).json({ token , captain}) ;
}

module.exports.loginCaptain = async (req , res) => {
    
   const {email , password} = req.body
   const errors = validationResult(req)
     if(!errors.isEmpty()){
        return res.status(201).json({errors: errors.array() })
     } 
    
   const captain = await captainModel.findOne({email}).select('+password') ;
   
   if( !captain ){
      return res.status(401).json({msg: 'email doesnt exists'})
   }  
   const comparepass = await captain.comparepassword(password) ;

   if( !comparepass ){ return res.status(401).json({msg: 'enter correct password'})}

   const token = captain.generateAuthtoken();

   res.status(200).json({token , captain})
  // res.cookie('token' , token ) ;      

}

module.exports.logoutCaptain = async (req , res) => {
   const token = req.headers.authorization.split(' ')[1]
   
   const iscaptainalreadyblocked = await blacklistcaptainModel.findOne({token})
   if( iscaptainalreadyblocked ) return res.status(401).json({msg: "captain already logged out"})

   blacklistcaptainModel.create({token})

   res.status(200).json({msg: 'captain logged out'})
   
}

module.exports.captainprofile = async (req , res ) => {
 //  console.log('captainprofile')
//   console.log('Inside captaincontroller' + req.captain)
  return res.status(200).json(req.captain)
}