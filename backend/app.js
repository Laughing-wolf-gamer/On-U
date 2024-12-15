import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import User from './routes/userroutes.js';
import Product from './routes/productroute.js';
import Order from './routes/orderroutes.js';
import errorMiddleware from './Middelwares/error.js';
import path from "path";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))

app.use('/api/v1', User)
app.use('/api/v1', Product)
app.use('/api/v1', Order)

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

app.use(errorMiddleware)
export default app
