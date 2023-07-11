// FROM PACKAGES
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { ErrorResponse } from "./types/express_types";
const app = express();

// FROM FILES/FOLDERS
const authRoutes = require('./routes/auth');

app.use(express.json())

app.use('/auth', authRoutes);

app.use((error: ErrorResponse, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const reasons = error.data;
    res.status(statusCode).json({
        message: message,
        reasons: reasons,
    })
})

const port = process.env.PORT;

mongoose.connect('mongodb+srv://samuel:Phantom1290.@cluster0.5y1nvtp.mongodb.net/?retryWrites=true&w=majority').then(res => {
    app.listen(port)
}).catch(err => {
    console.log(err);
});