import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';


dotenv.config()


const PORT = process.env.PORT


app.use(express.json())
app.use(cors())
connectDB()

app.listen(PORT, () => {
    console.log("servidor conectado exitosamente", PORT)
})

export default app