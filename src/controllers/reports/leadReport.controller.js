import { Lead } from "../../models/lead.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import formatDuration from "../../utils/formatTime.js";

const getLeadsPerTimePeriod = asyncHandler(async (req, res) => {
  try {
    const totalLeads = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
        },
      },
    ]);

    // const leadsPerDay = await Lead.aggregate([
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$createdAt" },
    //         month: { $month: "$createdAt" },
    //         day: { $dayOfMonth: "$createdAt" },
    //       },
    //       // totalLeads: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    //   },
    // ]);

    const leadsPerMonth = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          leads: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed_won"] }, 1, 0],
            },
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed_lost"] }, 1, 0],
            },
          },
        },
      },
      {
        $addFields: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                { case: { $eq: ["$_id.month", 12] }, then: "December" },
              ],
              default: "Unknown",
            },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: 1,
          leads: 1,
          won: 1,
          lost: 1,
        },
      },
    ]);

    // const leadsPerYear = await Lead.aggregate([
    //   {
    //     $group: {
    //       _id: { $year: "$createdAt" },
    //       // totalLeads: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { _id: 1 },
    //   },
    // ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          totalLeads: totalLeads[0]?.totalLeads || 0,
          // leadsPerDay,
          leadsPerMonth,
          // leadsPerYear,
        },
        "Leads per day, month, and year fetched successfully."
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating leads per day, month, and year report.",
      error
    );
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
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
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
  getLeadsPerTimePeriod,
  getLeadsPerStatus,
  getLeadsPerAgent,
  getLeadsConversionRate,
  getLeadsConversionTime,
};
