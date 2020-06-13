const express=require('express')
const Movie=require('../models/movie')
const router=new express.Router()
const auth=require('../middlewares/authAdmin')

const imdb=require('imdb-api')
const cli=new imdb.Client({apiKey:'e3e70ce0'})


//Get movie info
router.get('/getmovies',async(req,res)=>{
    try
    {
        const movies=await Movie.find({}).sort({releaseDate:-1})
        if(!movies.length)
        {
            return res.status(404).send()
        }
        return res.send(movies)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})

//Add movie Info
router.post('/addmovie',async(req,res)=>{
    const name=req.body.name;
    cli.get({name:name}).then(async(result)=>{
        console.log(result)
        const movie=await new Movie({
            title:result.title,
            genres:result.genres.split(","),
            director:result.director.split(","),
            actors:result.actors.split(","),
            language:result.languages.split(","),
            synopsis:result.plot,
            runtime:result.runtime,
            releaseDate:result.released,
            rating:result.rating,
            votes:result.votes,
            country:result.country.split(","),
            poster:result.poster
        })
        movie.save()
        console.log('succcess!')
        return res.send(movie)
    }).catch((e)=>{
        console.log(e);
        console.log('error1')
        return res.send("Error")
    })
})

//Update Movie
router.patch('/getmovies/:id',auth,async(req,res)=>{
    const _id=req.params.id;
    console.log(_id)
    try
    {
       const movie=await Movie.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
       if(!movie)
       {
           return res.status(404).send()
       }
       console.log(movie)
       return res.status(202).send(movie)
    }catch(e)
    {
        res.status(400).send(e)
    }
})

//Delete Movie(One can't remove movies if it is shown in theatres)
router.delete('/deletemovie/:id',auth,async(req,res)=>{
    const id1=req.params.id
    
    try
    {
        
        const movie=await Movie.findById(id1)
        if(!movie)
        {
            return res.status(404).send()
        }
        //console.log('hi')
        movie=Movie.findOneAndDelete({_id:req.params.id,inTheatre:true})
        if(!movie)
        {
            res.send("This movie is available in theatres.You can't delete this")
        }
        return res.send(movie)
    }catch(e)
    {
        res.status(400).send(e)    
    }
})

module.exports=router