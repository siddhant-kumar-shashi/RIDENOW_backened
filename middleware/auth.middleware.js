const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken')
const blacklistToken = require('../models/blacklistedtoken.model')

module.exports.authuser = async( req , res , next) => {
 //   console.log('Inside auth middleware')
    const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) ;
    if( !token ){
      return  res.status(200).json({ msg: 'Unauthorised'})
    }

    const isblacklisted = await  blacklistToken.findOne({token : token});

    if( isblacklisted ){
        return res.status(200).json({msg: 'already logged out'});
    }

    try {
     //   console.log('Inside auth middleware try')
        const decoded = jwt.verify(token , 'secret' ); // improve 'secret' by process.env.JWT_SECRET
        const user = await  userModel.findById(decoded._id);
         
        if(user) req.user = user ;
        next() ;
        
    } catch(err){
        return res.status(401).json({msg: 'unauthorised'})
    }
}