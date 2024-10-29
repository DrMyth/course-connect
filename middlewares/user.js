const jwt = require("jsonwebtoken");
const {JWT_SECRET_USER} = require("../config"); 

function userMiddleware(req,res,next){
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET_USER);
    if(decoded){
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            msg: "Not Authenticated to access!"
        });
    }
}

module.exports = {
    userMiddleware
};