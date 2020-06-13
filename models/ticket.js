const mongoose=require('mongoose')
const validator=require('validator')
const User=require('./user')
const Theatre=require('./theatre')
const Movie=require('./movie')
const ShowTime=require('./showTime')
const Schema=mongoose.Schema

const bookingSchema=new Schema({
    customer:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    _showTime:{
        type:Schema.Types.ObjectId,
        ref:'ShowTime'
    },
    seats:[{
        seatType:String,
        seatno:[Number]
    }],
    price:Number,
    booking:{
        type:Date,
        default:Date.now
    }
})

const Ticket=mongoose.model('Ticket',bookingSchema)
module.exports=Ticket