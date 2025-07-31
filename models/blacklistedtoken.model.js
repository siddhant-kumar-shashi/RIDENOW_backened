const mongoose = require('mongoose')

const blacklistschema = mongoose.Schema({
    token:{
         type: String,
         required: true,
         unique: true 
    },
    craetedAt:{
        type: Date,
        default: Date.now(),
        expires: 60 * 60 * 24
    }
})

const blacklistToken = mongoose.model('blacklistToken' , blacklistschema ) ;
module.exports = blacklistToken ;