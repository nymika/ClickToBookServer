const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth= async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,'thisismynewcourse')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token,userType:'admin'})
        if(!user)
        {
            console.log("user not found")
            throw new Error()
        }
        req.user=user 
        req.token=token
        next()
    }catch(e){
        res.status(401).send("Please authenticate.")
    }
}

module.exports=auth;