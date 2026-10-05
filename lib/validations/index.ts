import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PILOT", "COMPANY"], {
    errorMap: () => ({ message: "Role must be either PILOT or COMPANY" }),
  }),
  phone: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("United States"),
  companyName: z.string().optional(),
  industry: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const PilotProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("United States"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  skills: z.array(z.string()).default([]),
  specializations: z.array(z.string()).default([]),
  equipment: z.array(z.string()).default([]),
  availability: z.enum(["AVAILABLE", "BUSY", "UNAVAILABLE"]).default("AVAILABLE"),
  serviceAreas: z.array(z.string()).default([]),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

export const CompanyProfileSchema = z.object({
  name: z.string().min(2, "User name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("United States"),
  logo: z.string().optional(),
});

export const CertificationUploadSchema = z.object({
  type: z.string().min(2, "Certification type is required"),
  number: z.string().min(2, "Certification number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  documentUrl: z.string().min(1, "Certificate document is required"),
});

export const JobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  serviceType: z.enum([
    "AGRICULTURAL_SPRAYING",
    "REAL_ESTATE_MAPPING",
    "AERIAL_PHOTOGRAPHY",
    "INFRASTRUCTURE_INSPECTION",
    "CONSTRUCTION_MONITORING",
    "LAND_SURVEYING",
    "OTHER",
  ]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("United States"),
  address: z.string().optional(),
  date: z.string().min(1, "Job date is required"),
  startTime: z.string().default("09:00 AM"),
  duration: z.string().default("1 Day"),
  budget: z.coerce.number().min(1, "Budget must be greater than 0"),
  requiredCertification: z.string().default("FAA Part 107 Commercial Remote Pilot"),
  requiredExperience: z.coerce.number().min(0).default(1),
  requiredEquipment: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
});

export const ApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  proposal: z.string().min(10, "Proposal must be at least 10 characters"),
  bidAmount: z.coerce.number().min(1, "Bid amount must be greater than 0"),
  availability: z.string().min(2, "Availability statement is required"),
});

export const ApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"]),
  notes: z.string().optional(),
});

export const ReviewSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  revieweeId: z.string().min(1, "Reviewee ID is required"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
});

export const PaymentSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  amount: z.coerce.number().min(1, "Payment amount must be greater than 0"),
  notes: z.string().optional(),
});

export const AdminUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export const CertificationVerifySchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});
