import express from "express";
import corporateTrainee from "../models/corporateTrainee.model.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try{
        let trainee = await corporateTrainee.findOne({Username: req.body.username});
        if (!trainee || trainee.Password !== req.body.password) {
            return handleError(res, "Invalid username or password");
        } 
        res.json(trainee)
    }
    catch(err){
        handleError(res, err.message);
    }
})

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;