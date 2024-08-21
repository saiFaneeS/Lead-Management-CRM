import { Router } from "express";
import {
  deleteLeadById,
  deleteManyLeads,
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
router.route("/delete-many").post(verifyJWT, deleteManyLeads);

export default router;
