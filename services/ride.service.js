const mapservice = require('./maps.service')
const rideModel = require('../models/ride.model')
const crypto = require('crypto')

async function getfare(pickup , destination ){
  // console.log('hello')
    if( !pickup || !destination ){
        return { error: 'Both pickup and destination are required' };
    }
    const distancetime =  await mapservice.getdistancetime(pickup , destination) ;

    const basefare = {
        auto: 10,
        motor: 30,
        car: 50
    }
    const Perkmrate = {
        auto: 8,
        motor: 15,
        car: 10 
    }
    const Perminrate = {
        auto: 1.5,
        motor:2,
        car: 3
    }
    const fare = {
        auto: Math.round(basefare.auto + ((distancetime.distance.value / 1000) * Perkmrate.auto) + ((distancetime.duration.value / 60) * Perminrate.auto)),
        car: Math.round(basefare.car + ((distancetime.distance.value / 1000) * Perkmrate.car) + ((distancetime.duration.value / 60) * Perminrate.car)),
        moto: Math.round(basefare.motor + ((distancetime.distance.value / 1000) * Perkmrate.motor) + ((distancetime.duration.value / 60) * Perminrate.motor))
    }
        // here parseFloat will separate integer 10 from string '10 km'
    return fare ; 
}

module.exports.getfare = getfare

getotp = () =>{
   return crypto.randomInt(100000 , 1000000) // otp b/w 100000 - 99999
}

module.exports.createride = async ({pickup , destination , vehicleType , user}) => {
    if( !user || !pickup || !destination || !vehicleType ){
        return res.status(201).json({msg: 'All fields are required'})
    }
    const fare = await getfare(pickup , destination) ;
    console.log('Ride service')
    const ride = await rideModel.create({  // do not miss await
        user,
        pickup,
        destination,
        fare: fare.vehicleType,
        otp: getotp()    // do not write like getotp only
   })

   return ride ; 
}

module.exports. confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

   const sid =  await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    } , 
    { new: true }  // returns the updated document
)

console.log( "ride1--> " ,  sid)

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    console.log("ride2--->" , ride)
   
    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }
console.log('Inside ride service')
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }
console.log( "otp1-->" , ride.otp ,  typeof ride.otp)
        console.log( "otp2-->" ,  otp , typeof otp)
    
        if (ride.otp?.toString().trim() !== otp?.toString().trim() ) {
        
        throw new Error('Invalid OTP');
    }

 const response =     await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })
console.log( "Inside ride service of startride--- -- -->" ,response)
    return ride;
}