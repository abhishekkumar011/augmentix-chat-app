import { Router } from "express";
import {
  createGroupChat,
  getOrCreateChat,
  getUserChats,
  renameGroupChatName,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/group-chat").post(verifyJWT, createGroupChat);
router.route("/rename-group").post(verifyJWT, renameGroupChatName);
router.route("/").post(verifyJWT, getOrCreateChat).get(verifyJWT, getUserChats);

export default router;
