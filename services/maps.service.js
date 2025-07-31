const axios = require('axios');
const captainModel  = require('../models/captain.model')

// Replace with your actual Google Maps Geocoding API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API;

module.exports.getAddressCoordinate = async (address) => {  
  try {
    console.log('Enter into maps_service')
    // Make a GET request to the Google Maps Geocoding API
    const response = await axios.get( 'https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    // Check if the API returned results
    if (
      response.data.status === 'OK' &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      // No results found for the address
      return null;
    }
  } catch (error) {
    // Handle errors (e.g., network issues, invalid API key)
    console.error('Error fetching coordinates:', error.message);
    throw error;
  }
};

module.exports.getdistancetime = async (origin , destination) => {
    if( !origin || !destination ){
       return res.status(201).json({msg: 'Enter both origin and distance'})
    }

    const api = process.env.GOOGLE_MAPS_API

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${api}`
  // url should be proper

    try {
      const response = await axios.get(url);
   

      if(response.data.status === 'OK'){   // ok must be capital
        if( response.data.rows[0].elements[0].status === 'OK'){
           return response.data.rows[0].elements[0] ;
        }else{throw new Error('no routes')}
        
      }else{
        throw new Error('Unable to fetch distance and time') ; 
      }
    } 
    catch (error) {
        console.log(error )
    }
     
}

module.exports. getAutocompletesuggestion = async(input) => {
  
  if(!input){
    throw new Error('query is required');
  }
  const api = process.env.GOOGLE_MAPS_API
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${api}`

  try{
     const response = await axios.get(url)
     if(response.data.status === 'OK'){
         return response.data.predictions;
     }else{
         throw new Error('Unable to fetch suggestion');
     }
  }catch(err){
     console.log(err)
     return res.status(201).json({msg: 'Internal server error'})
  }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
   // console.log('getCaptainsInTheRadius' , 'ltd->' , ltd , 'lng--->' , lng , 'rad->' , radius)
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    }); 
    return captains;

}