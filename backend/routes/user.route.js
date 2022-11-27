import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyJWT from "../middleware/verifyJWT.js";
import user from "../models/user.model.js";
import instructor from "../models/instructor.model.js";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try{
        let User = await user.findOne({Username: req.body.username});
        
        if (!User) {
            return handleError(res, "Invalid username or password");
        } 

        let userType = User.Type
        switch(userType){
            case "admin": 
                User = await administrator.findOne({Username: req.body.username}); 
                break;
            case "instructor": 
                User = await instructor.findOne({Username: req.body.username}); 
                break;
            case "corporateTrainee": 
                User = await corporateTrainee.findOne({Username: req.body.username}); 
                break;
            case "individualTrainee": 
                User = await individualTrainee.findOne({Username: req.body.username}); 
                break;
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, User.Password)
        if(!isPasswordCorrect){
            return handleError(res, "Invalid username or password");
        }

        const payload = {
            Username: User.Username,
            Name: userType === "admin"? User.Username : User.Name,
            Type: userType
        }
        jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: 86400},
            (err, token) => {
                if(err){
                   return handleError(res, err.message);
                }
                return res.json({
                    token: "Bearer " + token
                })
            }
        )
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/getLoggedInUserData", verifyJWT, async (req,res) => {
    try{
        let User = await user.findOne({Username: req.User.Username});
        res.json(User);
    }
    catch(err){
        handleError(res, err.message);
    }
})

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;