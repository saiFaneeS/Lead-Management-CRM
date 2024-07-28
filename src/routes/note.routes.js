import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotesByLead,
  updateNote,
} from "../controllers/note.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-note").post(verifyJWT, createNote);
router.route("/lead-notes/:leadId").get(verifyJWT, getNotesByLead);
router.route("/:id").get(verifyJWT, getNoteById);
router.route("/update-note/:id").patch(verifyJWT, updateNote);
router.route("/:id").delete(verifyJWT, deleteNote);

export default router;
