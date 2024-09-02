import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const getUserChats = asyncHandler(async (req, res) => {
  let chats = Chat.find({ users: { $elemMatch: { $eq: req.user?._id } } })
    .populate("users", "-password -refreshToken")
    .populate("groupAdmin", "-password -refreshToken")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  if (!chats || chats.length === 0) {
    throw new ApiError(404, "No chats found for this user");
  }

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "fullName email avatar",
  });

  if (!chats) {
    throw new ApiError(500, "Something went wrong while fetching chats");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "All Chat successfully fetched"));
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!(req.body.users || req.body.name)) {
    return new ApiError(400, "All fields are required");
  }

  let users = JSON.parse(req.body.users);

  if (users.length > 2) {
    throw new ApiError(
      400,
      "More than 2 users are required to form a group chat"
    );
  }

  users.push(req.user?._id);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users,
    isGroupChat: true,
    groupAdmin: req.user?._id,
  });

  if (!groupChat) {
    throw new ApiError(500, "Group chat is not created");
  }

  const groupChatDetails = await Chat.findById(groupChat._id)
    .populate("users", "-password -refreshToken")
    .populate("groupAdmin", "-password -refreshToken");

  if (!groupChatDetails) {
    throw new ApiError(500, "Group chat not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        groupChatDetails,
        "Group chat is successfully created"
      )
    );
});

export { getOrCreateChat, getUserChats, createGroupChat };
