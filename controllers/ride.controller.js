const {validationResult} = require('express-validator')
const rideservice = require('../services/ride.service')
const { getAddressCoordinate, getCaptainsInTheRadius } = require('../services/maps.service')
const { sendMessageToSocketId } = require('../socket')
const rideModel = require('../models/ride.model')
const captainModel = require('../models/captain.model')

module.exports.createRide = async(req , res ) => {
    // console.log('sid')
     const errors = validationResult(req)
     if(!errors.isEmpty()){
        return res.status(201).json({errors: errors.array() })
     } 
     const {vehicleType , pickup , destination} = req.body;
     
     try{
       // console.log('Inside await ride service' , req.user)
         const ride = await  rideservice.createride({
            user: req.user._id,
            vehicleType,
            pickup,
            destination
         })
          res.status(200).json(ride)
          ride.otp = ""
        const pickupCoordinate = await getAddressCoordinate(pickup) 
    
        const captaininradius = await getCaptainsInTheRadius(pickupCoordinate.ltd , pickupCoordinate.lng , 40)
       
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
    
        console.log("Inside ride controller" , captaininradius[0].socketId , 'captain-->' , captaininradius)
    
        sendMessageToSocketId(captaininradius[0].socketId , {
            event: 'new-ride',
            data: rideWithUser
        })
  //     })

     }catch(err){
        console.log(err)
        res.status(400).json({msg: "Internal server error by sid"})
     }
}

module.exports.getfare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideservice.getfare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideservice.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('Inside ride controler')
    const { rideId, otp } = req.query;

    try {
        const ride = await rideservice.startRide({ rideId, otp, captain: req.captain });

    //    console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideservice.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}