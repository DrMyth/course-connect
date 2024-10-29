const express = require("express");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
require('dotenv').config(); 
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15*60*1000,
    limit: 100,
    message: {
        msg: "You are overwhelming the server with responses"
    },
    statusCode: 404
});

const app = express();
app.use(express.json());
app.use(limiter);

app.use("/user", userRouter); 
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!"); 
    
    port = process.env.PORT;
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    });
}

app.use((err,req,res,next)=>{
    res.status(403).json({
        msg: "An error occurred while processing your request",
        err: err
    })
})

main();