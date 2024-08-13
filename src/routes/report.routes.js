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

const router = Router();

// lead reports
router.route("/leads-per-period").get(verifyJWT, getLeadsPerTimePeriod);
router.route("/leads-per-status").get(verifyJWT, getLeadsPerStatus);
router.route("/leads-per-agent").get(verifyJWT, getLeadsPerAgent);
router.route("/leads-conversion-rate").get(verifyJWT, getLeadsConversionRate);
router.route("/leads-conversion-time").get(verifyJWT, getLeadsConversionTime);

// pipeline reports
router.route("/pipelines-lead-aging").get(verifyJWT, getPipelineLeadAging);
router
  .route("/pipelines-conversion-rate")
  .get(verifyJWT, getPipelineConversionRate); 
router.route("/leads-per-pipeline").get(verifyJWT, getLeadsPerPipeline); 

// task reports
router.route("/tasks-summary").get(verifyJWT, getTaskSummary);
router.route("/tasks-per-priority").get(verifyJWT, getTasksPerPriority);

// user reports
router.route("/user-engagement").get(verifyJWT, getUserEngagement); 
router.route("/users-per-role").get(verifyJWT, getUsersPerRole); 
router.route("/users-count").get(verifyJWT, getUsersCount); 

export default router;
