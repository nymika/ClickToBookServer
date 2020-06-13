const mongoose=require('mongoose')
const validator=require('validator')
const connect=require('../db/mongoose')
const User=require('./user')
const {ObjectId}=mongoose.Schema.Types
const movieSchema=new mongoose.Schema({
    title:{
        type:String
        //required:true,
        //unique:true,
        //text: true
    },
    genres:{
        type:[String]
        //default:undefined
        //required:true
    },
    country:{
        type:[String]
    },
    language:{
        type:[String]
    },
    synopsis:{
        type:String,
        default:''
    },
    runtime:{
        type:String
    },
    releaseDate:{
        type:Date
    },
    director:{
        type:[String]
    },
    actors:{
        type:[String]
    },
    comments:[{
        body:String,
        date:{
            type:Date,
            //`Date.now()` returns the current unix timestamp as a number
            default:Date.now
        },
        postedBy:{
            type:ObjectId,
            ref:User
        }
    }],
    ratings:[{
        rate:{
            type:Number,
            enum:[0,1,2,3,4,5,6,7,8,9,10],
            default:0
        },
        ratedBy:{
            type:ObjectId,
            ref:User
        }
    }],
    //make them virtual
    rating:{
        type:Number,
        min:0,
        max:10
    },
    votes:{
        type:String
    },
    poster:{
        type:String,
        default:"N/A"
    },
    lastDate:{
        type:Date
    },
    day:{
        type:Date,
        default:"2020-05-04"
    }
})
movieSchema.index({title:'text'}, { language_override: "dummy" } )

// to trick MongoDB in such cases where you use a text index and have a field named language which is part of
//  the document and not a field to specify the language for building indexes, you need to set the language
//  _override attribute to some dummy field which doesn't exist. This is to inform MongoDb that, look, you 
//  should use English as the default language, and if my document contains a field named dummy, then use 
//  the value in that field as the language to build the index for that document and not the language field.

movieSchema.pre('save',async function(next){
    console.log("ih")
    next();
})



const Movie=mongoose.model('Movie',movieSchema)
// Movie.on('index', function(error) {
//     console.log(error);
//   });
module.exports=Movie