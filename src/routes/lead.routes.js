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
import blockGuestUser from "../middlewares/blockGuestUsers.middleware.js";
const router = Router();

router.route("/register").post(registerLead);

// secured
router.route("/").get(verifyJWT, blockGuestUser, getAllLeads);
router.route("/:id").get(verifyJWT, blockGuestUser, getLeadById);
router.route("/:id").delete(verifyJWT, blockGuestUser, deleteLeadById);
router
  .route("/update-lead/:id")
  .patch(verifyJWT, blockGuestUser, updateLeadDetails);
router.route("/delete-many").post(verifyJWT, blockGuestUser, deleteManyLeads);

export default router;
