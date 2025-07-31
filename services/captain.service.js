const mongoose = require('mongoose');
const captainModel = require('../models/captain.model');

module.exports.createcaptain = async ({firstname , lastname , email , password , color , plate , capacity , vehicleType}) => {
    if( !firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error('All fields are required')
    }
   // console.log('captainservice')
    const captain = captainModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password,
        vehicle:{
            vehicleType,
            color,
            plate,
            capacity
        }

    })
     return captain
}