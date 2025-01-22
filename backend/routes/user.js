
const express = require('express');
const zod = require("zod");
const { User } = require("../db")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")
const bcrypt = require('bcrypt');
const e = require('express');


const signupbody = zod.object({
    fristname: zod.string(),
    lastname: zod.string(),
    username: zod.string().email(),
    password: zod.string()
})

const router = express.Router();

router.post('/signup', async (req, res) => {
    
    const {username,password} = (req.body)
    const existuser = await User.findOne({username})
    
 if(existuser){
    return res.status(409).json({ // 409 Conflict for already existing user
        message: "User already exists",
    });
 }
    const hashpassword = await bcrypt.hash(password, 10);
    console.log(hashpassword);
    const newuser = new User({
        fristname: req.body.fristname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashpassword

    })
    await newuser.save()
    const userid = newuser._id;
    const token = jwt.sign({
        userid
    }, JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })
})

///this another route

const signschema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req, res) => {
    try {
        // Validate request body using Zod
        const safeParseResult = signschema.safeParse(req.body);
        if (!safeParseResult.success) {
            return res.status(400).json({
                message: "Invalid input. Please check your username and password."
            });
        }

        const { username, password } = req.body;

        // Find the user by username (email)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: "username is not found"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "passeord is invalid"
            });
        }

       
        

        return res.status(200).json({
            message: "User signed in successfully",
            token: token
        });
    } catch (err) {
        return res.status(500).json({
            message: `An error occurred: ${err.message}`
        });
    }
});

module.exports = router;