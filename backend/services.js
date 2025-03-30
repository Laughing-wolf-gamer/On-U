import App from './app.js';
import connectdatabse from './database/Database.js';
import { config } from 'dotenv';
config();

process.on('uncaughtException', (err)=>{
    console.log(`Error: `,err)
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
    console.log(`Error `,err);
    console.log(`shutting down server due unhandled promise rejection`)

    server.close(()=>{
        process.exit(1);
    })
})

