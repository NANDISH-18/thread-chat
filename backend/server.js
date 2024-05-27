import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config()
connectDb();
const app = express();

const PORT = process.env.port || 5000;

app.use(express.json()); //To parse JSON data in the req.body
app.use(express.urlencoded({extended: true})); //To parse the form data in the req.body
app.use(cookieParser());

// Router
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes);



app.listen(PORT, ()=> {
    console.log(`Server is up and running on ${PORT}`);
})
