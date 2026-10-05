import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanyProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  contactPerson: string;
  logo?: string;
  industry: string;
  website?: string;
  description?: string;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyProfileSchema = new Schema<ICompanyProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: "" },
    logo: { type: String, default: "" },
    industry: { type: String, default: "Commercial Services" },
    website: { type: String, default: "" },
    description: { type: String, default: "" },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const CompanyProfile: Model<ICompanyProfile> =
  mongoose.models.CompanyProfile ||
  mongoose.model<ICompanyProfile>("CompanyProfile", CompanyProfileSchema);

export default CompanyProfile;
