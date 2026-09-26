const verifyadmin = (req, res, next)=>{
    try {
        const role=req.user.role;
        if(role!=="admin"){
            return res.status(403).json({message:"Admin authentication required"});
        }
        else{
            next();
        }
    } catch (error) {
        return res.status(500).json({message:"Server unavailablea"});
    }
}

export default verifyadmin;