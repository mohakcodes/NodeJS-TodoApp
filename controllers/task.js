import errorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async(req,res) => {
    try {
        const {title , description} = req.body;
        await Task.create({
            title,
            description,
            user:req.user,
        })
        res.status(201).json({
            success:true,
            message:"Task Added",
        })
    } catch (error) {
        next(error);
    }
}

export const updateTask = async(req,res,next) => {
    try {
        const {id} = req.params;
        const task = await Task.findById(id);
        if(!task) 
        {
            return next(new errorHandler("Can't Update, Invalid ID" , 404));
        }
        task.isCompleted = !task.isCompleted;
        await task.save();

        res.status(200).json({
            success:true,
            message:"Task Updated",
        })
    } catch (error) {
        next(error);
    }
}

export const deleteTask = async(req,res,next) => {
    try {
        const {id} = req.params;
        const task = await Task.findById(id);

        if(!task) 
        {
            return next(new errorHandler("Can't Delete, Invalid ID" , 404));
        }
        await task.deleteOne();

        res.status(200).json({
            success:true,
            message:"Task Deleted",
        })
    } catch (error) {
        next(error);
    }
}

export const getAllTask = async(req,res) => {
    try {
        const userID = req.user._id;
        const tasks = await Task.find({user : userID});
        res.status(200).json({
            success:true,
            tasks,
        })
    } catch (error) {
        next(error);
    }
}