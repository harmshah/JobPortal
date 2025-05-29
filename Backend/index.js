import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';    
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';

dotenv.config({});


const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    //methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));


const PORT = process.env.PORT || 5002;


//apis
app.use('/api/users', userRoute);
app.use('/api/company', companyRoute);
app.use('/api/job', jobRoute);
app.use('/api/application', applicationRoute);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
    });