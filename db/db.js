const mongoose = require("mongoose");

function connect() {
  return mongoose.connect('mongodb+srv://sid_mongodb:HMCuMmfXh04spnGu@cluster0.wcih5.mongodb.net/shashi_db');
}

module.exports = connect;