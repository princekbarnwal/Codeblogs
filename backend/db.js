import mongoose from "mongoose";

async function connectdb() {
    try {
        const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI_DOCKER;

          if (!MONGO_URI) {
            throw new Error("MongoDB URI is not defined");
        }

        await mongoose.connect(MONGO_URI);
        console.log("MONGO_DB connected successfully");
        
    } catch (error) {
        console.log(error);
        console.log("error fetching data");
    }
}

export default connectdb;