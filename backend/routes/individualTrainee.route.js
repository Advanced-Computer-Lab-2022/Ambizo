import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import refundRequest from "../models/refundRequest.model.js";
import individualTrainee from "../models/individualTrainee.model.js";

const router = express.Router();

router.post("/requestRefund/", verifyJWT, async (req, res) => {
    try{
        
        if(req.User.Type !== 'individualTrainee'){
            return res.status(400).json({message: 'Invalid Access'});
        }
        
        let trainee = await individualTrainee.findOne({Username: req.User.Username});

        let isEnrolled = false;
        trainee.EnrolledCourses.forEach(course => {
            if(course.courseId === req.query.courseId){
                isEnrolled = true;
            }
        })

        if(!isEnrolled){
            return res.status(400).json({message: 'Cannot refund a course that you are not enrolled in'});
        }

        const newRefundRequest = new refundRequest({
            TraineeUsername : req.User.Username,
            CourseId: req.query.courseId,
            Reason: req.body.reason,
            Description: req.body.description
        });

        await newRefundRequest.save();
        res.status(201).json(newRefundRequest);
    }
    catch(err) {
        handleError(res,err);
    }
})

router.get("/getRefundStatus/", verifyJWT, async (req, res) => {
    if(req.User.Type !== 'individualTrainee'){
        return res.status(400).json({message: 'Invalid Access'});
    }

    let fetchedRefundRequest = await refundRequest.findOne({CourseId: req.query.courseId, TraineeUsername: req.User.Username});
    if(fetchedRefundRequest){
        res.send(fetchedRefundRequest.Status);
    }
    else{
        res.send("None");
    }

})

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;