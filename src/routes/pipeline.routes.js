import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createPipeline,
  deletePipeline,
  getAllPipelines,
  getPipelineById,
  updatePipelineDetails,
} from "../controllers/pipeline.controller.js";
import blockGuestUser from "../middlewares/blockGuestUsers.middleware.js";
const router = Router();

router
  .route("/create-pipeline")
  .post(verifyJWT, blockGuestUser, createPipeline);
router.route("/").get(verifyJWT, blockGuestUser, getAllPipelines);
router.route("/:id").get(verifyJWT, blockGuestUser, getPipelineById);
router
  .route("/update-pipeline/:id")
  .patch(verifyJWT, blockGuestUser, updatePipelineDetails);
router.route("/:id").delete(verifyJWT, blockGuestUser, deletePipeline);

export default router;
