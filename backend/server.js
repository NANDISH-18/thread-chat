import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config()
connectDb();
const app = express();

const PORT = process.env.port || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use(express.json({limit: '50mb'})); //To parse JSON data in the req.body
app.use(express.urlencoded({limit: '50mb',extended: true})); //To parse the form data in the req.body
app.use(cookieParser());

// Router
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes);



app.listen(PORT, ()=> {
    console.log(`Server is up and running on ${PORT}`);
})
