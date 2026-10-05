import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "PILOT" | "COMPANY" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface IUserLocation {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone: string;
  profileImage?: string;
  location: IUserLocation;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserLocationSchema = new Schema<IUserLocation>(
  {
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "United States" },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["PILOT", "COMPANY", "ADMIN"],
      required: true,
      index: true,
    },
    phone: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    location: { type: UserLocationSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model in Next.js hot reload
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
