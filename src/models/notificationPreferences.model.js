import mongoose, { Schema } from "mongoose";

const notificationPreferencesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferences: {
    email: {
      type: Boolean,
      default: true,
    },
    inApp: {
      type: Boolean,
      default: true,
    },
  },
});

export const NotificationPreferences = mongoose.model(
  "NotificationPreferences",
  notificationPreferencesSchema
);
