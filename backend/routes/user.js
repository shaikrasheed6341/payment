
const express = require('express');
const zod=  require("zod");
const {User} = require("../db")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")


const signupbody = zod.object({
    fristname : zod.string(),
    lastname : zod.string(),
    username:zod.string().email(),
    password:zod.string()
})

const router = express.Router();

router.post('/signup',async(req,res)=>{
    const {success} = signupbody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "Email already taken / Incorrect inputs"
        })
    }
    const existuser = await User.findOne({
        username : req.body.username
    })
    if(existuser){
        return res.status(411).json({
            message :"Email already taken"
        })
    }
    const user = new User({
        firstname :req.body.firstname,
        lastname : req.body.lastname,
        username : req.body.username,
        password : req.body.password

    })
    const userid = user._id;
    const token = jwt.sign({
        userid
    },JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })
})


module.exports = router;