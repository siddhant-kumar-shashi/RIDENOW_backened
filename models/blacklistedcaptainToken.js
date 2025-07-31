const mongoose = require('mongoose')

const blacklistcaptainschema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60 * 60 * 24
    }

})

const blacklistcaptainModel = mongoose.model('blacklistcaptainModel'  , blacklistcaptainschema ) ;

module.exports = blacklistcaptainModel ; 