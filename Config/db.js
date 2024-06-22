import mongoose from "mongoose"

const connectDb = () => {
     mongoose.connect(process.env.DB_URL)
     mongoose.connection.on('connected' ,()=> {
        console.log('connected to monogodb database')
     } )
}

export default connectDb;