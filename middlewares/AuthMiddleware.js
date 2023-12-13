const {verify} = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if(!accessToken){
        return res.json({error:"User not logged in"});
    }
    try{
        const validToken = verify(accessToken,"importantsecret");
        req.user = validToken;
        if(validToken){
            return next();
        }else{
            res.json({error:"Invalid Token !"})
        }
    }catch(err){
        return res.json({error:err});
    }
    
}

const validateCToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if(!accessToken){
        return res.json({error:"User not logged in"});
    }
    try{
        const validToken = verify(accessToken,"importantsecret");
        req.user = validToken;
        if(validToken && req.user.usertype === 'company'){
            return next();
        }else{
            res.json({error:"Log in as Company !"})
        }
    }catch(err){
        return res.json({error:err});
    }
    
}

const validateEToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if(!accessToken){
        return res.json({error:"User not logged in"});
    }
    try{
        const validToken = verify(accessToken,"importantsecret");
        req.user = validToken;
        if(validToken && req.user.usertype === 'employee'){
            return next();
        }else{
            res.json({error:"Log in as Employee !"})
        }
    }catch(err){
        return res.json({error:err});
    }
    
}

module.exports = {validateToken,validateCToken,validateEToken};


//middleware is just a function that runs before a request and it basically
//checks to see if you want to continue with the request or not 
