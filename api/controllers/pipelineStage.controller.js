import { PipelineStage } from "../models/pipelineStage.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPipelineStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stageName, stageOrder, color, pipelineId } = req.body;

  if (!stageName || stageOrder === undefined || !pipelineId) {
    throw new ApiError(400, "Stage name, Order and Pipeline Id are required.");
  }

  const pipelineStage = await PipelineStage.create({
    stageName,
    stageOrder,
    color,
    pipeline: pipelineId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        pipelineStage,
        "Pipeline stage created successfully."
      )
    );
});

const getAllPipelineStages = asyncHandler(async (req, res) => {
  const stages = await PipelineStage.find().sort({ stageOrder: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, stages, "Pipeline stages fetched successfully.")
    );
});

const getPipelineStageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stage = await PipelineStage.findById(id);

  if (!stage) {
    throw new ApiError(404, "Pipeline stage not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stage, "Pipeline stage fetched successfully."));
});

const updatePipelineStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stageName, stageOrder, color, pipelineId } = req.body;

  const updatedStage = await PipelineStage.findByIdAndUpdate(
    id,
    { $set: { stageName, stageOrder, color, pipelineId } },
    { new: true }
  );

  if (!updatedStage) {
    throw new ApiError(404, "Pipeline stage not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedStage, "Pipeline stage updated successfully.")
    );
});

const deletePipelineStage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedStage = await PipelineStage.findByIdAndDelete(id);

  if (!deletedStage) {
    throw new ApiError(404, "Pipeline stage not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Pipeline stage deleted successfully."));
});

export {
  createPipelineStage,
  getAllPipelineStages,
  getPipelineStageById,
  updatePipelineStage,
  deletePipelineStage,
};
