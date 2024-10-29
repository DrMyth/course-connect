const express = require("express");
const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {z} = require("zod");
require('dotenv').config();
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
const {adminMiddleware} = require("../middlewares/admin");

adminRouter.post("/signup", async (req,res)=>{
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
        const admin = await adminModel.findOne({
            email: email
        });
        if(admin){
            return res.json({
                msg: "Admin already Existing! Please Signin"
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

        await adminModel.create({
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
        msg: "Admin Signup Successful!"
    });
});

adminRouter.post("/signin", async (req,res)=>{
    const {email,password} = req.body;

    const admin = await adminModel.findOne({
        email: email
    });

    if(admin){
        const passwordMatch = await bcrypt.compare(password,admin.password);
        if(passwordMatch){
            const token = jwt.sign({
                id: admin._id, 
            },JWT_SECRET_ADMIN);

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

adminRouter.post("/course", adminMiddleware, async(req,res)=>{
    const adminID = req.userId;

    const {title, description, imageURL, price} = req.body;


    const courseExists = await courseModel.findOne({
        title,
    });

    if(courseExists){
        return res.status(403).json({
            msg : "Course Already Exists"
        });
    }

    const course = await courseModel.create({
        title,
        description,
        imageURL,
        price,
        creatorId: adminID
    });

    res.json({
        msg: "Course Created Successfully!",
        courseID: course._id
    });
});

adminRouter.put("/course", adminMiddleware, async(req,res)=>{
    const adminID = req.userId;
    const {title, description, imageURL, price, courseID} = req.body;

    try{
        const course = await courseModel.findOneAndUpdate({
            _id: courseID, 
            creatorId: adminID
        },{
            $set: {
                title,
                description,
                imageURL,
                price
            }
        }); 

        if(!course){
            return res.status(404).json({
                msg: "Course not found or not authorized to update this course."
            });
        }

        res.json({
            msg: "Course Updated Successfully!",
            courseID: course._id
        });

    } catch (e) {
        return res.status(403).json({
            msg: "Something went wrong!",
            err: e
        });
    }
});

adminRouter.get("/course/bulk", adminMiddleware, async (req,res)=>{
    const adminID = req.userId;
    const courses = await courseModel.find({
        creatorId: adminID
    });

    res.json({
        courses: courses
    });
});

module.exports = {
    adminRouter
}