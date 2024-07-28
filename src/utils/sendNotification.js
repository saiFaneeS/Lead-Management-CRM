import { NotificationPreferences } from "../models/notificationPreferences.model.js";
import ApiResponse from "./ApiResponse.js";
import sendEmailNotification from "./sendEmailNotification.js";

export const sendNotifications = async (
  userId,
  subject,
  message,
  notificationType
) => {
  try {
    const userPreferences = await NotificationPreferences.findOne({
      user: userId,
    });

    if (!userPreferences) {
      throw new ApiError(
        404,
        "Notification preferences not found for the user."
      );
    }

    const { email: emailPref, inApp: inAppPref } = userPreferences.preferences;

    if (emailPref) {
      await sendEmailNotification(userId, subject, message);
    }

    // if (inAppPref) {
    //   await Notification.create({
    //     user: userId,
    //     message,
    //     type: notificationType,
    //   });
    // }
    console.log("Email sent successfully.");
  } catch (error) {
    throw new ApiError(500, "Failed to send notifications.", error);
  }
};
