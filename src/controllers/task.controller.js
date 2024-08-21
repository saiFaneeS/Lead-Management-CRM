import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import ApiError from "../utils/ApiError.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, assignedTo, priority } = req.body;

  if (!title || !priority) {
    throw new ApiError(400, "Cant create task without title and priority.");
  }

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      createdBy: req.user._id,
      assignedTo,
      priority,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, task, "Task created successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating task.");
  }
});

const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "fullName");

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching all tasks.");
  }
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "createdBy",
    "fullName"
  );

  if (!task) {
    return res.status(404).json(new ApiResponse(404, null, "Task not found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully."));
});

const updateTaskDetails = asyncHandler(async (req, res) => {
  const { title, description, dueDate, assignedTo, priority, status } =
    req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.assignedTo = assignedTo || task.assignedTo;
  task.priority = priority || task.priority;
  task.status = status || task.status;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully."));
});

const deleteTask = asyncHandler(async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully."));
});

const getTasksByPriority = asyncHandler(async (req, res) => {
  const { priority } = req.params;
  try {
    const tasks = await Task.find({ priority }).populate(
      "createdBy",
      "fullName"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          tasks,
          `Tasks with priority "${priority}" fetched successfully.`
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while fetching tasks of priority "${priority}".`
    );
  }
});



export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskDetails,
  deleteTask,
  getTasksByPriority,
};
