import mongoose from 'mongoose'

const connectdatabse = async ()=>{
    try {
        mongoose.set('strictQuery',false);
        console.log("DB Uri ",process.env.DB_URI);
        const data = await mongoose.connect(process.env.DB_URI);
        console.log(`Database connected ${data.connection.host}`)
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
    }
}

export default connectdatabse