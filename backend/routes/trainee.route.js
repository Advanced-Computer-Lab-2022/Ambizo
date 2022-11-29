import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import course from "../models/course.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";

const router = express.Router();

router.get("/getExercise", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "corporateTrainee" && req.User.Type !== "individualTrainee"){
            return handleError(res, "Invalid Access")
        }
        
        const Course = await course.findById(req.query.courseId);
        let Trainee = null;
        if(req.User.Type === "individualTrainee"){
            Trainee = await individualTrainee.findOne({Username: req.User.Username});
        }
        else{
            Trainee = await corporateTrainee.findOne({Username: req.User.Username});
        }
    
        let isEnrolled = false;
        Trainee.EnrolledCourses.forEach(course => {
            if(course.courseId === req.query.courseId){
                isEnrolled = true;
            }
        })
    
        if(!isEnrolled){
            return handleError(res, "You are not Enrolled in this course");
        }
    
        const Exercise = Course.Exercises[req.query.exerciseNum];
        res.json(Exercise);
    }
    catch(error){
        handleError(res,error);
    }
});

router.get("/getAnswers", verifyJWT, async (req, res) => {
    try {
        if (req.User.Type !== "corporateTrainee" && req.User.Type !== "individualTrainee") {
            return handleError(res, "Invalid Access")
        }

        let Trainee = null;
        if (req.User.Type === "individualTrainee") {
            Trainee = await individualTrainee.findOne({ Username: req.User.Username });
        }
        else {
            Trainee = await corporateTrainee.findOne({ Username: req.User.Username });
        }

        let Exercise = null;
        Trainee.EnrolledCourses.forEach(course => {
            if (course.courseId === req.query.courseId)
                Exercise = course.exercises[Number.parseInt(req.query.exerciseNum)];
        }
        )
        res.json(Exercise);
    }
    catch (error) {
        handleError(res, error);
    }
});

router.post("/submitExercise", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "corporateTrainee" && req.User.Type !== "individualTrainee"){
            return handleError(res, "Invalid Access")
        }

        let Trainee = null;
        if(req.User.Type === "individualTrainee"){
            Trainee = await individualTrainee.findOne({Username: req.User.Username});
        }
        else{
            Trainee = await corporateTrainee.findOne({Username: req.User.Username});
        }

        let enrolledCourse = await course.findById(req.query.courseId);
        let enrolledCourseQuestions = enrolledCourse.Exercises[Number.parseInt(req.query.exerciseNum)].questions;
        let submittedAnswers = req.body.traineeChoices;
        let grade = 0;
        for (let i = 0; i < submittedAnswers.length; i++){
            if (enrolledCourseQuestions[i].answer == submittedAnswers[i]) {
                grade++;
            }
        }
        grade = grade / enrolledCourseQuestions.length;


        Trainee.EnrolledCourses.forEach(course => {
            if(course.courseId === req.query.courseId){
                course.exercises[Number.parseInt(req.query.exerciseNum)].choices = req.body.traineeChoices;
                course.exercises[Number.parseInt(req.query.exerciseNum)].grade = grade;
            }
        })
        
        if(req.User.Type === "individualTrainee"){
            await individualTrainee.findByIdAndUpdate(Trainee._id, {EnrolledCourses: Trainee.EnrolledCourses});
        }
        else{
            await corporateTrainee.findByIdAndUpdate(Trainee._id, {EnrolledCourses: Trainee.EnrolledCourses});
        }
        res.json({message: "Exercise Submitted Successfully"});
    }
    catch(error){
        handleError(res,error);
    }
});

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;