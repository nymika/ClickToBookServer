const express=require('express')

const Theatre=require('../models/theatre')
const User=require('../models/user')
const auth=require('../middlewares/auth')
const adminauth=require('../middlewares/authAdmin')
const vendauth=require('../middlewares/authVendor')
const router=new express.Router()

router.get('/theatres',auth,async(req,res)=>{ 
 
    try
    {
        const user=req.user;
        //console.log(user.userType)
        //VENDOR
        
        if(user.userType==="vendor")
        {
            await user.populate('theatres').execPopulate()
            const theatres=user.theatres
            //const theatres=await Theatre.find({owner:id})
            if(!theatres)
            {
                return res.status(404).send("You haven't registered any theatre yet!")
            }
            const theatreStatus={
                unapproved:[],
                active:[],
                expired:[]
            }
            for (var i=0;i<theatres.length;i++)
            { 
                if(theatres[i].status==="pending")
                {
                    theatreStatus.unapproved.push(theatres[i])
                }
                else
                {
                    const recent=new Date()
                    if(theatres[i].leaseInfo.lastDate.getTime()>recent.getTime())
                    {
                        theatreStatus.active.push(theatres[i])
                    }
                    else
                    {
                        theatreStatus.expired.push(theatres[i])
                        
                    }
                }
            }
            return res.status(200).send(theatreStatus)
        }
        //ADMIN
        if(user.userType==="admin"){
            console.log("Admin is logged in")
            const recent=new Date()
            //depends upon query
            const approved=await Theatre.find({status:"approved",'leaseInfo.lastDate':{$gt:recent}})
            const expired=await Theatre.find({'leaseInfo.lastDate':{$lt:recent},status:"approved"})
            const unapproved=await Theatre.find({status:"pending"})
            return res.status(200).send({expired,unapproved,approved})
        }
    }catch(e)
        {
        res.status(501).send(e)
        }
    })

//add theatre

router.post('/addtheatre',vendauth,async(req,res)=>{
    try
    {
        const theatre=await new Theatre(req.body)
        theatre.owner=req.user._id
        console.log(theatre)
        await theatre.save()
        res.status(201).send(theatre)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//Approve theatre
router.put('/approval',adminauth,async (req,res)=>{
    
    const status=req.body.status //"approve","reject"
    const theatreId = req.body.theatreId
    try{
        
        if(status==="approve")
        {
            const theatre=await Theatre.findById(theatreId)
            if(!theatre)
            {
                return res.status(404).send("Theatre not found")
            }
            theatre.status="approved";
            theatre.save()
            return res.status(200).send(theatre.status)
        }
        else
        {
            const theatre=await Theatre.findByIdAndDelete(theatreId)
            if(!theatre)
            {
                return res.status(404).send("Theatre not found")
            }
            return res.status(200).send("Successful!")
        }
        
    }catch(e){
        return res.status(501).send(e)
}
})

//UpdateTheatre
router.put('/theatres/update/:id',vendauth,async (req,res)=>{
        //[client is sending the only element of array which needs to be updated,add,delete,edit(pull,push,set)<- how i will get to know ]
        //Solution :client send updated values(rewrite)
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','brandName','location','seatInfo','slotInfo','status','leaseInfo']

    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation)
    {
        return res.send('Invalid Update')
    }
    try{
        const theatre=await Theatre.findById(_id)
        if(!theatre)
        {
            return res.status(404).send("Theatre not found!")
        }
        //console.log(theatre)
        updates.forEach((update)=>
            theatre[update]=req.body[update]
        )
        //console.log("1")
        await theatre.save();
        //console.log("2")
        return res.send(theatre);
    }catch(e)
    {
        return res.status(501).send(e)
    }

})

 //Delete many theatre
 //PS:when client send wrong id ,instead of showing "you are not owner", it throws an error
 router.delete('/theatres',vendauth,async (req,res)=>{
     console.log(req.body)
     const _id=req.body.id
     console.log(_id)
    //  try{
    //      const theatre=await Theatre.deleteMany({_id:_id,owner:req.user._id})
    //     if(!theatre.n||!theatre.ok)
    //     {
    //         return res.status(404).send("You are not owner!");
    //     }
    //     return res.send(theatre)
    //  }catch(e)
    //  {
    //      return res.status(501).send()
    //  }
 })
 
module.exports=router
