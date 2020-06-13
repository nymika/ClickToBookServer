const express=require('express')

const Theatre=require('../models/theatre')
const User=require('../models/user')
const Movie=require('../models/movie')
const ShowTime=require('../models/showTime')
const auth=require('../middlewares/authVendor')

const expiryCheck=require('../utils/expiryCheck')

const router=new express.Router()

//GET ?d=date
router.get('/theatres/:theatreid',auth,async(req,res)=>{ 
  const _user=req.user._id
  const _theatre=req.params.theatreid
  let day=new Date(req.query.date)
  const recent=new Date()
  if(!req.query.date)
  {
    day=recent;
  }
  try{
      const theatre=await Theatre.findOne({_id:_theatre,owner:_user,status:"approved",'leaseInfo.lastDate':{$gt:recent}})
      if(!theatre)
      {
          return res.status(404).send("No approved theatre found")
      }
      if(!expiryCheck)
      {
        return  res.send("Expired theatre");
      }
      //SLOT AVAILABILITY
      const resSlot=await ShowTime.find({_theatre,day},{_slot:1,_id:0,_movie:1})
      console.log(resSlot)
      const slotsStatus=[]
      for(let i=0;i<theatre.slotInfo.length;i++)
      {
        let status="available"
        let movieid=""
        let movieName=""
        let {startTime,_id}=theatre.slotInfo[i];
        for(let j=0;j<resSlot.length;j++)
        {
          if(resSlot[j]._slot.equals(_id))
          {
            status="reserved"
            movieid=resSlot[j]._movie
            const movieName=await Movie.findById({_id:movieid},{_id:0,title:1})
            console.log(movieName)
            break;
          }
        }
        let slot={ 
          _id,startTime,status,movieName
        }
        slotsStatus.push(slot);
      }
      const seatTypes=[...theatre.seatInfo.keys()]
      const infoRequired={
        slotsStatus,seatTypes
      }
     return res.status(201).send(infoRequired);
  }catch(e)
  {
      return res.status(501).send(e)
  } 
})

//GET /theatres/theatreid/showtimeid
router.put('/theatres/:theatreid/:slotid',auth,async (req,res)=>{
  try{
    const _slot=req.params.slotid
    const _theatre=req.params.theatreid
    //const day=new Date(req.body.day)
    const day=req.body.day
    //console.log("1")
    const showTime=await ShowTime.findOne({_slot,_theatre,day})
    console.log(showTime)

    var movieName=''
    if(!showTime)
    {
      return res.status(200).send({_slot,movieName})
    }
    const _movie=showTime._movie;
    movieName=await Movie.findById({_id:_movie},{title:1,_id:0})
    return res.status(200).send({showTime,movieName})
  }catch(e)
  {
    return res.status(501).send(e)  
  }
})

router.post('/theatres/showTime/:theatreid',auth,async (req,res)=>{
  console.log("hii")
  const movieName=req.body.movieName
  const _theatre=req.params.theatreid
  const priceInfo=req.body.priceInfo
  const day=new Date(req.body.day)
  const _slot=req.body._slot
  const status=req.body.status
  //const today=new Date()
  try{
    const theatre=await Theatre.findOne({_id:_theatre,owner:req.user._id,status:"approved"})
    if(!theatre)
    {
      return res.status(404).send("Can't Find Theatre")
    }
    
    //const movie=await Movie.findOneAndUpdate({title:movieName},{inTheatre:true,day:today},{new:true,runValidators:true})
    const movie=await Movie.findOne({title:movieName})
    if(!movie)
    {
      return res.status(404).send()
    }
    if(movie.day.getTime()<day.getTime())
    {
      movie.day=day
      movie.save()
    }

    const _movie=movie._id
    const seatInfo = new Map()

      for(let [key,value] of theatre.seatInfo)
      {
        let ticketPrice=priceInfo[key]
        let availability=new Array(value).fill(true)
          seatInfo.set(key,{
            availability,price:ticketPrice   
          })
      }
    if(status=="available")
      {
        const showTime=await new ShowTime({
        _theatre,day,_movie,_slot,seatInfo
        })
        await showTime.save()
        console.log(showTime)
        return res.status(201).send(showTime)
      }
    else{
      const showTime=await ShowTime.findOneAndUpdate({_theatre,day,_slot},{_movie:_movie,seatInfo},{new:true,runValidators:true})
      console.log(showTime)
      return res.status(201).send(showTime)
    }
  }
  catch(e){
    return res.status(501).send(e)
  }
})
//Update PRICE(pending)

//POST /theatres/theatreid/showtimeid
//THERE IS ONE ISSUE IF ONE PROMISE FAILS OTHER GETS SAVED
// router.post('/theatres/showTime/:theatreid',auth,async (req,res)=>{
//   console.log("hii")
//   const showTimebooking=req.body.bookingInfo
//   const _movie=req.body.movieid
//   const _theatre=req.params.theatreid
//   const priceInfo=req.body.priceInfo

  
//   try{
//     const theatre=await Theatre.findOne({_id:_theatre,owner:req.user._id,status:"approved"})
//     if(!theatre)
//     {
//       return res.status(404).send("Can't Find Theatre")
//     }

//     const seats = new Map()
//       for(let [key,value] of theatre.seatInfo)
//       {
//         let ticketPrice=priceInfo[key]
//         let availability=new Array(value).fill(true)
//           seats.set(key,{
//             availability,price:ticketPrice   
//           })
//       }
//       const showTimePromises=[]
//     for(let i=0;i<showTimebooking.length;i++)
//     {
//       let showTimePromise=ShowTime.showTimeBooking(_theatre,_movie,new Date(showTimebooking[i].day),showTimebooking[i].slot,showTimebooking[i].status,seats)
//       showTimePromises.push(showTimePromise)
//     }
//     const showTimes=await Promise.all(showTimePromises)
//     return res.status(201).send(showTimes)
//   }
//   catch(e){
//     return res.status(501).send(e)
//   }

// })
module.exports=router

