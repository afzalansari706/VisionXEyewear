const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a sample id",
            url: "profilepicUrl",
        }
    });

    sendToken(user, 201, res);
});


//Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {


    const { email, password } = req.body;

    //checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email and Password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));

    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));

    }

    sendToken(user, 200, res);

});

// LogOut User

exports.logout = catchAsyncErrors(async (req, res, next) => {


    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
});

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const { email } = req.body;
    const user = await User.findOne({ email }); //we need to find user and we click on forget password he can enter his mail

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    //Get ResetPassword Token which we created on userModel
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });// after calling we have to save resetPasswordToken and Expire to userSchema

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;//url we send throught email

    //message with url 
    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\nIf You have not requested this email then please ignore it`;


    try {
        
        await sendEmail({

            email:user.email,
            subject: `VisionX Eyewear Password Recovery`,
            message
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully `,
        })



    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message,500));
    }
});


//Reset Password 
//Since the mail is send but process after clicking on url
exports.resetPassword = catchAsyncErrors(async (req, res, next)=>{

    const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token) // we are accessing token through url from user
            .digest("hex"); 
    //Now will find this token in our database by which we can find our user

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}, //we send mail now so time greater then now
    });

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
    }
    //if user found then he can set new password 
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not matched", 400));
    }

    //if user write password correct so we update his password in our database
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res); //after changing password user automactically login
});

//Get User Detail (viewing own details)
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});

//update User password 
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password"); // here we have select password bc in schema is unslected
    //here req.body.anything will always provide on postman or frontend
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword); // for changing password he enter old password

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));

    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match ", 400));

    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});

//update user profile 
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        // we will update avatar too but after cloudnary
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{ // user.id means who sending req
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    })
});

//Admin get all users details
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find(); // its will give all user that exists in database

    res.status(200).json({
        success:true,
        users,
    });

});

// Get single user Details (By admin)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id); // its will give all user that exists in database

    if(!user){
        return next(new ErrorHander(`User does not exist with Id : ${req.params.id}`,400))
    }

    res.status(200).json({
        success:true,
        user,
    });

});

//admin will update the role of user
//Update user Role --Admin

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
        
    };

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{ //params means in req url we provide id at end
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    if(!user){
        return next(new ErrorHander(`User does not exist with Id : ${req.params.id}`,400))
    }

    res.status(200).json({
        success:true,
    })
});

//Delete User -- admin

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id)
    //We will remove from cloudnary later

    if(!user){
        return next(new ErrorHander(`User does not exist with Id : ${req.params.id}`,400))
    }

    await user.remove();
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully",
    });
});
