const ErrorHandler = require("../utils/errorhander");


module.exports = (err,req,res,next)=>{// this error.js pass statuscode and message to errorhandler file

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Wrong Mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Mongoose database someone register to with same email that exist in database
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

        //Wrong JWT Error like if someone enter wrong token while changing password
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is Invalid, Try again`;
        err = new ErrorHandler(message,400);
    }
    // JWT Token Expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, Try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message,
    });

};