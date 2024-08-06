import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "User",
  },
  permissions: {
    type: [String],
    required: true,
  },
});

export const Role = mongoose.model("Role", roleSchema);
