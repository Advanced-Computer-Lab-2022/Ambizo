import jwt from "jsonwebtoken";

function resetPasswordVerifyJWT(req, res, next){
    const token = req.headers["authorization"]?.split(' ')[1];
    if(!token){
        return res.status(401)
        .json({
            message: 'authorization header must be sent containig the Bearer token.'
        })
    }

    jwt.verify(token, process.env.RESET_PASSWORD_ACCESS_TOKEN_SECRET, (error, decoded) => {
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
        next();
    });
}

export default resetPasswordVerifyJWT;