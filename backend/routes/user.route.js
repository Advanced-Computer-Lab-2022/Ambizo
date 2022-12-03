import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import verifyJWT from "../middleware/verifyJWT.js";
import resetPasswordVerifyJWT from "../middleware/resetPasswordVerifyJWT.js";
import user from "../models/user.model.js";
import instructor from "../models/instructor.model.js";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";
import usedResetPasswordToken from "../models/usedResetPasswordToken.model.js";


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

router.post('/requestPasswordReset', async (req, res) => {
    const {username} = req.body;
    if( !username ){
        return res.status(400)
        .json({
            message: 'Missing username field in the body of the request.'
        });
    }

    const requestingUser = await user.findOne({Username: username});

    if( !requestingUser ){
        return res.status(404)
        .json({
            message: 'There is no user with this username.'
        });
    }
    const { _id, Username, Type} = requestingUser;
    let userWithEmail;
    switch(Type){
        case "admin": 
            userWithEmail = await administrator.findOne({Username: Username}); 
            break;
        case "instructor": 
            userWithEmail = await instructor.findOne({Username: Username}); 
            break;
        case "corporateTrainee": 
            userWithEmail = await corporateTrainee.findOne({Username: Username}); 
            break;
        case "individualTrainee": 
            userWithEmail = await individualTrainee.findOne({Username: Username});
            break;
        default:
            return res.status(500)
            .json({
                message: 'Failed in finding user email.'
            });
    }
    if(! userWithEmail ){
        return res.status(500)
            .json({
                message: 'Failed in finding user email.'
            });
    }

    const { Name, Email } = userWithEmail;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.BUSINESS_EMAIL,
          pass: process.env.BUSINESS_EMAIL_PASSWORD
        }
      });

      const jwtPayload = {
        userId: _id,
        username: Username,
        email: Email,
      }
      jwt.sign(
        jwtPayload,
        process.env.RESET_PASSWORD_ACCESS_TOKEN_SECRET,
        {expiresIn: 7200},
        async (error, token) => {
            if(error){
                console.log(error);
                return res.status(500).json({
                    message: 'An error has occured while creating the JWT for the request.'
                });
            }
            const newUsedResetPasswordToken = new usedResetPasswordToken({
                ResetToken: token.toString()
            });

            newUsedResetPasswordToken.save().then(
                _ => {
                    const link = `${process.env.FRONTEND_URL}resetPassword/${token}`

                    var mailOptions = {
                        from: process.env.BUSINESS_EMAIL.toString(),
                        to: Email,
                        subject: 'Password Reset',
                        html: `<h1>Hi ${Name},</h1><p>It seem's you have forgotten your password.</p><p>Don't worry, Click <span><a href=${link}>HERE</a></span> to reset it.</p><p>Please note that the link will expire after 2 hours. After the 2 hours, you have to submit a new reset password request.</p>`
                    }
                    transporter.sendMail(mailOptions)
                    .then(info => {
                        return res.status(200).json({
                            message: 'Reset password email has been sent successfully.',
                            emailSentTo: Email
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        return res.status(500).json({
                            message: 'Sending the reset password email failed.',
                        });
                    });
                }
            ).catch(error => {
                console.log(error);
                return res.status(500).json({message: 'An error happened while saving the reset token to the database.'})
            })
        }
      );
});

router.post('/resetPassword', resetPasswordVerifyJWT , async (req, res) => {

    const { newPassword } = req.body;
    if(! newPassword ){
        return res.status(400)
        .json({ message: 'A new password must be provided in the body of the request. (key is newPassword)' });
    }

    const { UserId, Username, Email } = req.userData;
    if(!UserId || !Username || !Email){
        return res.status(500)
        .json({ message: 'A error occured due to the decoding of the JWT in a wrong way' });
    }

    let requestingUser = await user.findOne({Username: Username});
    if( !requestingUser){
        return res.status(400)
        .json({ message: 'There is no user with this username.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    let updateResult;
    switch(requestingUser.Type){
        case "admin": 
            updateResult = await administrator.updateOne({Username: Username}, {Password: hashedPassword}); 
            break;
        case "instructor": 
            updateResult = await instructor.updateOne({Username: Username}, {Password: hashedPassword}); 
            break;
        case "corporateTrainee": 
            updateResult = await corporateTrainee.updateOne({Username: Username}, {Password: hashedPassword}); 
            break;
        case "individualTrainee":
            updateResult = await individualTrainee.updateOne({Username: Username}, {Password: hashedPassword});
        default:
            return res.status(400).json({message: 'Invalid user type.'});
    }

    if( !updateResult || updateResult.modifiedCount != 1 ){
        return res.status(500).json({message: 'Failure in updating the password.'});
    }else{
        return res.status(200).json({message: 'Password updated successfully.'});
    }
});

router.patch('/changePassword', verifyJWT, async (req, res) => {
    if( !req.body.oldPassword || !req.body.newPassword){
        return res.status(400).json({message: 'The (newPassword) and (oldPassword) fields must be provided in the request body.'})
    }

    const { oldPassword, newPassword } = req.body;

    const { Username } = req.User;
    if( !Username ){
        return res.status(500)
        .json({ message: 'A error occured due to the decoding of the JWT in a wrong way' });
    }

    let requestingUser = await user.findOne({Username: Username});
    if( !requestingUser ){
        return res.status(400)
        .json({ message: 'There is no user with this username.' });
    }

    let userToUpdate;
    switch(requestingUser.Type){
        case "admin": 
            userToUpdate = await administrator.findOne({Username: Username}); 
            break;
        case "instructor": 
            userToUpdate = await instructor.findOne({Username: Username}); 
            break;
        case "corporateTrainee": 
            userToUpdate = await corporateTrainee.findOne({Username: Username}); 
            break;
        case "individualTrainee": 
            userToUpdate = await individualTrainee.findOne({Username: Username});
            break;
        default:
            return res.status(500)
            .json({
                message: 'Failed in finding user to update.'
            });
    }

    if( !userToUpdate ){
        return res.status(500).json({ message: 'Failed in finding user to update.' })
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, userToUpdate.Password);
    if(!isPasswordCorrect){
        return res.status(403).json({message: 'The old password provided is wrong. Hence, can not change the password.'})
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    userToUpdate.Password = hashedNewPassword;
    userToUpdate.save().then(
        _ => {
            return res.status(201).json({message: 'The password was changed successfully.'})
        }
    ).catch(error => {
        console.log(error);
        return res.status(500).json({message: 'An error has occured while changing the password.'})
    });

});


function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;