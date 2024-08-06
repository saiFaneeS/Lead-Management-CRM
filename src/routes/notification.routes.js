import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createNotification,
  createOrUpdateUserNotificationPreferences,
  deleteNotification,
  getAllNotificationsForUser,
  getUserNotificationPreferences,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router
  .route("/")
  .post(createNotification)
  .get(verifyJWT, getAllNotificationsForUser);

router.route("/:id").post(markNotificationAsRead).delete(deleteNotification);

// preferences
router
  .route("/preferences")
  .get(verifyJWT, getUserNotificationPreferences)
  .patch(verifyJWT, createOrUpdateUserNotificationPreferences);

export default router;
