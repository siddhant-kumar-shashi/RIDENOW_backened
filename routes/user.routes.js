const express = require('express');
const router = express.Router();
const zod = require('zod');
const usercontroller = require('../controllers/user.controller')
const authmiddleware = require('../middleware/auth.middleware')

const emailschema = zod.string()
                       .min( 9 , {msg: 'Email must be 9 charcters long'})
                       .email({msg: 'Invalid email address'}) 
                       
const passwordschema = zod.string()
const usernameschema = zod.string().min( 5, { msg: 'must be atleast 5 charac long'})

router.post('/register' , (req , res) => {
     console.log('inside users register backened') ;
     const {fullname , email , password} = req.body ;
     const emailresult = emailschema.safeParse(email)
     const passresult = passwordschema.safeParse(password)
     const usernameresult = usernameschema.safeParse(fullname.firstname)
     
     if( !emailresult.success || !passresult.success || !usernameresult.success ){
        if( !emailresult.success) {  return res.status(400).json({msg: 'Invalid emai'}) }; 
        if( !passresult.success) { return res.status(400).json({msg: 'Invalid password'}) }; 
        if( !usernameresult.success) return res.status(401).json({msg: 'Invalid usernamesid'})
         return res.status(201).json({msg: 'Invalid Input'})
   }
     else{
        usercontroller.registerUser(req , res) ;
      }
})

router.post('/login' , (req , res) => {
  //  console.log('userlogin')
    const {email , password} = req.body ;
     const emailresult = emailschema.safeParse(email)
     const passresult = passwordschema.safeParse(password)
     if( !emailresult.success || !passresult.success){
        res.status(400).json({msg: 'Invalid input'}); 
        console.log('Invalid input');
     }
     else{
        usercontroller.loginUser(req , res) ;
      }
})

router.get('/profile' , authmiddleware.authuser , usercontroller.Userprofile)

router.post('/logout' , authmiddleware.authuser , usercontroller.logoutuser)


module.exports = router;