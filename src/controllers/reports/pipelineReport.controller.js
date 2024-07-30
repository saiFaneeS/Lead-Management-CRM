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

export { getPipelineLeadAging };
