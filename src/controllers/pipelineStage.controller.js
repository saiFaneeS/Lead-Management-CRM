import { Lead } from "../models/lead.model.js";
import { Pipeline } from "../models/pipeline.model.js";
import { PipelineStage } from "../models/pipelineStage.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPipelineStage = asyncHandler(async (req, res) => {
  const { stageName, stageOrder, pipelineId } = req.body;

  console.log("New Stage data: ", stageName, stageOrder, pipelineId);

  if (!stageName || !pipelineId) {
    throw new ApiError(400, "Stage name or Pipeline Id is missing.");
  }

  const pipelineStage = await PipelineStage.create({
    stageName,
    stageOrder,
    pipeline: pipelineId,
  });

  return res
    .status(200)
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

const getPipelineStagesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stages = await Pipeline.findById(id);

  console.log("StageId", id);
  if (!stages) {
    throw new ApiError(404, "Pipeline stage not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stages, "Pipeline stage fetched successfully."));
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

const addLeadToPipelineStage = asyncHandler(async (req, res) => {
  const { leadId, name, email, phone, pipelineStageId } = req.body;

  if (!leadId && !email) {
    throw new ApiError(
      400,
      "Either lead ID or lead data (name, email, phone) is required."
    );
  }

  if (!pipelineStageId) {
    throw new ApiError(400, "Pipeline stage ID is required.");
  }

  let lead;

  // Option 1: Create a new lead and add it to the pipeline stage
  if (!leadId && email) {
    lead = await Lead.create({ name, email, phone });

    if (!lead) {
      throw new ApiError(
        500,
        "Error while creating a new lead for the pipeline stage."
      );
    }
  }

  // Option 2: Use an existing lead
  if (leadId) {
    lead = await Lead.findById(leadId);

    if (!lead) {
      throw new ApiError(404, "Lead not found.");
    }
  }

  // Add the lead's ID to the pipeline stage's leads array
  const updatedPipelineStage = await PipelineStage.findByIdAndUpdate(
    pipelineStageId,
    { $addToSet: { leads: lead._id } }, // Ensure the lead isn't added multiple times
    { new: true } // Return the updated document
  );

  if (!updatedPipelineStage) {
    throw new ApiError(500, "Error while adding lead to the pipeline stage.");
  }
  console.log();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lead,
        "Lead successfully added to the pipeline stage."
      )
    );
});

export {
  createPipelineStage,
  getAllPipelineStages,
  getPipelineStagesById,
  updatePipelineStage,
  deletePipelineStage,
  addLeadToPipelineStage,
};
