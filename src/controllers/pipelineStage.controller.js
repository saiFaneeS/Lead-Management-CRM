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

const updatePipelineStageOrder = asyncHandler(async (req, res) => {
  const { stages } = req.body; // Array of stages with updated orders

  if (!stages || !Array.isArray(stages)) {
    throw new ApiError(400, "Invalid stages array.");
  }

  const bulkOps = stages.map((stage) => ({
    updateOne: {
      filter: { _id: stage._id },
      update: { stageOrder: stage.stageOrder },
    },
  }));

  // Execute all update operations in bulk
  await PipelineStage.bulkWrite(bulkOps);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Pipeline stages reordered successfully."));
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

const removeLeadFromStage = async (req, res) => {
  const { pipelineStageId, leadId } = req.body;

  try {
    // Find the stage by ID
    const stage = await PipelineStage.findById(pipelineStageId);
    if (!stage) {
      return res.status(404).json({ error: "Pipeline stage not found" });
    }

    // Remove the lead from the leads array
    stage.leads = stage.leads.filter((lead) => lead.toString() !== leadId);

    // Save the updated stage
    await stage.save();

    return res
      .status(200)
      .json({ message: "Lead removed from stage successfully" });
  } catch (error) {
    console.error("Error removing lead from stage:", error);
    return res.status(500).json({ error: "Failed to remove lead from stage" });
  }
};

const deleteLeadCompletely = async (req, res) => {
  const { leadId } = req.params;

  try {
    // Delete the lead from all pipeline stages
    await PipelineStage.updateMany(
      { leads: leadId },
      { $pull: { leads: leadId } }
    );

    // Delete the lead from the database
    await Lead.findByIdAndDelete(leadId);

    return res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return res.status(500).json({ error: "Failed to delete lead" });
  }
};

const moveLead = asyncHandler(async (req, res) => {
  const { leadId, sourceStageId, destinationStageId, destinationIndex } =
    req.body;

  if (!leadId || !sourceStageId || !destinationStageId) {
    throw new ApiError(
      400,
      "Lead ID, source stage ID, and destination stage ID are required."
    );
  }

  // Start a session for the transaction
  const session = await PipelineStage.startSession();
  session.startTransaction();

  try {
    // Remove the lead from the source stage
    const sourceStage = await PipelineStage.findByIdAndUpdate(
      sourceStageId,
      { $pull: { leads: leadId } },
      { session, new: true }
    );

    if (!sourceStage) {
      throw new ApiError(404, "Source stage not found.");
    }

    // Add the lead to the destination stage at the specified index
    const destinationStage = await PipelineStage.findById(
      destinationStageId
    ).session(session);

    if (!destinationStage) {
      throw new ApiError(404, "Destination stage not found.");
    }

    destinationStage.leads.splice(destinationIndex, 0, leadId);
    await destinationStage.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          sourceStage,
          destinationStage,
        },
        "Lead moved successfully."
      )
    );
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export {
  createPipelineStage,
  getAllPipelineStages,
  getPipelineStagesById,
  updatePipelineStage,
  deletePipelineStage,
  addLeadToPipelineStage,
  removeLeadFromStage,
  deleteLeadCompletely,
  updatePipelineStageOrder,
  moveLead,
};
