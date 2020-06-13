const Movie=require('../models/movie')
const imdb=require('imdb-api')
const cli=new imdb.Client({apiKey:'e3e70ce0'})
cli.get({name:'Dream Horse'}).then(async(result)=>{
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
}).catch((e)=>{
    console.log(e);
    console.log('error1')
})