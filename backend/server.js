import "dotenv/config";
import redis from "./redis.js";
import connectdb from "./db.js";
import app from "./app.js";

redis.on("ready" , () => console.log("Redis connected successfully"));

await connectdb();

let Port_number = process.env.PORT || 3000;

app.listen(Port_number,()=>{
    console.log(`Server is listening on Port ${Port_number}`);
});