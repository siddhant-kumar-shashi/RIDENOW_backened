const userModel = require('../models/user.model')

module.exports.createUser = async({firstname , lastname , email , password}) => {
    if( !firstname || !password || !email) {
        throw new Error('All fields reuqired')
    }
    const user = await userModel.create({
        fullname:{
            firstname,
            lastname
        },
        password,
        email
    })

    return user ;
}