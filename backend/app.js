import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoute from './routes/adminRoutes/admin.route.js'
import commonRoute from './routes/common.Routes/common.routes.js'
import User from './routes/userroutes.js';
import Product from './routes/productroute.js';
import Order from './routes/orderroutes.js';
import paymentRoutes from './routes/payment.route.js'
import razorPayRoute from './routes/razerPayPayment.route.js'
import errorMiddleware from './Middelwares/error.js';
import path from "path";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import shipRocketHookRoute from './routes/logisticRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config(/* { path: "backend/config/config.env" } */);
}
app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_ADMIN,
];
app.use(cors({
  origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      console.log("Origin: " + origin,allowedOrigins.includes(origin))
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization','Cache-Control','Expires','Pragma'],
  credentials: true,
}))


app.use('/admin',adminRoute)
app.use('/api/common',commonRoute)
app.use('/api/auth', User)
app.use('/api/shop', Product)
app.use('/api/shop', Order)
app.use('/api/payment', paymentRoutes)
app.use('/api/payment/razerypay',razorPayRoute)
app.use('/api/logistic',shipRocketHookRoute)


app.use(express.static(path.join(__dirname, "../frontend/build")));


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});






app.use(errorMiddleware)
export default app
