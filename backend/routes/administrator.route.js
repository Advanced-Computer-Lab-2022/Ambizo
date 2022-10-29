import express from "express";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import instructor from "../models/instructor.model.js";

const router = express.Router();


function handleError(res, err) {
    return res.status(400).send(err);
}


router.post("/addAdministrator", async (req, res) => {
    try{
        let checkDuplicate = await administrator.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "An administrator with this username already exists!");
        } 
        else {
            const newAdministrator = new administrator({
                Username: req.body.username,
                Password: req.body.password
            });
    
            await newAdministrator.save();
            res.json(newAdministrator);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addInstructor", async (req, res) => {
    try{
        let checkDuplicate = await instructor.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "This instructor already exists!");
        } 
        else {
            const newInstructor = new instructor({
                Username: req.body.username,
                Password: req.body.password,
                Name: req.body.name,
            });
    
            await newInstructor.save();
            res.json(newInstructor);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addCorporateTrainee", async (req, res) => {
    try{
        let checkDuplicate = await corporateTrainee.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "A Trainee with this username already exists!");
        } 
        else {
            const newCorporateTrainee = new corporateTrainee({
                Username: req.body.username,
                Password: req.body.password,
                Name: req.body.name,
                Email: req.body.email
            });
    
            await newCorporateTrainee.save();
            res.json(newCorporateTrainee);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

export default router;