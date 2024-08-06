import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createPipeline,
  deletePipeline,
  getAllPipelines,
  getPipelineById,
  updatePipelineDetails,
} from "../controllers/pipeline.controller.js";

const router = Router();

router.route("/create-pipeline").post(verifyJWT, createPipeline);
router.route("/").get(verifyJWT, getAllPipelines);
router.route("/:id").get(verifyJWT, getPipelineById);
router.route("/update-pipeline/:id").patch(verifyJWT, updatePipelineDetails);
router.route("/:id").delete(verifyJWT, deletePipeline);

export default router;
