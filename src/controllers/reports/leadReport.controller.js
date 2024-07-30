import { Lead } from "../../models/lead.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import formatDuration from "../../utils/formatTime.js";

const getLeadsPerMonth = asyncHandler(async (req, res) => {
  try {
    const leadsPerMonth = await Lead.aggregate([
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          totalLeads: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          leadsPerMonth,
          "Leads per month fetched Successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating leads per month report.", error);
  }
});

const getLeadsPerStatus = asyncHandler(async (req, res) => {
  try {
    const leadsPerStatus = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          leadsPerStatus,
          "Leads per month fetched Successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating leads per month report.", error);
  }
});

const getLeadsPerAgent = asyncHandler(async (req, res) => {
  try {
    const leadsPerAgent = await Lead.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          leadsPerAgent,
          "Leads per month fetched Successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating leads per month report.", error);
  }
});

const getLeadsConversionRate = asyncHandler(async (req, res) => {
  try {
    const leadConversionRate = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          convertedLeads: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed_won"] }, 1, 0],
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
          leadConversionRate[0],
          "Lead conversion rate generated Successfully."
        )
      );
  } catch (error) {
    throw new ApiResponse(500, "Error generating lead conversion rate", error);
  }
});

const getLeadsConversionTime = asyncHandler(async (req, res) => {
  try {
    const conversionTimes = await Lead.aggregate([
      { $match: { status: "completed_won" } },
      {
        $project: {
          conversionTime: {
            $subtract: ["$updatedAt", "$createdAt"],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgConversionTime: { $avg: "$conversionTime" },
        },
      },
    ]);

    const avgConversionTime = conversionTimes[0]?.avgConversionTime || 0;
    const formattedAvgConversionTime = formatDuration(avgConversionTime);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { avgConversionTime, formattedAvgConversionTime },
          "Average lead conversion time generated Successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating lead conversion time."
    );
  }
});

export {
  getLeadsPerMonth,
  getLeadsPerStatus,
  getLeadsPerAgent,
  getLeadsConversionRate,
  getLeadsConversionTime,
};
