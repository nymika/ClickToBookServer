// const express=require('express')
// const jwt=require('jsonwebtoken')

// const User=require('../models/user')
// const auth=require('../middlewares/auth')
// const router=new express.Router()

// //SIGN UP
// router.post('/users/signup',async(req,res)=>{
//     const email=req.body.email;
//     const password=req.body.password

//     try{
//         const user=await new User({email,password});
//         await user.save();

//         //Generate token
//         const token=await user.generateAuthToken();
//         return res.status(201).send({user,token,password});
//     }catch(e)
//     {
//         return res.status(400).send(e);
//     }
// })

// //LOGIN
// router.post('/users/login',async(req,res)=>{
//     const email=req.body.email
//     const password=req.body.password
//     try{
//         const user=await User.findByCredentials(email,password)
//         if(!user)
//         {
//             return res.send("UserNotFound")
//         }
//         const token = await user.generateAuthToken();

//         return res.status(200).send({user,token,password});
//     }catch(e)
//     {
//         return res.status(404).send(e);
//     }

// })

// // //Update User
// // router.put('/users/me',auth,async (req,res)=>{
// //     const updates=Object.keys(req.body)
// //     const user=req.user;
// //     const allowedUpdates=['name','email','password','phoneNumber','address','userType']
// //     const isValidOperation=updates.every((update)=>
// //         allowedUpdates.includes(update))

// //     if(!isValidOperation){
// //         return res.status(404).send("Invalid Update")
// //     }
// //     try{
// //         updates.forEach((update)=>
// //             user[update]=req.body[update]
// //         )
// //         await user.save();
// //         console.log(user.address.city);
// //         return res.status(200).send(user)
// //     }catch(e){
// //         return res.status(400).send(e);
// //     }
// // })

// //Update User
// router.put('/users/me',auth,async (req,res)=>{
//     const updates=Object.keys(req.body)
//     const user=req.user;
//     const allowedUpdates=['name','email','password','phoneNumber','address','userType','gender','DOB']
//     const isValidOperation=updates.every((update)=>
//         allowedUpdates.includes(update))

//     if(!isValidOperation){
//         return res.status(404).send("Invalid Update")
//     }
//     try{
//         updates.forEach((update)=>
//             user[update]=req.body[update]
//         )
//         await user.save();
//         console.log(user.address.city);
//         return res.status(200).send(user)
//     }catch(e){
//         return res.status(400).send(e);
//     }
// })


// //Delete user
// router.delete('/users/me',auth,async(req,res)=>{
//     try{
//         req.user.remove()
//         res.send(req.user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

// //Logout
// router.post('/users/logout',auth,async(req,res)=>{
//     try{
//         req.user.tokens=req.user.tokens.filter((token)=>{
//             return token.token!==req.token
//         })
//         await req.user.save(); 
//         res.send();
//     }catch(e){
//         res.status(500).send()
//     }
// })

// //LogoutAll
// router.post('/users/logoutAll',auth,async(req,res)=>{
//     try{
//         req.user.tokens=[];
//         await req.user.save(); 
//         res.status(200).send();
//     }catch(e){
//         res.status(501).send(e)
//     }
// })


// module.exports=router;

const express=require('express')
const jwt=require('jsonwebtoken')

const User=require('../models/user')
const auth=require('../middlewares/auth')
const router=new express.Router()

//SIGN UP
router.post('/users/signup',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password
    const name=req.body.name

    try{
        const user=await new User({email,password,name});
        await user.save();

        //Generate token
        const token=await user.generateAuthToken();
        return res.status(201).send({user,token,password});
    }catch(e)
    {
        return res.status(400).send(e);
    }
})

//LOGIN
router.post('/users/login',async(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    try{
        const user=await User.findByCredentials(email,password)
        if(!user)
        {
            return res.send("UserNotFound")
        }
        const token = await user.generateAuthToken();

        return res.status(200).send({user,token,password});
    }catch(e)
    {
        return res.status(404).send(e);
    }

})

//Update User
router.put('/users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    //console.log(req.body)
    const user=req.user;
    const allowedUpdates=['name','email','password','phoneNumber','address','userType']
    const isValidOperation=updates.every((update)=>
        allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send("Invalid Update")
    }
    //console.log('1')
    try{
        updates.forEach((update)=>
            user[update]=req.body[update]
        )
        //console.log('2')
        //console.log(user)
        await user.save();
        //console.log('3')
        //console.log(user.address.city);
        return res.status(200).send(user)
    }catch(e){
        return res.status(400).send(e);
    }
})

//Delete user
router.delete('/users/me',auth,async(req,res)=>{
    try{
        req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

//Logout
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save(); 
        res.send();
    }catch(e){
        res.status(500).send()
    }
})

//LogoutAll
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save(); 
        res.status(200).send();
    }catch(e){
        res.status(501).send(e)
    }
})


module.exports=router;