import { Router } from "express";
import {
  addUserToGroup,
  createGroupChat,
  getOrCreateChat,
  getUserChats,
  renameGroupChatName,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-user").post(verifyJWT, addUserToGroup);
router.route("/group-chat").post(verifyJWT, createGroupChat);
router.route("/rename-group").patch(verifyJWT, renameGroupChatName);
router.route("/").post(verifyJWT, getOrCreateChat).get(verifyJWT, getUserChats);

export default router;
