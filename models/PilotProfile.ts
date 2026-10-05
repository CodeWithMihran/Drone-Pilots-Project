import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPilotProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  experience: number; // in years
  skills: string[];
  specializations: string[];
  equipment: string[];
  availability: "AVAILABLE" | "BUSY" | "UNAVAILABLE";
  serviceAreas: string[];
  rate: number; // USD/hr or USD/day
  rating: number;
  totalReviews: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PilotProfileSchema = new Schema<IPilotProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    experience: { type: Number, default: 1, min: 0 },
    skills: { type: [String], default: [] },
    specializations: { type: [String], default: [] },
    equipment: { type: [String], default: [] },
    availability: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "UNAVAILABLE"],
      default: "AVAILABLE",
    },
    serviceAreas: { type: [String], default: [] },
    rate: { type: Number, default: 50, min: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    bio: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const PilotProfile: Model<IPilotProfile> =
  mongoose.models.PilotProfile ||
  mongoose.model<IPilotProfile>("PilotProfile", PilotProfileSchema);

export default PilotProfile;
