import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";

const createNote = asyncHandler(async (req, res) => {
  const { content, leadId } = req.body;

  if (!content || !leadId) {
    throw new ApiError(400, "Content and lead are required.");
  }

  try {
    const note = await Note.create({
      content,
      lead: leadId,
      createdBy: req.user?._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, note, "Note created successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while creating the note.",
      error
    );
  }
});

const getNotesByLead = asyncHandler(async (req, res) => {
  const { leadId } = req.params;

  const notes = await Note.find({ lead: leadId });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully."));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched successfully."));
});

const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { content },
    { new: true }
  );

  if (!updatedNote) {
    throw new ApiError(404, "Note not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated successfully."));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedNote = await Note.findByIdAndDelete(id);

  if (!deletedNote) {
    throw new ApiError(404, "Note not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully."));
});

export { createNote, getNotesByLead, getNoteById, updateNote, deleteNote };
