import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import user from "../models/user.model.js";
import instructor from "../models/instructor.model.js";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import resetPasswordVerifyJWT from "../middleware/resetPasswordVerifyJWT.js";



const router = express.Router();

router.post('/requestPasswordReset', async (req, res) => {
    const {username} = req.body;
    if( !username ){
        res.status(400)
        .json({
            message: 'Missing username field in the body of the request.'
        });
    }

    const requestingUser = await user.findOne({Username: username});

    if( !requestingUser ){
        res.status(404)
        .json({
            message: 'There is no user with this username.'
        });
    }
    const {Username, Type} = requestingUser;
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
        default:
            res.status(500)
            .json({
                message: 'Failed in finding user email.'
            });
    }
    if(! userWithEmail ){
        res.status(500)
            .json({
                message: 'Failed in finding user email.'
            });
    }

    const { _id, Name, Email } = userWithEmail;

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
        (error, token) => {
            if(error){
                console.log(error);
                res.status(500).json({
                    message: 'An error has occured while creating the JWT for the request.'
                });
            }
            const link = `${process.env.FRONTEND_URL}createNewPassword/${token}`

            var mailOptions = {
                from: process.env.BUSINESS_EMAIL.toString(),
                to: Email,
                subject: 'Password Reset',
                html: `<h1>Hi ${Name},</h1><p>It seem's you have forgotten your password.</p><p>Don't worry, Click <span><a href=${link}>HERE</a></span> to reset it.</p><p>Please note that the link will expire after 2 hours. After the 2 hours, you have to submit a new reset password request.</p>`
            }
            transporter.sendMail(mailOptions)
            .then(info => {
                res.status(200).json({
                    message: 'Reset password email has been sent successfully.',
                    emailSentTo: Email
                })
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    message: 'Sending the reset password email failed.',
                });
            });
        }
      );

      
      


})

router.post('/resetPassword', resetPasswordVerifyJWT , async (req, res) => {
    const { newPassword } = req.body;
    if(! newPassword ){
        res.status(400)
        .json({ message: 'A new password must be provided in the body of the request. (key is newPassword)' });
    }

    const { UserId, Username, Email } = req.userData;
    if(!UserId || !Username || !Email){
        res.status(500)
        .json({ message: 'A error occured due to the decoding of the JWT in a wrong way' });
    }

    let requestingUser = await user.findOne({Username: Username});
    if( !requestingUser){
        res.status(400)
        .json({ message: 'There is no user with this username.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    let updateResult;
    switch(requestingUser.Type){
        case "admin": 
            updateResult = await administrator.updateOne({_id: UserId, Username: Username}, {Password: hashedPassword}); 
            break;
        case "instructor": 
            updateResult = await instructor.updateOne({_id: UserId, Username: Username}, {Password: hashedPassword}); 
            break;
        case "corporateTrainee": 
            updateResult = await corporateTrainee.updateOne({_id: UserId, Username: Username}, {Password: hashedPassword}); 
            break;
        default:
            res.status(400).json({message: 'Invalid user type.'});
    }

    if( !updateResult || updateResult.modifiedCount != 1 ){
        res.status(500).json({message: 'Failure in updating the password !'});
    }else{
        res.status(200).json({message: 'Password updated successfully.'});
    }
})

export default router;