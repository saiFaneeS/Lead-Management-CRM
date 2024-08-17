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

const router = Router();

router.route("/create-stage/:id").post(createPipelineStage);
router.route("/add-lead").post(verifyJWT, addLeadToPipelineStage);
router.route("/:id").get(getPipelineStagesById);
router.route("/update-stage/:id").patch(updatePipelineStage);
router.route("/delete-stage/:id").delete(deletePipelineStage);
router.route("/remove-lead").patch(removeLeadFromStage);
router.route("/delete-lead/:leadId").delete(deleteLeadCompletely);
router.route("/move-lead").post(moveLead);

export default router;
