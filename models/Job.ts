import mongoose, { Schema, Document, Model } from "mongoose";

export type ServiceType =
  | "AGRICULTURAL_SPRAYING"
  | "REAL_ESTATE_MAPPING"
  | "AERIAL_PHOTOGRAPHY"
  | "INFRASTRUCTURE_INSPECTION"
  | "CONSTRUCTION_MONITORING"
  | "LAND_SURVEYING"
  | "OTHER";

export type JobStatus =
  | "DRAFT"
  | "OPEN"
  | "APPLICATIONS_RECEIVED"
  | "PILOT_SELECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IJobLocation {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId; // User ID of company
  title: string;
  serviceType: ServiceType;
  description: string;
  location: IJobLocation;
  date: Date;
  startTime: string;
  duration: string;
  budget: number;
  requiredCertification: string;
  requiredExperience: number; // in years
  requiredEquipment: string[];
  requirements: string[];
  applicationDeadline: Date;
  status: JobStatus;
  assignedPilotId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobLocationSchema = new Schema<IJobLocation>(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "United States" },
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String, default: "" },
  },
  { _id: false }
);

const JobSchema = new Schema<IJob>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    serviceType: {
      type: String,
      enum: [
        "AGRICULTURAL_SPRAYING",
        "REAL_ESTATE_MAPPING",
        "AERIAL_PHOTOGRAPHY",
        "INFRASTRUCTURE_INSPECTION",
        "CONSTRUCTION_MONITORING",
        "LAND_SURVEYING",
        "OTHER",
      ],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, default: "09:00 AM" },
    duration: { type: String, default: "1 Day" },
    budget: { type: Number, required: true, min: 0, index: true },
    requiredCertification: {
      type: String,
      default: "FAA Part 107 Commercial Remote Pilot",
    },
    requiredExperience: { type: Number, default: 1, min: 0 },
    requiredEquipment: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    applicationDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "OPEN",
        "APPLICATIONS_RECEIVED",
        "PILOT_SELECTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "OPEN",
      index: true,
    },
    assignedPilotId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance search and matching queries
JobSchema.index({ title: "text", description: "text" });
JobSchema.index({ "location.city": 1, serviceType: 1, status: 1 });

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
