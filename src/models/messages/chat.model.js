import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
  agent: {
    type: Schema.Types.ObjectId,
    ref: "User",  
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
});

export const Chat = mongoose.model("Chat", chatSchema);
