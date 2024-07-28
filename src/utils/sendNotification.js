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

  const { email: emailPref, inApp: inAppPref } = userPreferences.preferences;

  if (emailPref) {
    await sendEmailNotification(userId, subject, message);
  }

  if (inAppPref) {
    await Notification.create({
      user: userId,
      message,
      type: notificationType,
    });
  }
};
