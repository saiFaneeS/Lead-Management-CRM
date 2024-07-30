import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getTaskSummary = asyncHandler(async (req, res) => {
  try {
    const taskSummary = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
          },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          taskSummary[0],
          "Task summary generated Successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while generating task summary.");
  }
});

const getTasksPerPriority = asyncHandler(async (req, res) => {
  try {
    const tasksPerStatus = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          tasksPerStatus,
          "Tasks per status fetched Successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while fetching tasks per status.");
  }
});

export { getTaskSummary, getTasksPerPriority };
