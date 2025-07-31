const express = require('express')
const router = express.Router();
const zod = require('zod')
const captaincontroller = require('../controllers/captain.controller')
const captainauthmiddleware = require('../middleware/captain.middleware')
const {body} = require('express-validator')

const registerSchema = zod.object({
  fullname: zod.object({
    firstname: zod.string().min(3, { msg: 'Username must be at least 3 characters long' }),
    // Add lastname or other fields if needed
  }),
  email: zod.string()
    .min(9, { msg: 'Email must be at least 9 characters long' })
    .email({ msg: 'Invalid email address' }),
  password: zod.string().min(1, { msg: 'Password is required' }),
  vehicle: zod.object({
    capacity: zod.coerce.number().int().min(0, { message: 'Capacity must be a positive integer' }), // here coerce will automatically convert string to number
    color: zod.string().min(3, { msg: 'Color must be at least 3 characters long' }),
    plate: zod.string().min(3, { msg: 'Plate must be at least 3 characters long' }),
    vehicleType: zod.enum(['car', 'bike', 'auto'], { msg: 'Invalid vehicle type' }),
  }),
});

router.post('/register' , (req , res) => {
    // console.log('what1')
     
     const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    // Collect all error messages
    const errors = parseResult.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    console.log(errors)
    return res.status(400).json({ errors });
  }   
  // If validation passes, call the controller

  captaincontroller.registerCaptain(req, res); 
})

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    captaincontroller.loginCaptain
)

router.post('/logout' , captainauthmiddleware.captainauth ,async(req, res) => {
      captaincontroller.logoutCaptain
})

router.get('/profile'  , captainauthmiddleware.captainauth ,   captaincontroller.captainprofile)


module.exports = router