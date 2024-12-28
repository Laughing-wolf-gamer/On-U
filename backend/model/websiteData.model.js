import mongoose from 'mongoose'

const websiteSchema = new mongoose.Schema({
    AboutData:{
        type:Object,
        required:true,
        default:{
            Headers:{
                type:String,
                required:true,
                default:'Welcome to ON-U'
            },
            SubHeaders:{
                type:String,
                required:true,
                default:"Where innovation meets style – Your go-to e-commerce destination"
            },
            OurMission:{
                type:String,
                required:true,
                default:"At ON-U, we are dedicated to offering high-quality products, from fashion to electronics, with a focus on sustainability and customer satisfaction."
            },
            Description:{
                type:String,
                default:''
            },
            Image:{
                type:String,
                default:''
            },
            TeamData:[
                {
                    Image:{
                        type:String,
                        default:''
                    },
                    Name:{
                        type:String,
                        default:''
                    },
                    Position:{
                        type:String,
                        default:''
                    }
                }
            ],
            GoalsData:[
                {
                    Header:String,
                    Description:String
                }
            ]
        }
    }
},{timestamps:true})

const WebSiteModel = mongoose.model('websiteData', websiteSchema)
export default WebSiteModel;