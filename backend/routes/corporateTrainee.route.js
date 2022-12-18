import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import course from "../models/course.model.js";

const router = express.Router();

router.put("/requestCourse", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== 'corporateTrainee') {
            return handleError(res, "Invalid Access")
        }

        const corporateTraineeUsername = req.User.Username;
        const courseId = req.query.courseId;
        
        let oldCourse = await course.findById(courseId);

        let requetsList = oldCourse.CorporateRequests;
        requetsList.push(corporateTraineeUsername);

        await course.findByIdAndUpdate(courseId, {
            CorporateRequests: requetsList
        })

        res.json({message: "Request Added Successfully"});
    }
    catch(error){
        console.log("hena")
        handleError(res,error);
    }
});

router.put("/cancelRequest", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== 'corporateTrainee') {
            return handleError(res, "Invalid Access")
        }

        const corporateTraineeUsername = req.User.Username;
        const courseId = req.query.courseId;
        
        let oldCourse = await course.findById(courseId);

        let requetsList = oldCourse.CorporateRequests;

        let newRequestsList = [];

        requetsList.forEach(corporateUsername => {
            if(corporateUsername !== corporateTraineeUsername) {
                newRequestsList.push(corporateUsername)
            }    
        });

        await course.findByIdAndUpdate(courseId, {
            CorporateRequests: newRequestsList
        })

        res.json({message: "Request Removed Successfully"});
    }
    catch(error){
        console.log("hena")
        handleError(res,error);
    }
});

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;