import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
  | "CERTIFICATION"
  | "APPLICATION"
  | "JOB"
  | "PAYMENT"
  | "REVIEW"
  | "SYSTEM";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["CERTIFICATION", "APPLICATION", "JOB", "PAYMENT", "REVIEW", "SYSTEM"],
      default: "SYSTEM",
      index: true,
    },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
