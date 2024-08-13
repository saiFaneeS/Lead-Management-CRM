import { Lead } from "../../models/lead.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getPipelineLeadAging = asyncHandler(async (req, res) => {
  try {
    const leadAging = await Lead.aggregate([
      {
        $match: { status: { $ne: "completed_won" } },
      },
      {
        $project: {
          leadAge: {
            $subtract: [new Date(), "$createdAt"],
          },
          status: 1,
          name: 1,
        },
      },
      {
        $group: {
          _id: "$status",
          avgLeadAge: { $avg: "$leadAge" },
          maxLeadAge: { $max: "$leadAge" },
          minLeadAge: { $min: "$leadAge" },
        },
      },
      {
        $project: {
          status: "$_id",
          avgLeadAge: 1,
          maxLeadAge: 1,
          minLeadAge: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          leadAging,
          "Lead aging report generated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating lead aging report", error);
  }
});

// 2. Pipeline Conversion Rate Report
const getPipelineConversionRate = asyncHandler(async (req, res) => {
  try {
    const pipelineConversionRate = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          totalLeads: { $sum: 1 },
          convertedLeads: {
            $sum: {
              $cond: [
                { $in: ["$status", ["completed_won", "closed_won"]] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          conversionRate: {
            $multiply: [{ $divide: ["$convertedLeads", "$totalLeads"] }, 100],
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          pipelineConversionRate,
          "Pipeline conversion rate report generated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating pipeline conversion rate report",
      error
    );
  }
});

// 3. Leads per Pipeline Report
const getLeadsPerPipeline = asyncHandler(async (req, res) => {
  try {
    const leadsPerPipeline = await Lead.aggregate([
      {
        $lookup: {
          from: "pipelines",
          localField: "pipeline",
          foreignField: "_id",
          as: "pipeline",
        },
      },
      {
        $group: {
          _id: "$pipeline.pipelineName",
          count: { $sum: 1 },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          leadsPerPipeline,
          "Leads per pipeline report generated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating leads per pipeline report",
      error
    );
  }
});

export { getPipelineLeadAging, getPipelineConversionRate, getLeadsPerPipeline };
