import { Router } from "express";
import {
  addLeadToPipelineStage,
  createPipelineStage,
  deleteLeadCompletely,
  deletePipelineStage,
  getPipelineStagesById,
  moveLead,
  removeLeadFromStage,
  updatePipelineStage,
} from "../controllers/pipelineStage.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import blockGuestUser from "../middlewares/blockGuestUsers.middleware.js";

const router = Router();

router
  .route("/create-stage/:id")
  .post(verifyJWT, blockGuestUser, createPipelineStage);
router.route("/add-lead").post(addLeadToPipelineStage);
router.route("/:id").get(verifyJWT, blockGuestUser, getPipelineStagesById);
router
  .route("/update-stage/:id")
  .patch(verifyJWT, blockGuestUser, updatePipelineStage);
router
  .route("/delete-stage/:id")
  .delete(verifyJWT, blockGuestUser, deletePipelineStage);
router
  .route("/remove-lead")
  .patch(verifyJWT, blockGuestUser, removeLeadFromStage);
router
  .route("/delete-lead/:leadId")
  .delete(verifyJWT, blockGuestUser, deleteLeadCompletely);
router.route("/move-lead").post(verifyJWT, blockGuestUser, moveLead);

export default router;
