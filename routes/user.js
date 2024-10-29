const express = require("express");
const app = express();
const Router = express.Router; 
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {z} = require("zod");
const { userMiddleware } = require("../middlewares/user");
const { courseRouter } = require("./course");
require('dotenv').config();
const JWT_SECRET_USER = process.env.JWT_SECRET_USER; 

userRouter.post("/signup", async (req,res)=>{
    const requiredBody = z.object({
        email: z.string().min(13).max(35).email(),
        password: z.string().min(6).max(20),
        firstName: z.string().min(3).max(15),
        lastName: z.string().min(3).max(15)
    })
    
    const parsedData = requiredBody.safeParse(req.body);
    
    if(!parsedData.success){
        return res.json({
            msg: "Invalid Format",
            err: parsedData.error
        });
    }

    const {email, password, firstName, lastName} = parsedData.data;
    
    try{
        const user = await userModel.findOne({
            email: email
        });
        if(user){
            return res.json({
                msg: "User already Existing! Please Signin"
            });
        }
    } catch(e){
        return res.json({
            err: e
        });
    }

    try{
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
    } catch(e){
        res.status(403).json({
            msg: "Error",
            err: e
        });
    }

    res.json({
        msg: "Signup Successful!"
    });
});

userRouter.post("/signin", async (req,res)=>{
    const {email,password} = req.body;

    const user = await userModel.findOne({
        email: email
    });

    if(user){
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(passwordMatch){
            const token = jwt.sign({
                id: user._id,
                email: email
            },JWT_SECRET_USER);

            res.json({
                token: token
            });

        } else {
            return res.status(403).json({
                msg: "Sorry Wrong Password"
            });
        }
    } else {
        return res.status(403).json({
            msg: "Invalid Credentials"
        });
    }
});

userRouter.get("/purchases",userMiddleware , async (req,res)=>{
    const userId = req.userId;
    const coursesBought = await purchaseModel.find({
        userId: userId
    });

    let purchasedCourses = coursesBought.map(x => x.courseId);

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourses }
    });

    res.json({
        purchases: coursesBought,
        coursesInfo: coursesData
    });
});

module.exports = {
    userRouter
}