import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import { createServer } from "node:http";
import configureSocket from "./src/socket.js";

dotenv.config({
  path: "./.env",
});

const server = createServer(app);

const io = configureSocket(server);

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !! ", err);
  });

export { io };
