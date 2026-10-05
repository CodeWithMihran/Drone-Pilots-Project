import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  pilotId: mongoose.Types.ObjectId; // User ID of pilot
  proposal: string;
  bidAmount: number;
  availability: string;
  matchScore: number;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    pilotId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    proposal: { type: String, required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    availability: { type: String, default: "Available immediately" },
    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"],
      default: "PENDING",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application from same pilot to same job
ApplicationSchema.index({ jobId: 1, pilotId: 1 }, { unique: true });

export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
