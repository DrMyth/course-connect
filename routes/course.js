const express = require("express");
const {Router} = require("express");
const courseRouter = Router();
const { courseModel } = require("../db/schema");
const { purchaseModel } = require("../db/schema");
const { userMiddleware } = require("../middlewares/user");

courseRouter.post("/purchase", userMiddleware, async (req,res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;

    const isCourseExists = await courseModel.findOne({
        _id: courseId
    });
    
    if(!isCourseExists){
        return res.status(403).json({
            msg: "Course doesn't exist!"
        });
    }

    const alreadyPurchase = await purchaseModel.findOne({
        userId,
        courseId
    });

    if(alreadyPurchase){
        return res.status(403).json({
            msg: "You have already purchased this course!"
        });
    }

    await purchaseModel.create({
        userId,
        courseId
    });

    res.json({
        msg: "You have successfully bought the course"
    });
});

courseRouter.get("/preview", async (req,res)=>{ 
    const courses = await courseModel.find({});
    res.json({
        courses: courses
    });
});

module.exports = {
    courseRouter
};