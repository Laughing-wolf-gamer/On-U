const mongoose = require('mongoose')

const connectdatabse = ()=>{
    mongoose.connect("mongodb+srv://laughingwolfgamer:Amsp99@cluster0.i72pe.mongodb.net/e-commerce-New?retryWrites=true&w=majority&appName=Cluster0", {useNewUrlParser: true,
         useUnifiedTopology:true,
        }).then((data)=>{
        console.log(`Database connected ${data.connection.host}`)
    })

}

module.exports = connectdatabse