import express from "express";
import corporateTrainee from "../models/corporateTrainee.model.js";

const router = express.Router();

router.get("/getAllTrainees", async (req,res) => {
    try{
        let trainees = await corporateTrainee.find();
        res.json(trainees);
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/getTraineeId/:username", async (req,res) => {
    try{
        let trainee = await corporateTrainee.findOne({Username: req.params.username});
        res.send(trainee._id);
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/:id", async (req,res) => {
    try{
        let trainee = await corporateTrainee.findById(req.params.id);
        res.json(trainee);
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.delete("/:id", async (req,res) => {
    try{
        await corporateTrainee.findByIdAndDelete(req.params.id);
        res.send("Trainee Deleted");
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/update/:id", async (req,res) => {
    try{
        let traineeToBeUpdated = await corporateTrainee.findById(req.params.id);
        traineeToBeUpdated.Username = req.body.username,
        traineeToBeUpdated.Location = req.body.location,
        traineeToBeUpdated.Corporate = req.body.corporate,
        traineeToBeUpdated.PhoneNumber = req.body.phoneNumber
    
        await traineeToBeUpdated.save();
        res.send("Trainee Updated");
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addTrainee", async (req,res) => {
    try{
        let checkDuplicate = await corporateTrainee.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "This trainee already exists!");
        } 
        else {
            const newCorporateTrainee = new corporateTrainee({
                Username: req.body.username,
                Location: req.body.location,
                Corporate: req.body.corporate,
                PhoneNumber: req.body.phoneNumber
            });
    
            await newCorporateTrainee.save();
            res.json(newCorporateTrainee);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;