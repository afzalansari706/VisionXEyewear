const sendToken = (user,statusCode,res)=>{
    //when we give email and password for register or login it will create token and store in cookie and give sucess as true
    // user and token values
    const token = user.getJWTToken();

    // options for cookie
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60* 60 * 1000 //eg 7day 24hr 60min 60sec 1000milisec
        ),
        httpOnly:true
    }

    res.status(statusCode).cookie('token',token,options).json({
        sucess:true,
        user,
        token,
    });
};

module.exports = sendToken;