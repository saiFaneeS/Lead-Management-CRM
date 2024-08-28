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
  const { fullName, email, phone, password, assignedTo } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Email and name are required.");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists.");
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password: password || email,
    avatar: "",
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering lead user."
    );
  }

  const createdLead = await Lead.create({
    profile: user._id,
    assignedTo: assignedTo && assignedTo,
  });

  // await notifyLeadAssigned(assignedTo, fullName);

  if (assignedTo) {
    const assignedToUserData = await User.findById(assignedTo);

    createdLead.assignedTo = assignedToUserData;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        lead: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          password: user.password,
          assignedTo: createdLead.assignedTo,
        },
      },
      "Lead registered Successfully."
    )
  );
});

const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find()
    .populate("profile", "fullName email phone avatar role")
    .populate("assignedTo")
    .select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, leads, "All leads fetched Successfully."));
});

const getLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id)
    .populate("profile")
    .populate("assignedTo");

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

  // if (statusChanged) {
  //   await notifyLeadStatusChanged(
  //     updatedLead.assignedTo,
  //     updatedLead.name,
  //     updatedLead.status
  //   );
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLead, "Lead details updated successfully.")
    );
});

const deleteLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);

  await User.findByIdAndDelete(lead.user);

  const deletedLead = await Lead.findByIdAndDelete(id);

  if (!deletedLead) {
    throw new ApiError(404, "No lead found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Lead deleted Successfully."));
});

const deleteManyLeads = asyncHandler(async (req, res) => {
  const { leadIds } = req.body;
  // console.log("Delete lead ids: ", leadIds);

  if (!leadIds || !Array.isArray(leadIds)) {
    throw new ApiError(400, "leadIds must be an array of valid lead IDs.");
  }

  try {
    const result = await Lead.deleteMany({ _id: { $in: leadIds } });

    if (result.deletedCount === 0) {
      throw new ApiError(404, "No leads found to delete.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${result.deletedCount} leads deleted successfully.`
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting leads.");
  }
});

export {
  registerLead,
  getAllLeads,
  getLeadById,
  updateLeadDetails,
  deleteLeadById,
  deleteManyLeads,
};
