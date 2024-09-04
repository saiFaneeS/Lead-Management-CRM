import { Router } from "express";
import {
  deleteChat,
  deleteChatMessage,
  getAllChats,
  getChatById,
  markMessageRead,
  registerNewChat,
} from "../../controllers/messages/chat.controller.js";
import verifyJWT from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/:id").get(getAllChats);
router.route("/chat/:id").get(getChatById);
router.route("/register").post(registerNewChat);
router.route("/chat/:id").delete(deleteChatMessage);
router.route("/delete-chat/:id").delete(deleteChat);
router.route("/mark-read/:chatId").post(verifyJWT, markMessageRead);

export default router;
