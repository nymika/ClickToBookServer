const mongoose=require('mongoose')
const validator=require('validator')
const Theatre=require('./theatre')
const Movie=require('./movie')
const Ticket=require('./ticket')
const Schema=mongoose.Schema

const seatSchema=new Schema({
     availability:{
         type:[Boolean]
        },
     price:
     {
        type:Number,
        default:0
    }
 })

const showTimeSchema=new Schema({
    _theatre:{
        type:Schema.Types.ObjectId,
        ref:'Theatre',
        unique:false
    },
    day:{
        type:Date,
        unique:false
    },
    _movie:{
        type:Schema.Types.ObjectId,
        ref:'Movie'
    },
    _slot:
    {
        type:Schema.Types.ObjectId, //seatSchema's objectid
        unique:false
    },
    seatInfo:{
        type:Map,
        of:seatSchema
    }
})

showTimeSchema.statics.showTimeBooking=async (_theatre,_movie,day,_slot,status,seatInfo)=>{
    if(status==='booked')
    {
        const showTime= await ShowTime.findOneAndDelete({_theatre,day,_slot})
    }
    const showTime=await new ShowTime({
        _theatre,_movie,_slot,day,seatInfo
    })
    await showTime.save();
    return showTime
}

showTimeSchema.pre('findOneAndDelete',async function(next){
    const _showTime=this;
    const tickets=await Ticket.deleteMany({_showTime})
    next()

})
showTimeSchema.index({day:1,_theatre:1,_slot:1},{unique:true})
const ShowTime=mongoose.model('ShowTime',showTimeSchema)
module.exports=ShowTime