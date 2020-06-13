const express=require('express')
require('./db/mongoAtlas')
const app=express()

const Movie=require('./models/movie')

const router=new express.Router
const homeRouter=require('./routers/home')
const movieCRUDRouter=require('./routers/movieCRUD')
const theatreCRUDRouter=require('./routers/theatreCRUD')
const showTimeCRUDRouter=require('./routers/showTimeCRUD')
const basicFunctionalityRouter=require('./routers/basicFunctionality')
const userCRUDRouter=require('./routers/userCRUD')
const theatreRouter=require('./routers/theatre')
const ticketBookingRouter = require('./routers/ticketBooking')
const searchRouter = require('./routers/search')
const moviesRouter = require('./routers/movies')

var cors = require("cors");
const port=process.env.PORT || 3000

// const acc=async()=>{
//     const movies=await Movie.find({})
//     for(var i=0;i<movies.length;i++)
//     {
//         movies[i].day=new Date("2021-05-9")
//         movies[i].save();
//     }
// }
// acc()

app.use(express.json())
app.use(cors());
app.use(homeRouter)
app.use(movieCRUDRouter)
app.use(theatreCRUDRouter)
app.use(showTimeCRUDRouter)
app.use(basicFunctionalityRouter)
app.use(userCRUDRouter)
app.use(theatreRouter)
app.use(ticketBookingRouter)
app.use(searchRouter)
app.use(moviesRouter)
app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

