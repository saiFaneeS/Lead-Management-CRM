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
import blockGuestUser from "../middlewares/blockGuestUsers.middleware.js";

const router = Router();

// secured routes
router
  .route("/")
  .post(verifyJWT, createTask)
  .get(verifyJWT, blockGuestUser, getAllTasks);
router
  .route("/:id")
  .get(verifyJWT, blockGuestUser, getTaskById)
  .patch(verifyJWT, blockGuestUser, updateTaskDetails)
  .delete(verifyJWT, blockGuestUser, deleteTask);
router
  .route("/priority/:priority")
  .get(verifyJWT, blockGuestUser, getTasksByPriority);

export default router;
