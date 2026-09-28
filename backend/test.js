import request from "supertest";
import app from "./app.js";
import mongoose from "mongoose";

async function connectdbtest() {
    try {
        const MONGO_URI = process.env.MONGO_URI_TEST;
        await mongoose.connect(MONGO_URI);
        console.log("MONGO_DB connected successfully");
        
    } catch (error) {
        console.log(error);
        console.log("error fetching data");
    }
}

beforeAll(async () => {
    await connectdbtest();
})

afterAll(async () => {
  await mongoose.connection.close();
});

