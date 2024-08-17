import mongoose, { Schema } from "mongoose";

const pipelineStageSchema = new Schema({
  stageName: {
    type: String,
    required: true,
  },
  leads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lead",
    },
  ],
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
