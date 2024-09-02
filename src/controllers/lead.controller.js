import asyncHandler from "../utils/asyncHandler.js";
import { Lead } from "../models/lead.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerLead = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, assignedTo, status } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Email and name are required.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User with this email already exists.");
  }

  const user = new User({
    fullName,
    email,
    phone,
    password: password || email,
    avatar: "",
  });

  const session = await User.startSession();
  session.startTransaction();

  try {
    await user.save({ session });

    const lead = new Lead({
      profile: user._id,
      assignedTo,
      status: status || "New",
    });

    await lead.save({ session });

    await session.commitTransaction();
    session.endSession();

    const responseData = {
      lead: {
        fullName,
        email,
        phone,
        assignedTo: lead.assignedTo,
        status: lead.status,
        _id: lead._id,
        userId: user._id,
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Lead registered successfully.")
      );
  } catch (error) {
    console.error("Error during lead registration", error);

    await session.abortTransaction();
    session.endSession();

    if (user._id) {
      await User.findByIdAndDelete(user._id);
      console.log("Step 6: Rolled back user creation");
    }

    throw new ApiError(500, "An error occurred while registering the lead.");
  }
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
  const { fullName, email, phone, status, assignedTo, userId } = req.body;
  console.log(fullName, email, phone, status, assignedTo, userId);
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError(404, "Lead not found.");
  }

  const statusChanged = lead.status !== status;

  const updatedLead = await Lead.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
        assignedTo,
      },
    },
    { new: true }
  );

  const updatedProfile = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName,
        email,
        phone,
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

  const deletedUser = await User.findByIdAndDelete(lead.profile);

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

  console.log("leadIds: ", leadIds);

  if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
    throw new ApiError(
      400,
      "leadIds must be a non-empty array of valid lead IDs."
    );
  }

  const session = await Lead.startSession();
  session.startTransaction();

  try {
    const leadsToDelete = await Lead.find(
      { _id: { $in: leadIds } },
      "profile",
      {
        session,
      }
    );

    const userIdsToDelete = [
      ...new Set(leadsToDelete.map((lead) => lead.profile.toString())),
    ];

    // Delete leads
    const leadDeleteResult = await Lead.deleteMany(
      { _id: { $in: leadIds } },
      { session }
    );

    if (leadDeleteResult.deletedCount === 0) {
      throw new ApiError(404, "No leads found to delete.");
    }

    const remainingLeads = await Lead.find(
      { profile: { $in: userIdsToDelete } },
      null,
      { session }
    );

    const usersToDelete = userIdsToDelete.filter(
      (userId) =>
        !remainingLeads.some((lead) => lead.profile.toString() === userId)
    );

    let userDeleteResult = { deletedCount: 0 };
    if (usersToDelete.length > 0) {
      userDeleteResult = await User.deleteMany(
        { _id: { $in: usersToDelete } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${leadDeleteResult.deletedCount} leads and ${userDeleteResult.deletedCount} associated users deleted successfully.`
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting leads and users:", error);
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
