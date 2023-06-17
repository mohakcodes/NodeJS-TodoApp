import express from "express";

import userRouting from "./routes/user.js";
import taskRouting from "./routes/task.js";

import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

import cors from "cors";

export const app = express();

config({
    path:"./data/config.env",
});

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[process.env.FRONTEND_URL], //ensure no outer request will be working
    methods:["GET","POST","PUT","DELETE"], //only these methods will be working
    credentials:true, //API will work but, without it no headers will be reaching frontend
}));

app.use("/users" , userRouting);
app.use("/tasks" , taskRouting);

app.get("/" , (req,res)=>{
    res.send("noice working");
})

app.use(errorMiddleware);