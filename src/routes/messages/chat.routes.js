import { Router } from "express";
import {
  deleteChatMessage,
  getAllChats,
  getChatById,
  registerNewChat,
  setLastMessage,
} from "../../controllers/messages/chat.controller.js";

const router = Router();

router.route("/:id").get(getAllChats);
router.route("/chat/:id").get(getChatById);
router.route("/register").post(registerNewChat);
router.route("/chat/:id").delete(deleteChatMessage);
router.route("/update-last-message/:id").patch(setLastMessage);

export default router;
