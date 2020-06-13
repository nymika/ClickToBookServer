const express=require('express')
const Movie=require('../models/movie')
const router=new express.Router()
//Trending Movies

router.get('/',async(req,res)=>{ 
    const today=new Date()
    //console.log(today)
    try
    {
        const filter={
            day:{$gt:today}
        }
        const projection={
            title:1,
            rating:1,
            poster:1,
            releaseDate:1
        }
        const trendingMovies=await Movie.find(filter,projection).sort({rating:-1}).limit(10)
        const filter1={
        releaseDate:{$lt:today},
        day:{$gt:today}
        }
        const projection1={
            title:1,
            rating:1,
            poster:1,
            releaseDate:1
        }
        const latestMovies=await Movie.find(filter1,projection1).sort({releaseDate:-1})

        return res.send({latestMovies,trendingMovies})
    }
    catch(e)
    {
        res.status(501).send(e)
    }   
})

//Genre
router.put('/genre',async(req,res)=>{
    const today=new Date()
    const genre=req.body.genre
    try{
        const filter={
            genres:genre,
            releaseDate:{$lt:today},
            day:{$gt:today}
        }
        const projection={
            title:1,
            rating:1,
            poster:1,
            releaseDate:1
        }
        const movies=await Movie.find(filter,projection).sort({releaseDate:-1})
        console.log(movies.length)
        if(!movies.length)
        {
            return res.status(200).send()
        }
        return res.send(movies)

    }catch(e)
    {
        return res.status(501).send(e)
    }
})

//Language
router.put('/language',async(req,res)=>{
    const today=new Date()
    //const language=req.body.language.toLowerCase()
    const language=req.body.language    
    try{
        const filter={
            language,
            releaseDate:{$lt:today},
            day:{$gt:today}
        }
        const projection={
            title:1,
            rating:1,
            poster:1,
            releaseDate:1
        }
        const movies=await Movie.find(filter,projection)
        if(!movies.length)
        {
            return res.status(200).send()
        }
        return res.send(movies)

    }catch(e)
    {
        return res.status(501).send(e)
    }
})

module.exports=router