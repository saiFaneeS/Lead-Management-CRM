import { Chat } from "../../models/messages/chat.model.js";
import { Message } from "../../models/messages/message.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createNewMessage = asyncHandler(async (req, res) => {
  const { sender, content, chat } = req.body;

  if (!sender || !content) {
    throw new ApiError(
      400,
      "Please provide both sender Id and message content."
    );
  }

  const message = await Message.create({
    sender,
    content,
    chat,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message created Successfully."));
});

export { createNewMessage };
