const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userschema = mongoose.Schema({
    fullname:{
        firstname:{
        type: String,
        required : true,
        minlength: [5 , 'firstname must be 5 charcters long' ]
        },
        lastname:{
          type: String,
        }
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    email:{
        required: true,
        unique: true,
        type: String,
        minlength: [9 , 'minimum email length must be 9 charac long']
    }

})

userschema.methods.generateAuthtoken = function(){ // never use () => as it do not support this
    const token = jwt.sign({_id: this._id}, 'secret');
    return token ; 
}

userschema.methods.comparepassword = async function (password) {
  //  console.log('pass2' + this.password)
    return await bcrypt.compare(password , this.password)
}

userschema.statics.hashpassword = async function (password) {
    return await bcrypt.hash(password , 10);
}

const userModel = mongoose.model('user' , userschema);

module.exports = userModel ;