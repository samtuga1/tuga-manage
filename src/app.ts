// FROM PACKAGES
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
const app = express();

// FROM FILES/FOLDERS
const authRoutes = require('./routes/auth');
const organisation_routes = require('./routes/organisation');

app.use(express.json())

app.use('/account/user', authRoutes);
app.use('/organisation', organisation_routes);

app.use((error: ResponseError, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const reasons = error.data;
    res.status(statusCode).json({
        message: message,
        reasons: reasons,
    })
});

app.use((req, res, next) => {
    return res.status(404).json({
        message: 'Invalid endpoint',
    })
})

const port = process.env.PORT;

mongoose.connect('mongodb+srv://samuel:'+process.env.DB_PASSWORD+'@cluster0.5y1nvtp.mongodb.net/?retryWrites=true&w=majority').then(res => {
    app.listen(port)
}).catch(err => {
    console.log(err);
});