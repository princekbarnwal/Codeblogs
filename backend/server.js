import "dotenv/config";
import app from "./app.js";

let Port_number = process.env.PORT || 3000;

app.listen(Port_number,()=>{
    console.log(`Server is listening on Port ${Port_number}`);
});