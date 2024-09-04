import { Message } from "../../models/messages/message.model.js";
import { Chat } from "../../models/messages/chat.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  notifyFirstMessage,
  notifyNewMessage,
} from "../../utils/notifications/messageNotification.js";
import { User } from "../../models/user.model.js";

const createNewMessage = asyncHandler(async (req, res) => {
  const { sender, reciever, content, chat } = req.body;

  if (!sender || !content) {
    throw new ApiError(
      400,
      "Please provide both sender Id and message content."
    );
  }

  const message = await Message.create({
    sender,
    reciever,
    content,
    chat,
  });

  const msgChat = await Chat.findById(chat).populate("lastMessage");

  await Chat.findByIdAndUpdate(chat, {
    $set: {
      lastMessage: message._id,
    },
  });
  // console.log("Chat: ", msgChat);

  const senderData = await User.findById(sender);
  const recieverData = await User.findById(reciever);

  if (!msgChat.lastMessage) {
    // console.log("first message!");
    await notifyFirstMessage(senderData, recieverData, content);
  } else {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    if (msgChat.lastMessage.createdAt < thirtyMinutesAgo) {
      // console.log(
      //   "last message was more than 30 minutes ago"
      // );
      await notifyNewMessage(senderData, recieverData, content);
    } else {
      // console.log(
      //   "last message was sent within the last 30 minutes"
      // );
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message created Successfully."));
});

export { createNewMessage };
