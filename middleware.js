let key = "mOYna0HFMgMg3tc";

module.exports.authenticated = (req,res,next) =>{
    if (req.query && req.query.key){
        if (req.query.key === key){
            console.log("token matched");
            next();
        }
        else{
            res.status(401).json({error:"Token is invalid"})
        }
    }
    else{
        res.status(401).json({error:"Token is missing"})
    }

}