const express=require('express')
const Movie=require('../models/movie')
const User=require('../models/user')
const router=new express.Router()
const auth=require('../middlewares/auth')

router.get('/movies/intheatre',async (req,res)=>{
    const today=new Date()
    //console.log(today)
    try
    {
        const filter={
            rating:{$gt:8},
            day:{$gt:today}
        }
        const projection={
            title:1,
            rating:1,
            poster:1,
            releaseDate:1
        }
        const movies=await Movie.find(filter,projection).sort({rating:-1})
    
        return res.send(movies)
    }
    catch(e)
    {
        res.status(501).send(e)
    }   
})

router.get('/upcomingMovies',async (req,res)=>{
    const today=new Date()
    //console.log(today)
    try
    {
        const filter={
            releaseDate:{$gt:today}
        }
        const projection={
            title:1,
            rating:1,
            poster:1,
            releaseDate:1
        }
        const movies=await Movie.find(filter,projection).sort({rating:-1})
    
        return res.send(movies)
    }
    catch(e)
    {
        res.status(501).send(e)
    }   
})

router.put("/movie/:movieid",async(req,res)=>{
    const _id=req.params.movieid
    const _user=req.body._user
    try{
        const movie=await Movie.findById(_id)
        .populate("comments.postedBy","_id name")

        // const movie=await Movie.findById(_id)
        // .populate("comments.postedBy","_id name").populate({path:"ratings.ratedBy",match:{_id:_user},select:"_id name"})
       
        if(!movie)
        {
            return res.status(404).send("Movie not found")
        }
        // if(_user)
        // {
            //console.log(_user)
            const ratings=[...movie.ratings]
            //console.log(ratings)
            let userRating=ratings.find(({ratedBy})=>_user==ratedBy)
            //console.log(userRating)
            if(!userRating)
            {
                console.log("undefined")
                userRating={}
            }
            return res.send({movie,userRating})
        //}
       // return res.send(movie)
    }catch(e){
        return res.status(501).send()
    }
})
module.exports=router