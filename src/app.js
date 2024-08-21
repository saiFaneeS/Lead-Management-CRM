import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://ms-crm.vercel.app",
  
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import leadRouter from "./routes/lead.routes.js";
import pipelineRouter from "./routes/pipeline.routes.js";
import pipelineStageRouter from "./routes/pipelineStage.routes.js";
import noteRouter from "./routes/note.routes.js";
import taskRouter from "./routes/task.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import reportsRouter from "./routes/report.routes.js";

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/pipelines", pipelineRouter);
app.use("/api/v1/pipeline-stages", pipelineStageRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/reports", reportsRouter);

app.get("/", (req, res) => res.send("API - LMS"));

export { app };
