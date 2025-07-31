const express = require('express')
const   router = express.Router()
const {body , query} = require('express-validator')
const ridecontroller = require('../controllers/ride.controller') 
const authMiddleware = require('../middleware/auth.middleware') 
const captainMiddleware = require('../middleware/captain.middleware')

router.post('/create',
    authMiddleware.authuser,   
    body('pickup').isString().isLength({min: 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto' , 'car' , 'motor-cycle']).withMessage('Invalid vehicle type'),
    ridecontroller.createRide // there was typo here
    
)

router.get('/get-fare',
    authMiddleware.authuser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    ridecontroller.getfare
)

router.post('/confirm',
    captainMiddleware.captainauth,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    ridecontroller.confirmRide
)

router.get('/start-ride',
    captainMiddleware.captainauth,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    ridecontroller.startRide
)

router.post('/end-ride',
    captainMiddleware.captainauth,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    ridecontroller.endRide
)

module.exports = router ;   