import mongoose, { Schema } from "mongoose";

const pipelineSchema = new Schema(
  {
    pipelineName: {
      type: String,
      required: true,
    },
    stages: [
      {
        type: Schema.Types.ObjectId,
        ref: "PipelineStage",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Pipeline = mongoose.model("Pipeline", pipelineSchema);
