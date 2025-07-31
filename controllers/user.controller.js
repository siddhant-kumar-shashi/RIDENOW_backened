const userModel = require('../models/user.model');
const {createUser} =  require('../services/user.service') // curly braces required
const blacklistToken = require('../models/blacklistedtoken.model');

module.exports.registerUser = async (req, res) => {
    const {fullname , email , password} = req.body ;
    const {firstname , lastname} = fullname;

    const isuser = await userModel.findOne({ email })
    if( isuser ){ return res.status(400).json({msg: "User already exists"})}
    
  //  console.log('shahsi2');

    const hashpassword = await userModel.hashpassword(password); // note here await must be used as hashpassword will return promise
    const user = await createUser({
        firstname,
        lastname,
        email,
        password: hashpassword
    });
    const token = user.generateAuthtoken();
    res.status(200).json({ token , user}) ;

}

  module.exports.loginUser = async(req, res) => {
    
    const { email , password } = req.body ;
    // console.log(password)
    const authenticuser = await userModel.findOne({email}).select('+password');
    if( !authenticuser){
      return res.status(400).json({msg: 'Invalid email'});
    }
    const ismatch = await authenticuser.comparepassword(password) ;
   
    if( ismatch ){
        const token =  authenticuser.generateAuthtoken() ;
        res.status(200).json({ token , authenticuser }) ;
      //    localStorage.setItem('token', token);    -->  never use localstorage in backened
      
      //  res.cookie('token' , token);
    }
    else{
        res.status(400).json({msg: 'password does not match'});
    }
}

module.exports.Userprofile = async(req , res) => {
    res.status(200).json(req.user)  // curly braces not required as req.user is itself an object
}

module.exports.logoutuser = async( req, res) => {
  //  res.clearCookie('token');
    const token = /* req.cookies.token || */ ( req.headers.authorization && req.headers.authorization.split(' ')[1] ) || localStorage.getItem('token') ;
    
    blacklistToken.create({token}) ; 
    res.status(200).json({msg: 'user logged out'}) ;
}
