import { Router } from "express";
import {
  createPipelineStage,
  deletePipelineStage,
  getAllPipelineStages,
  getPipelineStageById,
  updatePipelineStage,
} from "../controllers/pipelineStage.controller.js";

const router = Router();

router.route("/create-stage").post(createPipelineStage);
router.route("/").get(getAllPipelineStages);
router.route("/:id").get(getPipelineStageById);
router.route("/update-stage/:id").patch(updatePipelineStage);
router.route("/delete-stage/:id").delete(deletePipelineStage);

export default router;
