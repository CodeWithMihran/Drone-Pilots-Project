import mongoose, { Schema, Document, Model } from "mongoose";

export type CertificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";

export interface ICertification extends Document {
  _id: mongoose.Types.ObjectId;
  pilotId: mongoose.Types.ObjectId; // User ID of pilot
  type: string;
  number: string;
  issueDate: Date;
  expiryDate: Date;
  documentUrl: string;
  documentPublicId?: string;
  status: CertificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    pilotId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      default: "FAA Part 107 Commercial Remote Pilot",
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    documentPublicId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED", "EXPIRED"],
      default: "PENDING",
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Certification: Model<ICertification> =
  mongoose.models.Certification ||
  mongoose.model<ICertification>("Certification", CertificationSchema);

export default Certification;
