import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/features.js";
import errorHandler from "../middlewares/error.js";

export const register = async (req,res,next)=>{
    try {
        const {name,email,password} = req.body;
        let user = await User.findOne({email});
        if(user)
        {
            return next(new errorHandler("Account already exists with this E-Mail." , 404));
        }
        const hashedPass = await bcrypt.hash(password,10);
        user = await User.create({
            name,
            email,
            password:hashedPass
        })
        console.log("2");
        setCookie(user,res,"Sign-Up Successful",201);
    } catch (error) {
        next(error);
    }
}

export const login = async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user)
        {
            return next(new errorHandler("Account not exists! Sign Up first." , 404));
        }
        const isSame = await bcrypt.compare(password , user.password);
        if(!isSame)
        {
            return next(new errorHandler("Invalid E-Mail or Password!" , 404));
        }
        setCookie(user,res,`Welcome back ${user.name}`,200);
    } catch (error) {
        next(error);
    }
}

export const getMyProfile = (req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user,
    })
}

export const logout = (req,res) => {
    res
    .status(200)
    .cookie("token" , "" , {
        expires:new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
        success:true,
        user:req.user,
    })
}