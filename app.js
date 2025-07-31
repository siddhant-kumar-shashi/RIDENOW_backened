
const dotenv = require('dotenv')
dotenv.config() ;

const {initializeSocket} = require('./socket')
const express = require('express')
const app = express()
const cors = require('cors')
const connecttodb = require('./db/db')
const userRoute = require('./routes/user.routes')
const cookieparser = require('cookie-parser')
const captainRoute = require('./routes/captain.route')
const mapRoute = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.route')
const http = require('http')

// const rabbitmq = require('./user/service/rabbit')
// rabbitmq.connect();

const server = http.createServer(app); // Create server here
 initializeSocket(server); // Pass server to initializeSocket

 const allowedFrontend = "https://ridenow-frontend-2qbg.vercel.app/";

app.use(cors({
  origin: allowedFrontend,
  credentials: true // only if you're using cookies/auth tokens
})); 

 connecttodb() ; 

app.use(express.json()) ; // It must come before routes

app.use('/users' , userRoute) ; 
//   app.use(cookieparser) ;
app.use(express.urlencoded({ extended: true }));
app.use('/captain' , captainRoute)  
app.use('/map', mapRoute ) 
 app.use('/ride' , rideRoutes) 

server.listen(3001 ,() => {
    console.log('server is listening on port 3001');
})

module.exports = app ; 