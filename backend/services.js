import App from './app.js';
import connectdatabse from './database/Database.js';
import { config } from 'dotenv';
import logger from './utility/loggerUtils.js';
config();

process.on('uncaughtException', (err)=>{
	logger.alert(`Shutting down server due to unhandled promise rejection!`);
    console.log(`shutting down server due to uncaught Exception`)
    process.exit(1)
})
const PORT = process.env.PORT || 8004;
let server = null
connectdatabse().then(()=>{
	server = App.listen(PORT, ()=>{
		console.log(`Server running on ${process.env.API_URL}`)
	})
})

process.on('unhandledRejection', (err)=>{
	logger.alert(`Shutting down server due to unhandled promise rejection!`);
    console.log(`shutting down server due unhandled promise rejection`,err);

    server.close(()=>{
        process.exit(1);
    })
})

