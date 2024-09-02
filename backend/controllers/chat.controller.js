import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//One on one chat
const getOrCreateChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId?.trim()) {
    throw new ApiError(400, "userId is required");
  }

  if (userId === req.user?._id.toString()) {
    throw new ApiError(400, "You can't chat with yourself");
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  let existingChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user?._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password -refreshToken")
    .populate("latestMessage");

  existingChat = await User.populate(existingChat, {
    path: "latestMessage.sender",
    select: "fullName, email, avatar",
  });

  if (existingChat.length > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, existingChat[0], "Chat found successfully"));
  }

  const newChat = await Chat.create({
    chatName: "sender",
    users: [req.user?._id, userId],
  });

  if (!newChat) {
    throw new ApiError(500, "New chat is not created");
  }

  const createdChat = await Chat.findById(newChat._id).populate(
    "users",
    "-password -refreshToken"
  );

  if (!createdChat) {
    throw new ApiError(500, "Something went wrong while creating chat");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdChat, "chat created successfully"));
});

export { getOrCreateChat };
