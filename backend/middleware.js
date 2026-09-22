import jwt from "jsonwebtoken";

const verifytoken = (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Unavailable"});
    }
}