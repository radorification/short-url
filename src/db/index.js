
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/urlShortner`);
        console.log(`Database connected!!! HOST: ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1)
    }
}

export default connectDB