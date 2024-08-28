import { Lead } from "../models/lead.model.js";
import { PipelineStage } from "../models/pipelineStage.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPipelineStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stageName } = req.body;

  // console.log("New Stage data: ", stageName, req.params);

  if (!stageName || !id) {
    throw new ApiError(400, "Stage fullName or Pipeline Id is missing.");
  }

  const pipelineStage = await PipelineStage.create({
    stageName,
    pipeline: id,
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

const getPipelineStagesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stages = await PipelineStage.find({ pipeline: id })
    .populate({
      path: "leads",
      populate: {
        path: "profile",
        select: "fullName email phone avatar",
      },
    })
    .populate("pipeline");

  // console.log("Pipeline Id: ", id);
  // console.log("Pipeline Stages: ", stages);

  return res
    .status(200)
    .json(
      new ApiResponse(200, stages, "Pipeline stages fetched successfully.")
    );
});

const updatePipelineStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stageName, pipelineId } = req.body;

  const updatedStage = await PipelineStage.findByIdAndUpdate(
    id,
    { $set: { stageName, pipelineId } },
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
  const { leadId, fullName, email, phone, pipelineStageId } = req.body;

  if (!leadId && !email) {
    throw new ApiError(
      400,
      "Either lead ID or lead data (fullName, email, phone) is required."
    );
  }

  if (!pipelineStageId) {
    throw new ApiError(400, "Pipeline stage ID is required.");
  }

  let lead;

  // Create a new lead and add it to the pipeline stage
  if (!leadId && email) {
    const leadUser = await User.create({
      fullName,
      email,
      phone,
      password: email,
    });

    const newLead = await Lead.create({ profile: leadUser._id });

    lead = await Lead.findById(newLead._id).populate(
      "profile",
      "name email phone avatar"
    );

    if (!lead) {
      throw new ApiError(
        500,
        "Error while creating a new lead for the pipeline stage."
      );
    }
  }

  //  Use an existing lead
  if (leadId) {
    lead = await Lead.findById(leadId).populate(
      "profile",
      "fullName email phone avatar"
    );

    if (!lead) {
      throw new ApiError(404, "Lead not found.");
    }
  }

  // Add the lead's ID to the pipeline stage's leads array
  const updatedPipelineStage = await PipelineStage.findByIdAndUpdate(
    pipelineStageId,
    { $addToSet: { leads: lead._id } },
    { new: true }
  );

  if (!updatedPipelineStage) {
    throw new ApiError(500, "Error while adding lead to the pipeline stage.");
  }
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
    const stage = await PipelineStage.findById(pipelineStageId);
    if (!stage) {
      return res.status(404).json({ error: "Pipeline stage not found" });
    }

    stage.leads = stage.leads.filter((lead) => lead.toString() !== leadId);

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
  const { leadId, sourceStageId, destinationStageId } = req.body;

  if (!leadId || !sourceStageId || !destinationStageId) {
    throw new ApiError(
      400,
      "Lead ID, source stage ID, and destination stage ID are required."
    );
  }

  try {
    const sourceStage = await PipelineStage.findByIdAndUpdate(
      sourceStageId,
      { $pull: { leads: leadId } },
      { new: true }
    );

    if (!sourceStage) {
      throw new ApiError(404, "Source stage not found.");
    }

    const destinationStage = await PipelineStage.findByIdAndUpdate(
      destinationStageId,
      { $push: { leads: leadId } },
      { new: true }
    );

    if (!destinationStage) {
      throw new ApiError(404, "Destination stage not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { sourceStage, destinationStage },
          "Lead moved successfully."
        )
      );
  } catch (error) {
    throw error;
  }
});

export {
  createPipelineStage,
  getPipelineStagesById,
  updatePipelineStage,
  deletePipelineStage,
  addLeadToPipelineStage,
  removeLeadFromStage,
  deleteLeadCompletely,
  moveLead,
};
