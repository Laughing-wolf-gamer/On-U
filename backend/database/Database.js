import mongoose from 'mongoose'

const connectdatabse = async ()=>{
    await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true,
         useUnifiedTopology:true,
        }).then((data)=>{
        console.log(`Database connected ${data.connection.host}`)
    })

}

export default connectdatabse