const mapservice = require('../services/maps.service')

module.exports.getCoordinates = async (req , res) => {
    const {address} = req.query;

    try{
        const coordinates = await mapservice.getAddressCoordinate(address)

        res.status(200).json(coordinates);
    }catch(err){
        res.status(201).json( {msg: 'Internal server error'} )
    }
}

module.exports.getdistancetime = async (req ,res) => {
    const {origin , destination} = req.query ;
    try{
       const distanetime = await mapservice.getdistancetime(origin , destination)
       res.status(200).json(distanetime) 
    }
    catch(err){
        console.log(err)
        return res.status(201).json({msg: 'Internal server error'})
    }
}

module.exports.getAutocompletesuggestion = async (req ,res) => {
    try{
         const {input} = req.query;
         const suggestion = await mapservice.getAutocompletesuggestion(input)
    //     console.log(suggestion)

    //     const jsonsuggestion = JSON.stringify(suggestion.map(obj => obj.description))
         res.status(200).json(suggestion.map(obj => obj.description))
    }catch(err){
        console.log(err)
        res.status(200).json({msg: 'Internal server error'})
    }
}