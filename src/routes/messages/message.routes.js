import { Router } from "express";
import { createNewMessage } from "../../controllers/messages/message.controller.js";

const router = Router();

router.route("/create").post(createNewMessage);
export default router;
