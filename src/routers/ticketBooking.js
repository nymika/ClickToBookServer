const express=require('express')
const mongoose=require('mongoose')

const ShowTime=require('../models/showTime')
const Ticket=require('../models/ticket')
const Movie=require('../models/movie')

const router=new express.Router()
const auth=require('../middlewares/auth')

router.get('/ticketbooking/:showtimeid',async (req,res)=>{
    const _showTime=req.params.showtimeid
    try{
        const showTime=await ShowTime.findById({_id:_showTime})
        if(!showTime)
        {
            return res.status(404).send()
        }
        return res.send(showTime.seatInfo)
    }catch(e){
        return req.status(501).send("error")
    }

})

//If one fails other also gets fail
router.post('/ticket',auth,async(req,res)=>{

    const customer=req.user._id
    const _showTime=req.body._showTime
    const temp=req.body.seatsInfo
    const showTime=await ShowTime.findById(_showTime)
    let seatsInfo={}
try{
    for(let [key,value] of showTime.seatInfo)
    {
       // console.log(key,value)
        seatsInfo[key]=[]
    }
    //console.log(seatsInfo)
    let price=0;
    for(let i=0;i<temp.length;i++)
    {
        let type=temp[i].slice(0,1)
        let seatno=Number(temp[i].slice(1))
        seatsInfo[type].push(seatno)
        price+=showTime.seatInfo.get(type).price
    }
    //console.log(seatsInfo)
    let seatInfo=new Map()
    for(let key of Object.keys(seatsInfo))
    {
        //console.log(showTime.seatInfo.get(key))
        let availability=[...showTime.seatInfo.get(key).availability]
        let price=showTime.seatInfo.get(key).price
       // console.log(seatsInfo[key])
        for(let j=0;j<seatsInfo[key].length;j++)
        {
            let seatNumber=[...seatsInfo[key]]
            //console.log(seatNumber[j])
            if(availability[seatNumber[j]-1]==false)
            {
                return res.send("You can't book ticket")
            }
            //console.log(j)
           // console.log(seatsInfo[key][j-1])
            availability[seatNumber[j]-1]=false
        }
        seatInfo.set(key,{availability,price})
    }
    showTime.seatInfo=seatInfo
    const seats=[]
    for(let key of Object.keys(seatsInfo))
    {
       if(seatsInfo[key].length)
        {
            let seatType=key
            let seatno=[...seatsInfo[key]]
            seats.push({
                seatType,
                seatno
            })
        }
    }
    const ticket=await new Ticket
                ({
                    customer,_showTime,seats,price
                 })
   //if ticket.save()fails=>showTime.save() executed (problem)
   //one solution:before saving into actual database save it into some temporary db
   
    await ticket.save()
    await showTime.save()
    return res.status(200).send(ticket._id)
}catch(e)
{
    return res.status(501)
}
})

router.put('/ticketinfo',auth,async (req,res)=>{
    const _id=req.body._id
    const customer=req.user._id
    try{
        const ticket=await Ticket.findOne({_id,customer})
                                        .populate({
                                            path:'_showTime',
                                            populate:{
                                                path:'_theatre',
                                                select:'name location -_id slotInfo'
                                            },
                                            select:" _movie -_id _slot day" 
                                        })
        const movie=await Movie.findById(ticket._showTime._movie,{title:1,poster:1,_id:0})
        const slotInfo=await ticket._showTime._theatre.slotInfo
        const bookedslotid=await ticket._showTime._slot
        //console.log(bookedslotid)
        //console.log(slotInfo)
        const bookedSlot=slotInfo.find(({_id})=>{
            //console.log(_id)
            return String(_id)===String(bookedslotid)
        })
        console.log(bookedSlot)

        return res.send({ticket,movie,bookedSlot})
    }
    catch(e)
    {
        return res.status(501).send()
    }
    
})


module.exports=router