const express=require('express')

const router=new express.Router()
const auth=require('../middlewares/auth')

const Movie=require('../models/movie')
const ShowTime=require('../models/showTime')
const Ticket=require('../models/ticket')
const User=require("../models/user")


//Add Comment
router.put('/comment/:movieid',auth,async(req,res)=>{
    const comment={
        body:req.body.comment,
        postedBy:req.user._id
    }
    try{
        const movie=await Movie.findByIdAndUpdate(req.params.movieid,{$push:{comments:comment}},{new:true,runValidators:true})
                    .populate("comments.postedBy","name")
        if(!movie)
        {
           console.log("Movie doesnot exist")
           return res.status(404).send()
        }
        console.log(movie.comments[0].postedBy.name)
        return res.status(201).send(movie)
    }catch(e){
        return res.status(501).send(e)
    }
})

//Remove Comment
router.put('/uncomment/:movieid',auth,async(req,res)=>{
    const comment={
        body:req.body.comment,
        postedBy:req.user._id,
        date:new Date(req.body.date)
    }
    try{
        const movie=await Movie.findByIdAndUpdate(req.params.movieid,{$pull:{comments:comment}},{new:true,runValidators:true})
        if(!movie)
        {
            console.log("Movie doesnot exist")
            return res.status(404).send()
        }
        return res.status(201).send(movie)
    }catch(e){
        return res.status(501).send(e);
    }
})

//Add rating
router.put('/addrating/:movieid',auth,async(req,res)=>{
    //final rating of movie is not updated yet
    const rating={
        rate:req.body.rate,
        ratedBy:req.user._id
    }
    //const movie=await Movie.findById(req.params.movieid)
    const movie=await Movie.findByIdAndUpdate(req.params.movieid,{$push:{ratings:rating}},{new:true,runValidators:true})
    if(!movie)
    {
       console.log("Movie doesnot exist")
       return res.status(404).send()
    }
    console.log(movie)
    return res.status(201).send(movie)
})

//Remove rating
router.put('/unrate/:movieid',auth,async(req,res)=>{
    const rating={
        rate:req.body.rate,
        ratedBy:req.user._id
    }
    const movie=await Movie.findByIdAndUpdate(req.params.movieid,{$pull:{ratings:rating}},{new:true,runValidators:true})
    if(!movie)
    {
       console.log("Movie doesnot exist")
       return res.status(404).send()
    }
    return res.status(201).send(movie)
})

router.get('/bookinghistory',auth,async (req,res)=>{
    customer=req.user._id
    const bookedTickets=await Ticket.find({customer})
                                    .populate({
                                        path:'_showTime',
                                        populate:{
                                            path:'_theatre',
                                            select:'name location -_id'
                                        },
                                        populate:{
                                            path:'_movie',
                                            select:'title poster -_id'
                                        },
                                        select:"_id" 
                                    })
    console.log(bookedTickets)
    return res.send(bookedTickets)
})

module.exports=router