import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  pilotId: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    pilotId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PAID",
      index: true,
    },
    transactionId: { type: String, required: true, unique: true },
    paymentMethod: { type: String, default: "Simulated Escrow Direct Deposit" },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
