import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  getTasksByPriority,
  updateTaskDetails,
} from "../controllers/task.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router.route("/").post(verifyJWT, createTask).get(verifyJWT, getAllTasks);
router
  .route("/:id")
  .get(verifyJWT, getTaskById)
  .patch(verifyJWT, updateTaskDetails)
  .delete(verifyJWT, deleteTask);
router.route("/priority/:priority").get(verifyJWT, getTasksByPriority);

export default router;
