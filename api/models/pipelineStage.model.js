import mongoose, { Schema } from "mongoose";

const pipelineStageSchema = new Schema({
  stageName: {
    type: String,
    required: true,
  },
  stageOrder: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: "#FFFFFF",
  },
  pipeline: {
    type: Schema.Types.ObjectId,
    ref: "Pipeline",
    required: true,
  },
});

export const PipelineStage = mongoose.model(
  "PipelineStage",
  pipelineStageSchema
);
