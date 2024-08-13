import { Router } from "express";
import {
  addLeadToPipelineStage,
  createPipelineStage,
  deletePipelineStage,
  getAllPipelineStages,
  getPipelineStagesById,
  updatePipelineStage,
} from "../controllers/pipelineStage.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-stage").post(createPipelineStage);
router.route("/add-lead").post(verifyJWT, addLeadToPipelineStage);
router.route("/all-stages").get(getAllPipelineStages);
router.route("/:id").get(getPipelineStagesById);
router.route("/update-stage/:id").patch(updatePipelineStage);
router.route("/delete-stage/:id").delete(deletePipelineStage);

export default router;
