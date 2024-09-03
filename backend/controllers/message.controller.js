import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/Message.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!(content || content.trim())) {
    throw new ApiError(400, "Content is required");
  }

  if (!chatId) {
    throw new ApiError(400, "ChatId is required");
  }

  let messageData = {
    sender: req.user?._id,
    content,
    chat: chatId,
  };

  let message = await Message.create(messageData);
  message = await message.populate("sender", "fullName avatar");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "fullName email avatar",
  });

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "message created successfully"));
});

export { sendMessage };
