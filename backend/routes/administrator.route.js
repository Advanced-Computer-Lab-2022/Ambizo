import express from "express";
import bcrypt from "bcrypt";
import verifyJWT from "../middleware/verifyJWT.js";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import instructor from "../models/instructor.model.js";
import user from "../models/user.model.js";

const router = express.Router();


function handleError(res, err) {
    return res.status(400).send(err);
}


router.post("/addAdministrator", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }

        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            
            const newAdministrator = new administrator({
                Username: req.body.username,
                Password: hashedPassword
            });

            const newUser = new user({
                Username: req.body.username,
                Type: "admin"
            });
    
            await newAdministrator.save();
            await newUser.save();
            res.json(newAdministrator);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addInstructor", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }

        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newInstructor = new instructor({
                Username: req.body.username,
                Password: hashedPassword,
                Name: req.body.name,
                Email: req.body.email
            });

            const newUser = new user({
                Username: req.body.username,
                Type: "instructor"
            });
    
            await newInstructor.save();
            await newUser.save();
            res.json(newInstructor);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addCorporateTrainee", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }
        
        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newCorporateTrainee = new corporateTrainee({
                Username: req.body.username,
                Password: hashedPassword,
                Name: req.body.name,
                Email: req.body.email
            });

            const newUser = new user({
                Username: req.body.username,
                Type: "corporateTrainee"
            });

            await newCorporateTrainee.save();
            await newUser.save();
            res.json(newCorporateTrainee);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

export default router;