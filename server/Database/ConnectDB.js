const mongoose = require("mongoose")

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Data Base Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    connectDB
}