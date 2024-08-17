import mongoose, { Schema } from "mongoose";

const pipelineSchema = new Schema(
  {
    pipelineName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Pipeline = mongoose.model("Pipeline", pipelineSchema);
