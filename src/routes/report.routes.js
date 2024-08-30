import { Router } from "express";
import {
  getLeadsConversionRate,
  getLeadsConversionTime,
  getLeadsPerAgent,
  getLeadsPerStatus,
  getLeadsPerTimePeriod,
} from "../controllers/reports/leadReport.controller.js";
import {
  getTasksPerPriority,
  getTaskSummary,
} from "../controllers/reports/taskReport.controller.js";
import {
  getPipelineLeadAging,
  getPipelineConversionRate,
  getLeadsPerPipeline,
} from "../controllers/reports/pipelineReport.controller.js";
import {
  getUserEngagement,
  getUsersCount,
  getUsersPerRole,
} from "../controllers/reports/userReport.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import blockGuestUser from "../middlewares/blockGuestUsers.middleware.js";

const router = Router();

// lead reports
router
  .route("/leads-per-period")
  .get(verifyJWT, blockGuestUser, getLeadsPerTimePeriod);
router
  .route("/leads-per-status")
  .get(verifyJWT, blockGuestUser, getLeadsPerStatus);
router
  .route("/leads-per-agent")
  .get(verifyJWT, blockGuestUser, getLeadsPerAgent);
router
  .route("/leads-conversion-rate")
  .get(verifyJWT, blockGuestUser, getLeadsConversionRate);
router
  .route("/leads-conversion-time")
  .get(verifyJWT, blockGuestUser, getLeadsConversionTime);

// pipeline reports
router
  .route("/pipelines-lead-aging")
  .get(verifyJWT, blockGuestUser, getPipelineLeadAging);
router
  .route("/pipelines-conversion-rate")
  .get(verifyJWT, blockGuestUser, getPipelineConversionRate);
router
  .route("/leads-per-pipeline")
  .get(verifyJWT, blockGuestUser, getLeadsPerPipeline);

// task reports
router.route("/tasks-summary").get(verifyJWT, blockGuestUser, getTaskSummary);
router
  .route("/tasks-per-priority")
  .get(verifyJWT, blockGuestUser, getTasksPerPriority);

// user reports
router
  .route("/user-engagement")
  .get(verifyJWT, blockGuestUser, getUserEngagement);
router.route("/users-per-role").get(verifyJWT, blockGuestUser, getUsersPerRole);
router.route("/users-count").get(verifyJWT, blockGuestUser, getUsersCount);

export default router;
