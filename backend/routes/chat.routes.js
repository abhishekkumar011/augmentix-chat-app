import { Router } from "express";
import {
    createGroupChat,
    getOrCreateChat,
    getUserChats,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, getOrCreateChat).get(verifyJWT, getUserChats);
router.route("/group-chat").post(verifyJWT, createGroupChat);

export default router;
