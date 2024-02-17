import express from "express";

//importing routes
import UserRoutes from "./routes/user.js";


const port = 3000;

const app = express();

//using routes
app.use("/api/v1/user", UserRoutes);


app.listen(port, ()=>{
    console.log(`Server is runnning on ${port}`)
})