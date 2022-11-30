import jwt from "jsonwebtoken";

function verifyJWT(req, res, next){
    const token = req.headers["authorization"]?.split(' ')[1];
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                return handleError(res, err);
            }
            
            req.User = {};
            req.User.Username = decoded.Username;
            req.User.Type = decoded.Type;
            req.User.Name = decoded.Name;
            next();
        })
    }
    else{
        handleError(res, "Incorrect Token");
    }
}

function handleError(res, err) {
    return res.status(400).send(err);
}

export default verifyJWT;