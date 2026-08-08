const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");



// basically who authenticate can preform tasks likes create purchase product
// for testing we authenticate for getProduct no one can see product until its authenticate
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHander("Please Login to access this resources ",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

//like only admin can able to create,update, or delete productx
exports.authorizeRoles = (...roles) =>{
    //This roles is array which have admins

    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){ //if req.user.role is user which is not include in roles array so
            // this condition false by ! this it bcom true
            return next(
            new ErrorHander(`Role : ${req.user.role} is not allowed to access this resource`,403)
            );
        }
        // if req.user.role is admin then next() will run like getProduct or createProduct,etc.
        next();
    };

}

