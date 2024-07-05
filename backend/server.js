import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {v2 as cloudinary} from 'cloudinary'
import {app, server} from './socket/socket.js'
import cors from 'cors';

dotenv.config()
connectDb();

const PORT = process.env.port || 5000;
const __dirname = path.resolve();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST']
}))


app.use(express.json({limit: '50mb'})); //To parse JSON data in the req.body
app.use(express.urlencoded({limit: '50mb',extended: true})); //To parse the form data in the req.body
app.use(cookieParser());

// Router
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// http://localhost:5000 -> backend ,frontend

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '/Frontend/dist')))

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'Frontend', 'dist', 'index.html'))
    })

}


server.listen(PORT, ()=> {
    console.log(`Server is up and running on ${PORT}`);
})
