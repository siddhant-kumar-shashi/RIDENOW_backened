const jwt = require('jsonwebtoken')
const captainModel = require('../models/captain.model')

module.exports.captainauth = async( req , res , next) => {
    console.log('Inside captain middleware1')
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
    
    if( !token ){ return res.status(400).json({msg: "Invalid token"})}
    
    try{
        console.log('Inside captain middleware2')
        const decoded = jwt.verify(token , 'secret') ;
        const captain = await captainModel.findById(decoded._id); // notice incase of findOne you have to mention object
        
        if(captain){
            console.log('inside captainauth')
           req.captain = captain ;
           next() ; 
        }
    }
    catch(err){
        console.log(err)
        res.status(401).json({msg: 'unauthorised'})
    }

}