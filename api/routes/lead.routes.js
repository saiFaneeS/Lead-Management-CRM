import { Router } from "express";
import {
  deleteLeadById,
  getAllLeads,
  getLeadById,
  registerLead,
  updateLeadDetails,
} from "../controllers/lead.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerLead);

// secured
router.route("/").get(verifyJWT, getAllLeads);
router.route("/:id").get(verifyJWT, getLeadById);
router.route("/:id").delete(verifyJWT, deleteLeadById);
router.route("/update-lead/:id").patch(verifyJWT, updateLeadDetails);

export default router;
