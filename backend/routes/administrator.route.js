import express from "express";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import instructor from "../models/instructor.model.js";
import user from "../models/user.model.js";

const router = express.Router();


function handleError(res, err) {
    return res.status(400).send(err);
}

router.get("/:id", async (req,res) => {
    try{
        let admin = await administrator.findById(req.params.id);
        res.json(admin);
    }
    catch(err){
        handleError(res, err.message);
    }
})


router.post("/addAdministrator", async (req, res) => {
    try{
        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const newAdministrator = new administrator({
                Username: req.body.username,
                Password: req.body.password
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

router.post("/login", async (req, res) => {
    try{
        let admin = await administrator.findOne({Username: req.body.username});
        if (!admin || admin.Password !== req.body.password) {
            return handleError(res, "Invalid username or password");
        } 
        res.json(admin)
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addInstructor", async (req, res) => {
    try{
        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const newInstructor = new instructor({
                Username: req.body.username,
                Password: req.body.password,
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

router.post("/addCorporateTrainee", async (req, res) => {
    try{
        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const newCorporateTrainee = new corporateTrainee({
                Username: req.body.username,
                Password: req.body.password,
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