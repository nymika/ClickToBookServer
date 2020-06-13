const express=require('express')
const mongoose=require('mongoose')

const router=new express.Router()
const auth=require('../middlewares/auth')

const Movie=require('../models/movie')
const Theatre=require('../models/theatre')
const ShowTime=require('../models/showTime')

//Costmer already choosen movie
//GET Theatre ?day >page

router.put('/shows/:movieid',async (req,res)=>
{
    const date=new Date(req.body.date)
    const _movie=mongoose.Types.ObjectId(req.params.movieid)
    filter={
        _movie,
        day:date
    }
    options={
        limit:10,
        skip:1,
        sort:{'_theatre.name':1}
    }

    const showTime=await ShowTime.aggregate([
        { 
            $match: filter
         },
        {
            $group:
            {
                _id: "$_theatre", 
                  showtimes:{$push:{slot: "$_slot",
                  seatInfo:"$seatInfo",
                  _showTime : "$_id"
                }},
            } 
        },
        {
            $lookup:
            {
                from:"theatres",   // name of mongoDB collection, NOT mongoose model
                localField:"_id",    // referenced theatre _id in the tests collection(showtimes collection)
                foreignField:"_id",       // _id from users
                as: "theatre"             // output array in returned object
            }
        }
    ])
    return res.send(showTime) 
})

module.exports=router