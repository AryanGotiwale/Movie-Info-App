import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js"
import authRoutes from "./routes/authRoutes.js"
import movieRoutes from "./routes/movieRoutes.js"
import  errorHandler  from "./middlewares/errorMiddleware.js";


dotenv.config();
connectDB();



const app = express();
// console.log("authRoutes =", authRoutes);

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Server OK");
});
// console.log("movieRoutes =", movieRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes)
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
