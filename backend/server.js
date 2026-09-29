import "dotenv/config";
import connectdb from "./db.js";
import app from "./app.js";

await connectdb();

let Port_number = process.env.PORT || 3000;

app.listen(Port_number,()=>{
    console.log(`Server is listening on Port ${Port_number}`);
});