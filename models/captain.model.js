const mongoose = require('mongoose');
const { number } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const captainschema = mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            minlength:[5 , 'minimum firstname must be 5 charcters long'],
            required: true
        },
        lastname:{
            type: String,
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength:[9 , 'must be minimum 9 characters long']
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    status:{
        type: String,
        required: true,
        enum: ['active' , 'inactive'],
        default: 'active'
    },
    vehicle:{
        color:{
            type:String,
            required: true,
            minlength:[3, 'minimum color length must be 3 charcters long'],
        },
        plate:{
            type: String,
            minlength: [3 , 'plate must be 3 charcters long'],
            required: true
        },
        capacity:{
            type: Number,
            required: true,
            min: [1 , 'capacity must be atleast 1 ']
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car' , 'auto' , 'motor']
        }
    },
    location:{
        ltd: {
            type: Number
        },
        lng:{
            type: Number // n should be capital
        }
    }

})

captainschema.methods.generateAuthtoken = function(){ // never use () => as it do not support this operator
    const token = jwt.sign({_id: this._id}, 'secret' , {expiresIn: '24h'});
    return token ; 
}   

captainschema.methods.comparepassword = async function (password) {
    return await bcrypt.compare(password , this.password)
}

captainschema.statics.hashpassword = async function (password) {
    return await bcrypt.hash(password , 10);
}

const captainModel = mongoose.model('captain' , captainschema);

module.exports = captainModel ;