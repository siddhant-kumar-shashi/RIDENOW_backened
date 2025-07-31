const express = require('express');

const router = express.Router()
const authmiddleware = require('../middleware/auth.middleware')
const mapController = require('../controllers/map.controller')
const zod = require('zod')
const addressSchema = zod.string()
                         .min(3 , {msg: 'address must be atleast 3 charac long'})

router.get('/get-coordinates', (req, res) => {
  console.log('In route');
 // console.log(req.query)
  
  const result = addressSchema.safeParse(req.query.address);
  
  if (!result.success) {
    return res.status(400).json({ msg: 'Invalid address' });
  }

  mapController.getCoordinates(req, res);
});

router.get('/getdistancetime' , (req ,res) => {
    const originresult = addressSchema.safeParse(req.query.origin)
    const destresult = addressSchema.safeParse(req.query.destination)
    console.log(originresult)
    console.log(destresult)
    if( !originresult.success || !destresult.success ){
       return  res.status(200).json({msg: "Enter proper address"})
    }
    mapController.getdistancetime(req , res) ;
})


router.get('/get-suggestion' , authmiddleware.authuser , mapController.getAutocompletesuggestion)


  module.exports = router   