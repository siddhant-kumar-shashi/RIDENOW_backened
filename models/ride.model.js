const mongoose =  require ('mongoose')

const rideschema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
       //    required:true,
        ref: 'captain' // note the captain inside const captainModel = mongoose.model('captain' , captainschema); should be written
    },
    pickup:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    fare:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending' , 'accepted' , 'completed' , 'cancelled'],
        default: 'pending'
    },
    duration:{
        type: Number
    },
    distance: {
        type: Number
    },
    paymentID:{
        type: String
    },
    OrderID:{
        type: String
    },
    signature:{
        type: String
    },
    otp:{
        required: true,
        type: Number
    }
})

const rideModel = mongoose.model('rideModel' , rideschema)

module.exports = rideModel