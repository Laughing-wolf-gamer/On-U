import App from './app.js';
import ngrok from 'ngrok';
import { getAuthToken } from './controller/LogisticsControllers/shiprocketLogisticController.js';
import connectdatabse from './database/Database.js';
import { config } from 'dotenv';
config();

process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down server due to uncaught Exception`)
    process.exit(1)
})
const PORT = process.env.PORT || 8000;
const server = App.listen(process.env.PORT, ()=>{
    console.log(`Server on http://localhost:${PORT}`)
    getAuthToken();
    ngrok.connect({addr: PORT}).then((url)=>{
        console.log(`Public URL: ${url}`)
    }).catch((err)=>{
        console.error(`Error starting ngrok: ${err}`)
    })
})

connectdatabse()

process.on('unhandledRejection', (err)=>{
    console.log(`Error ${err.message}`);
    console.log(`shutting down server due unhandled promise rejection`)

    server.close(()=>{
        process.exit(1);
    })
})

