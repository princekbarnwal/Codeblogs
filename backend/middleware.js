import jwt from "jsonwebtoken";

const verifytoken = (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message:"Access token required"
            })
        }
        else{
            const token = authHeader.split(" ")[1];

            if(!token){
                return res.status(401).json({
                    message:"Access token required"
                })
            }
            else{
                const decoded = jwt.verify(
                    token,
                    process.env.ACCESS_TOKEN_KEY
                )
                req.user=decoded;
                next();
            }
        }
    } 
    catch (error) {
        console.log(error);
        res.status(401).json({message:"Invalid or Expired access token"});
    }
}

export default verifytoken;