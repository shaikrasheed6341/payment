const jwt = require("jsonwebtoken")
const JWT_SECRET = require("./config")

const authmiddleware = (req,res,next)=>{
    const authheader = req.headers.authorization;
     if(!authheader || !authheader.startwith(Barear)){
        return res.status(403).json({})
     }
     const token =  authheader.split('')[1];
    try{
        const decode = jwt.verify(token,JWT_SECRET);
        req.userid = decode.userid;
        next();
    }catch(err){
        return res.status(401).json({
            message : `${err}`
        })
    }
    
   

}
module.exports = {authmiddleware}