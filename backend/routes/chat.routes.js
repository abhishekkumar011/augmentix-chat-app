import { Router } from "express";
import { getOrCreateChat } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, getOrCreateChat);

export default router;
