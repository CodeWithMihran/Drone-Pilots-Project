"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  Plane,
  Layers,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CompanyPostJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState("INFRASTRUCTURE_INSPECTION");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [duration, setDuration] = useState("1 Day");
  const [budget, setBudget] = useState("");
  const [requiredCertification, setRequiredCertification] = useState(
    "FAA Part 107 Commercial Remote Pilot"
  );
  const [requiredExperience, setRequiredExperience] = useState(2);
  const [applicationDeadline, setApplicationDeadline] = useState("");

  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([
    "DJI Matrice 300 / 350 RTK",
    "Thermal FLIR Payload",
  ]);
  const [newEquipment, setNewEquipment] = useState("");

  const [requirements, setRequirements] = useState<string[]>([
    "Valid Part 107 Commercial License",
    "Pre-flight safety inspection log",
    "Geotagged raw imagery files deliverable within 48 hours",
  ]);
  const [newRequirement, setNewRequirement] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddEquipment = () => {
    if (newEquipment.trim() && !requiredEquipment.includes(newEquipment.trim())) {
      setRequiredEquipment([...requiredEquipment, newEquipment.trim()]);
      setNewEquipment("");
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setRequiredEquipment(requiredEquipment.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          serviceType,
          description,
          city,
          state,
          country: "United States",
          address,
          date,
          startTime,
          duration,
          budget: Number(budget),
          requiredCertification,
          requiredExperience: Number(requiredExperience),
          requiredEquipment,
          requirements,
          applicationDeadline,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      router.push(`/jobs/${data.job._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 sm:py-10 px-4">
      {/* Header */}
      <div>
        <h1 className="text-heading-1 font-bold text-foreground">Post New Drone Project</h1>
        <p className="text-caption text-muted-foreground mt-1">
          Publish industrial flight requirements to receive proposals from verified commercial pilots.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-panel bg-destructive/10 border border-destructive/30 text-destructive text-caption flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Overview Card */}
        <div className="p-6 sm:p-8 rounded-panel bg-card border border-border shadow-md space-y-5">
          <h3 className="text-label font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Project Scope & Classification
          </h3>

          <div>
            <label className="block text-label font-medium text-foreground mb-1.5">
              Project Title
            </label>
            <input
              id="job-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 500kW Solar Farm Infrared Thermal Inspection & Fault Analysis"
              className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Industry Sector
              </label>
              <select
                id="job-service-type-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary transition-colors"
              >
                <option value="AGRICULTURAL_SPRAYING">Agricultural Spraying & Multispectral</option>
                <option value="INFRASTRUCTURE_INSPECTION">Infrastructure & Thermal Inspection</option>
                <option value="REAL_ESTATE_MAPPING">Real Estate & 3D Mapping</option>
                <option value="CONSTRUCTION_MONITORING">Construction Monitoring & Volumetrics</option>
                <option value="LAND_SURVEYING">Land Surveying & Topographic LiDAR</option>
                <option value="AERIAL_PHOTOGRAPHY">Aerial Photography & Cinematography</option>
                <option value="OTHER">Other Industrial Drone Services</option>
              </select>
            </div>

            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Fixed Project Budget (USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                <input
                  id="job-budget-input"
                  type="number"
                  required
                  min="50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="2400"
                  className="w-full pl-10 pr-4 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-label font-medium text-foreground mb-1.5">
              Mission Description & Deliverable Specs
            </label>
            <textarea
              id="job-description-input"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide full flight mission details, acreage or structural dimensions, desired ground sampling distance (GSD), raw/orthomosaic deliverable formats, and site safety constraints..."
              className="w-full p-3 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Location & Scheduling */}
        <div className="p-6 sm:p-8 rounded-panel bg-card border border-border shadow-md space-y-5">
          <h3 className="text-label font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Location & Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                City / Location
              </label>
              <input
                id="job-city-input"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Phoenix"
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                State / Region
              </label>
              <input
                id="job-state-input"
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Arizona"
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-label font-medium text-foreground mb-1.5">
              Specific Flight Site Address or Landmarks
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Sector 4 Solar Array, Desert Ridge Field Office"
              className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Flight Operation Date
              </label>
              <input
                id="job-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="08:30 AM"
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Estimated Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="1 Day (approx 4 flight hours)"
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-label font-medium text-foreground mb-1.5">
              Proposal Submission Deadline
            </label>
            <input
              id="job-deadline-input"
              type="date"
              required
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Requirements & Hardware Payloads */}
        <div className="p-6 sm:p-8 rounded-panel bg-card border border-border shadow-md space-y-5">
          <h3 className="text-label font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            Pilot Certification & Equipment Prerequisites
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Required Aviation Certification
              </label>
              <select
                value={requiredCertification}
                onChange={(e) => setRequiredCertification(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary transition-colors"
              >
                <option value="FAA Part 107 Commercial Remote Pilot">
                  FAA Part 107 Commercial Remote Pilot
                </option>
                <option value="DGCA Remote Pilot License (RPL)">
                  DGCA Remote Pilot License (RPL)
                </option>
                <option value="EASA Open / Specific Category Drone Certificate">
                  EASA Open / Specific Category
                </option>
                <option value="ITC Infrared Thermography Level 1">
                  ITC Infrared Thermography Level 1
                </option>
                <option value="Any Verified Commercial Pilot License">
                  Any Verified Commercial Pilot License
                </option>
              </select>
            </div>

            <div>
              <label className="block text-label font-medium text-foreground mb-1.5">
                Minimum Commercial Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={requiredExperience}
                onChange={(e) => setRequiredExperience(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Equipment list builder */}
          <div>
            <label className="block text-label font-medium text-foreground mb-1.5">
              Required Drone Fleet / Payload Sensors
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddEquipment();
                  }
                }}
                placeholder="e.g. DJI Zenmuse L1 LiDAR or Agras T40"
                className="flex-1 px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={handleAddEquipment}
                className="px-4 py-2.5 rounded-control bg-surface-2 border border-border hover:bg-border/30 text-primary font-medium text-label flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {requiredEquipment.map((eq, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-control bg-surface-2 border border-border text-caption text-primary font-medium flex items-center gap-2"
                >
                  <span>{eq}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipment(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Protocols / Requirements builder */}
          <div>
            <label className="block text-label font-medium text-foreground mb-1.5">
              Specific Flight Protocols & Guidelines
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                placeholder="e.g. Pilot must maintain FAA airspace authorization"
                className="flex-1 px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-4 py-2.5 rounded-control bg-surface-2 border border-border hover:bg-border/30 text-primary font-medium text-label flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-control bg-surface-2 border border-border text-caption text-foreground flex items-center justify-between"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          id="submit-post-job-btn"
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-control bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-body shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          <span>{submitting ? "Publishing Project Tender..." : "Publish Drone Project"}</span>
        </button>
      </form>
    </div>
  );
}