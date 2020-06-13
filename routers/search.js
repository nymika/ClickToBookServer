const express=require('express')

const User=require('../models/user')
const Movie=require('../models/movie')
const Theatre=require('../models/theatre')
const router=new express.Router()
//collection name and mongoose.model name are different
router.put('/search',async(req,res)=>{
    const searchText=req.body.text;
    // await Movie.init()
    try{
    //make them run concurrently
    console.log("1")
        // const movies=await Movie.find({$text: {$search: searchText}})
        const movies=await Movie.aggregate([
            {
                $match:{
                    title:{
                        $regex:searchText,
                        $options:'i'
                    }
                }
            },
            {
                 $project : { title : 1 , poster : 1 } 
            }
        ])
        if(!movies.length)
        return res.send("")
        return res.send(movies)
        //console.log(movies)
        //const theatres=await Theatre.find({$text:{$search:searchText}})
        // const theatres=await Theatre.aggregate([
        //     {
        //         $match:{
        //             name:{
        //                 $regex:searchText,
        //                 $options:'i'
        //             }
        //         }
        //     }
        // ])
        //console.log(theatres)

        // if(movies.length&&theatres.length)
        // {
        //     console.log("2")

        //     return res.send({movies,theatres})
        // }
        // else if(movies.length)
        //     return res.send(movies)
        // else if(theatres.length)
        //     return res.send(theatres)
        // else


    }catch(e){
        return res.status(501).send("Error")
    }
    


})


module.exports=router;