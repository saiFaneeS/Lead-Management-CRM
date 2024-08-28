import { User } from "../../models/user.model.js";
import { Lead } from "../../models/lead.model.js";
import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

// 1. User Engagement Report - Count of tasks and leads assigned to each user
const getUserEngagement = asyncHandler(async (req, res) => {
  try {
    const userEngagement = await User.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "createdBy",
          as: "tasks",
        },
      },
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "assignedTo",
          as: "leads",
        },
      },
      {
        $project: {
          fullName: 1,
          totalTasks: { $size: "$tasks" },
          totalLeads: { $size: "$leads" },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userEngagement,
          "User engagement report generated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating user engagement report.", error);
  }
});

// 2. Users per Role Report - Count of users per role
const getUsersPerRole = asyncHandler(async (req, res) => {
  try {
    const usersPerRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          usersPerRole,
          "Users per role report generated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating users per role report.", error);
  }
});

const getUsersCount = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.aggregate([
      {
        $match: {
          role: { $ne: "Guest" }, 
        },
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 }, 
        },
      },
    ]);

    // Ensure the totalUsers is an array with a single object
    const count = totalUsers[0]?.totalUsers || 0;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalUsers: count },
          "Users Count report generated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error generating users count report.", error);
  }
});

export { getUserEngagement, getUsersPerRole, getUsersCount };
