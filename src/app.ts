// FROM PACKAGES
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
const app = express();

// FROM FILES/FOLDERS

app.use('/', (req, res) => {
    res.json('Connected');
})

const port = process.env.PORT;

mongoose.connect('mongodb+srv://samuel:Phantom1290.@cluster0.5y1nvtp.mongodb.net/?retryWrites=true&w=majority').then(res => {
    app.listen(port)
}).catch(err => {
    console.log(err);
});