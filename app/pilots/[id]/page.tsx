"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  User,
  MapPin,
  ShieldCheck,
  Star,
  Award,
  Clock,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  Mail,
  Phone,
  Plane,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LocationMapFallback } from "@/components/shared/LocationMapFallback";

export default function PilotProfileDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [pilot, setPilot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPilot = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/pilots/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPilot(data.pilot);
        }
      } catch (err) {
        console.error("Failed to load pilot:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPilot();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading pilot credentials & flight records...</p>
      </div>
    );
  }

  if (!pilot) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Pilot Not Found</h2>
        <p className="text-xs text-slate-400">This pilot profile is unavailable or inactive.</p>
        <Link href="/pilots" className="text-xs text-cyan-400 hover:underline">
          Return to Pilot Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#060b18] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/pilots" className="hover:text-cyan-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Pilots Directory
          </Link>
          <span>/</span>
          <span className="text-slate-200">{pilot.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-xl">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-cyan-300 text-2xl">
                      {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                      {pilot.name}
                    </h1>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {pilot.location?.city || "Available Regional"}, {pilot.location?.state}
                    </p>
                  </div>
                </div>

                <div>
                  {pilot.isVerified ? (
                    <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>✓ VERIFIED PILOT</span>
                    </div>
                  ) : (
                    <div className="px-3.5 py-1.5 rounded-full bg-slate-800 text-xs text-slate-400">
                      Standard Pilot
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-800/80 text-xs">
                <StarRating rating={pilot.profile?.rating || 5.0} totalReviews={pilot.profile?.totalReviews || 0} />
                <div className="flex items-center gap-1 text-slate-300">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>{pilot.profile?.experience || 1}+ Years Experience</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Briefcase className="w-4 h-4 text-teal-400" />
                  <span>{pilot.completedJobsCount || 0} Missions Completed</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Pilot Biography & Operational Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {pilot.profile?.bio || "Experienced commercial drone pilot providing high-precision photogrammetry, thermal inspection, and automated flight services."}
                </p>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Aviation Credentials & Licenses
              </h3>

              {pilot.certifications && pilot.certifications.length > 0 ? (
                <div className="space-y-3">
                  {pilot.certifications.map((cert: any) => (
                    <div
                      key={cert._id}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{cert.type}</h4>
                          <StatusBadge status={cert.status} type="certification" />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          License Number: <strong className="text-slate-200">{cert.number}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Valid: {formatDate(cert.issueDate)} – {formatDate(cert.expiryDate)}
                        </p>
                      </div>

                      {cert.documentUrl && (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold"
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No public certificates uploaded yet.</p>
              )}
            </div>

            {/* Drone Fleet Equipment */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-400" />
                Aircraft Fleet & Sensor Payloads
              </h3>
              <div className="flex flex-wrap gap-2">
                {(pilot.profile?.equipment || ["DJI Matrice 300 RTK", "DJI Mavic 3 Enterprise", "Thermal FLIR H20T"]).map(
                  (eq: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-cyan-300"
                    >
                      {eq}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Verified Client Reviews ({pilot.reviews?.length || 0})
                </h3>
              </div>

              {pilot.reviews && pilot.reviews.length > 0 ? (
                <div className="space-y-4">
                  {pilot.reviews.map((rev: any) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/70 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                            {rev.reviewerId?.name ? rev.reviewerId.name.charAt(0) : "C"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {rev.reviewerId?.name || "Verified Client"}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Project: {rev.jobId?.title || "Industrial Mission"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={rev.rating} size="sm" />
                          <span className="text-[10px] text-slate-500">{formatDate(rev.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No client reviews yet. Reviews will appear here upon mission completions.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Contact & Hire Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e1836] to-[#0a1126] border border-cyan-500/30 shadow-2xl space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Standard Rate
                </span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  ${pilot.profile?.rate || 75}
                  <span className="text-sm font-normal text-slate-400"> / hour</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs py-3 border-y border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Availability:</span>
                  <span className="text-emerald-400 font-bold">
                    {pilot.profile?.availability || "AVAILABLE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Region:</span>
                  <span className="text-white font-medium">{pilot.location?.city}, {pilot.location?.state}</span>
                </div>
              </div>

              <Link
                href={`/company/post-job`}
                className="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-bold text-xs text-center shadow-lg shadow-cyan-500/20 transition"
              >
                Post Job to Hire Pilot
              </Link>
            </div>

            {/* Operating Location */}
            <LocationMapFallback
              location={pilot.location}
              title={`Pilot Base: ${pilot.location?.city || "Station"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
