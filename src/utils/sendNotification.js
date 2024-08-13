import { Notification } from "../models/notification.model.js";
import { NotificationPreferences } from "../models/notificationPreferences.model.js";
import sendEmailNotification from "./sendEmailNotification.js";

export const sendNotifications = async (
  userId,
  subject,
  message,
  notificationType
) => {
  const userPreferences = await NotificationPreferences.findOne({
    user: userId,
  });

  if (userPreferences) {
    const { email, inApp } = userPreferences.preferences;

    if (email) {
      await sendEmailNotification(userId, subject, message);
    }

    if (inApp) {
      await Notification.create({
        user: userId,
        message,
        type: notificationType,
      });
    }
  } else {
    console.warn(`No notification preferences found for user: ${userId}`);
  }
};
