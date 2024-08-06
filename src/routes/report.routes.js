import { Router } from "express";
import {
  getLeadsConversionRate,
  getLeadsConversionTime,
  getLeadsPerAgent,
  getLeadsPerMonth,
  getLeadsPerStatus,
} from "../controllers/reports/leadReport.controller.js";
import {
  getTasksPerPriority,
  getTaskSummary,
} from "../controllers/reports/taskReport.controller.js";
import { getPipelineLeadAging } from "../controllers/reports/pipelineReport.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// lead reports
router.route("/leads-per-month").get(verifyJWT, getLeadsPerMonth);
router.route("/leads-per-status").get(verifyJWT, getLeadsPerStatus);
router.route("/leads-per-agent").get(verifyJWT, getLeadsPerAgent);
router.route("/leads-conversion-rate").get(verifyJWT, getLeadsConversionRate);
router.route("/leads-conversion-time").get(verifyJWT, getLeadsConversionTime);

// pipeline reports
router.route("/pipelines-lead-aging").get(verifyJWT, getPipelineLeadAging);

// task reports
router.route("/tasks-summary").get(verifyJWT, getTaskSummary);
router.route("/tasks-per-priority").get(verifyJWT, getTasksPerPriority);

export default router;
