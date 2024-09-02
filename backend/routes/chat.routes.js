import { Router } from "express";
import {
  getOrCreateChat,
  getUserChats,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, getOrCreateChat).get(verifyJWT, getUserChats);

export default router;
