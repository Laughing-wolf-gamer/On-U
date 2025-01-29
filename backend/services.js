import App from './app.js';
import { getAuthToken } from './controller/LogisticsControllers/shiprocketLogisticController.js';
import connectdatabse from './database/Database.js';
import { config } from 'dotenv';
config();

process.on('uncaughtException', (err)=>{
    console.log(`Error: `,err)
    console.log(`shutting down server due to uncaught Exception`)
    process.exit(1)
})
const PORT = process.env.PORT || 8003;
const server = App.listen(process.env.PORT, ()=>{
    console.log(`Server on http://localhost:${PORT}`)
    try {
        getAuthToken();
    } catch (error) {
        console.error("Error getting ShipRocket auth token: ",error);
    }
})

connectdatabse()

process.on('unhandledRejection', (err)=>{
    console.log(`Error `,err);
    console.log(`shutting down server due unhandled promise rejection`)

    server.close(()=>{
        process.exit(1);
    })
})

