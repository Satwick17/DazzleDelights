import express from "express";

//importing routes
import UserRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

const port = 3000;

connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API working with /api/v1");
});

//using routes
app.use("/api/v1/user", UserRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is runnning on ${port}`);
});
