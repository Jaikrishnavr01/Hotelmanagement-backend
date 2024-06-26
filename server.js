import express from 'express';

import dotenv from 'dotenv';
import connectDb from './Config/db.js'

import hotel from './Routers/HotelRouter.js'
import cors from 'cors';

dotenv.config();

const app= express()
app.use(cors());

//monogo db 
connectDb()

app.get("/" ,(req, res) => {
    res.send("Home Page of hotel management")
})

app.use("/auth", hotel);



app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})