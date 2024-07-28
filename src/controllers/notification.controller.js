import { Notification } from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createNotification = asyncHandler(async (req, res) => {
  const { user, message, type } = req.body;

  if (!user || !message || !type) {
    throw new ApiError(400, "All fields are required.");
  }

  try {
    const notification = await Notification.create({
      user,
      message,
      type,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, notification, "Notification created successfully.")
      );
  } catch (error) {
    throw new ApiError(500, "Error creating notification.", error);
  }
});

const getAllNotificationsForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Unauthorized Request.");
  }

  try {
    const notifications = await Notification.find({ user: userId });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notifications,
          "Notifications fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching notifications.", error);
  }
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, "Notification not found.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, notification, "Notification marked as read."));
  } catch (error) {
    throw new ApiError(500, "Error marking notification as read.", error);
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.findByIdAndDelete(id);

    const notificationExists = await Notification.findById(id);

    if (notificationExists) {
      throw new ApiError(400, "Error occurred while deleting notification.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Notification deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Error deleting notification.", error);
  }
});

// Preferences

import { NotificationPreferences } from "../models/notificationPreferences.model.js";

const createOrUpdateUserNotificationPreferences = asyncHandler(
  async (req, res) => {
    const { email, inApp } = req.body;

    try {
      const existingPreferences = await NotificationPreferences.findOne({
        user: req.user._id,
      });

      if (existingPreferences) {
        const updatedPreferences =
          await NotificationPreferences.findByIdAndUpdate(
            existingPreferences._id,
            {
              preferences: {
                email,
                inApp,
              },
            },
            { new: true }
          );

        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              updatedPreferences,
              "Notification preferences updated successfully."
            )
          );
      } else {
        const newPreferences = await NotificationPreferences.create({
          user: req.user._id,
          preferences: {
            email,
            inApp,
          },
        });

        return res
          .status(201)
          .json(
            new ApiResponse(
              201,
              newPreferences,
              "Notification preferences created successfully."
            )
          );
      }
    } catch (error) {
      throw new ApiError(
        500,
        "Error creating or updating notification preferences.",
        error
      );
    }
  }
);

const getUserNotificationPreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Unauthorized Request.");
  }

  try {
    const preferences = await NotificationPreferences.findOne({ user: userId });

    if (!preferences) {
      throw new ApiError(404, "Notification preferences not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          preferences,
          "Notification preferences fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching notification preferences.", error);
  }
});

export {
  createNotification,
  getAllNotificationsForUser,
  markNotificationAsRead,
  deleteNotification,
  createOrUpdateUserNotificationPreferences,
  getUserNotificationPreferences,
};
