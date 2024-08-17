import asyncHandler from "../utils/asyncHandler.js";
import { Lead } from "../models/lead.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  notifyLeadAssigned,
  notifyLeadStatusChanged,
} from "../utils/notifications/leadNotifications.js";
import { User } from "../models/user.model.js";

const registerLead = asyncHandler(async (req, res) => {
  const { name, email, phone, assignedTo } = req.body;

  if (!email && !phone) {
    throw new ApiError(400, "Either email or phone is required.");
  }

  const lead = await Lead.create({
    name,
    email,
    phone,
    assignedTo,
  });

  await notifyLeadAssigned(assignedTo, name);

  if (assignedTo) {
    const assignedToUserData = await User.findById(assignedTo);

    lead.assignedTo = assignedToUserData;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lead, "Lead registered Successfully."));
});

const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find().populate("assignedTo");

  return res
    .status(200)
    .json(new ApiResponse(200, leads, "All leads fetched Successfully."));
});

const getLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, "Lead not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lead, "Lead fetched Successfully."));
});

const updateLeadDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, status, assignedTo } = req.body;

  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, "Lead not found.");
  }

  const statusChanged = lead.status !== status;

  const updatedLead = await Lead.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        email,
        phone,
        status,
        assignedTo,
      },
    },
    { new: true }
  );

  if (assignedTo) {
    const assignedToUserData = await User.findById(assignedTo);

    updatedLead.assignedTo = assignedToUserData;
  }

  if (!updatedLead) {
    throw new ApiError(404, "Lead not found.");
  }

  if (statusChanged) {
    await notifyLeadStatusChanged(
      updatedLead.assignedTo,
      updatedLead.name,
      updatedLead.status
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLead, "Lead details updated successfully.")
    );
});

const deleteLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedLead = await Lead.findByIdAndDelete(id);

  if (!deletedLead) {
    throw new ApiError(404, "No lead found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Lead deleted Successfully."));
});

export {
  registerLead,
  getAllLeads,
  getLeadById,
  updateLeadDetails,
  deleteLeadById,
};
