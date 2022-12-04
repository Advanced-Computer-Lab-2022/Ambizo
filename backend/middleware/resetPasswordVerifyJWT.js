import jwt from "jsonwebtoken";
import usedResetPasswordToken from "../models/usedResetPasswordToken.model.js";

async function resetPasswordVerifyJWT(req, res, next){
    const token = req.headers["authorization"]?.split(' ')[1];
    if(!token){
        return res.status(401)
        .json({
            message: 'authorization header must be sent containing the Bearer token.'
        })
    }

    
    const usedToken = await usedResetPasswordToken.findOne({ResetToken: token.toString()});

    if( !usedToken ){
        return res.status(410).json({
            message: 'The reset token has either been used or timed out.'
        });
    }

    const currentDate = new Date();
    const usedTokenCreationTime = usedToken.createdAt;
    const usedTokenDeadline = usedTokenCreationTime.setHours(usedTokenCreationTime.getHours() + 2);

    if(currentDate > new Date(usedTokenDeadline)){
        return res.status(410).json({message: "The reset token has timed out."})
    }
    

    jwt.verify(token, process.env.RESET_PASSWORD_ACCESS_TOKEN_SECRET, async (error, decoded) => {
        if(error){
            console.log(error);
            return res.status(500).json({
                message: 'An internal error occured during decoding the JWT.'
            });
        }

        req.userData = {};
        req.userData.UserId = decoded.userId;
        req.userData.Username = decoded.username;
        req.userData.Email = decoded.email;
        

        const compareDate = new Date(currentDate.setHours(currentDate.getHours()-2));
        
        const deleteResult = await usedResetPasswordToken.deleteMany(
            {
                $or: [
                    {ResetToken: usedToken.ResetToken},
                    {CreatedAt: {$lte : compareDate}}
                ]
            }
        );

        next();
    });
}

export default resetPasswordVerifyJWT;