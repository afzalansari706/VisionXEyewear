const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //inbuilt module

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false, // its means admin only can see name and email but not password 


    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();

    } // if password not change then it will not hash and move to next()
    this.password = await bcrypt.hash(this.password, 10);

});

//JWT TOKEN we generate token and store its as cookie so the user is not new to website and register he can enter to website
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });// here we pass id of database as paylaod 
    // and secret key if find by someone they can create tons of fake account also expire will make user to login again 
};

//compare password since our password is hash so we cant compare directly that y we use bcrypt
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);

}

//Generating Password Reset Token 
//If someone forget password so they get temporary token to reset password
// we use nodemailer to send mail in which by click on link password is reset
userSchema.methods.getResetPasswordToken = function () {

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and add resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256") //it is algorithms to hash the token
        .update(resetToken) // which token to hash
        .digest("hex"); 

        this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //here user have token for 15min to reset password

        return resetToken;

}

module.exports = mongoose.model("User", userSchema);