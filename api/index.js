import dotenv from "dotenv";
import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(
    () => app.listen(process.env.PORT || 8000),
    console.log(`Server is running on: ${process.env.PORT}`)
  )
  .catch((err) => {
    console.log("MongoDB connection failed !! ", err);
  });
