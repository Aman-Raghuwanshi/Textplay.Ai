const userModel = require('../models/userModel')
const errorResponse = require('../utils/errorResponse')

//JWT Token
exports.sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken(res)
    res.status(statusCode).json({
        sucess : true,
        token,
    });
};

//Register Function
exports.registerController = async (req, res, next)=> {
    try {
        const {username, email, password} = req.body
        //existing user
        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            return next(new errorResponse('Email is already registered', 500))
        }
        const user = await userModel.create({username, email, password})
        sendToken(user, 201, res)
    } catch (error) {
        console.log(error)
        next(error)
    }
};

//login
exports.loginController = async (req, res, next)=> {
    try {
        const {email, password} = req.body
        //validation
        if(!email || !password){
            return next(new errorResponse('Please provide email or password'))
        }
        const user = await userModel.findOne({email})
        if(!user){
            return next(new errorResponse('Invalid credentials', 401))
        }
        const ismatch = await userModel.matchPassword(password)
        if(!ismatch){
            return next(new errorResponse('Invalid credentials',401))
        }
        this.sendToken(user, 200, res);
    } catch (error) {
        console.log(error)
        next(error)
    }
};

//LogoutController
exports.logoutController = async (req, res)=> {
    res.clearCookie('refreshToken')
    return res.status(200).json({
        success : true,
        message : "Logut Successful",
    });
};