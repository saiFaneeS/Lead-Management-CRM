import mongoose from "mongoose";
import { Pipeline } from "../models/pipeline.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPipeline = asyncHandler(async (req, res) => {
  const { pipelineName } = req.body;

  if (!pipelineName) {
    throw new ApiError(400, "Pipeline name is required.");
  }

  try {
    const pipeline = await Pipeline.create({
      pipelineName,
      createdBy: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, pipeline, "Pipeline created Successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while creating pipeline",
      error
    );
  }
});

const getAllPipelines = asyncHandler(async (req, res) => {
   const pipelines = await Pipeline.find();
  // console.log(pipelines);

  return res
    .status(200)
    .json(new ApiResponse(200, pipelines, "Pipelines fetched Successfully."));
});

const getPipelineById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid pipeline ID.");
  }

  const pipeline = await Pipeline.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "pipelinestages",
        localField: "_id",
        foreignField: "pipeline",
        as: "stages",
      },
    },
    {
      $unwind: {
        path: "$stages",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "leads",
        localField: "stages.leads",
        foreignField: "_id",
        as: "stages.leads",
      },
    },
    {
      $group: {
        _id: "$_id",
        pipelineName: { $first: "$pipelineName" },
        color: { $first: "$color" },
        stages: { $push: "$stages" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //     pipelineName: 1,
    //     color: 1,
    //     stages: 1,
    //     createdAt: 1,
    //     updatedAt: 1,
    //   },
    // },
  ]);

  if (!pipeline) {
    throw new ApiError(404, "No pipeline found with the provided ID.");
  }

  const pipelineData = pipeline[0];

  // console.log(JSON.stringify(pipelineData, null, 2));

  return res
    .status(200)
    .json(new ApiResponse(200, pipelineData, "Pipeline fetched successfully."));
});

const updatePipelineDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { pipelineName, stages } = req.body;

  try {
    const updatedPipeline = await Pipeline.findByIdAndUpdate(
      id,
      {
        $set: {
          pipelineName,
          stages,
        },
      },
      { new: true }
    );

    if (!updatedPipeline) {
      throw new ApiError(404, "Pipeline not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPipeline, "Pipeline updated Successfully.")
      );
  } catch (error) {
    throw new ApiError(404, "Something went wrong while updating pipeline.");
  }
});

const deletePipeline = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Pipeline.findByIdAndDelete(id);

    const pipelineIsRegistered = await Pipeline.findById(id);

    if (pipelineIsRegistered) {
      throw new ApiError(
        400,
        "Error occurred while trying to delete pipeline."
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Pipeline deleted Successfully."));
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while trying to delete pipeline.",
      error
    );
  }
});

export {
  createPipeline,
  getAllPipelines,
  getPipelineById,
  updatePipelineDetails,
  deletePipeline,
};
