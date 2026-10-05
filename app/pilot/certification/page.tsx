"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Eye,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PilotCertificationPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [type, setType] = useState("FAA Part 107 Commercial Remote Pilot");
  const [number, setNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/certifications");
      if (res.ok) {
        const data = await res.json();
        setCertifications(data.certifications || []);
      }
    } catch (err) {
      console.error("Failed to fetch certifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a certificate document file to upload.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      // 1. Upload file via /api/upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "pilot_certifications");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "File upload failed");

      // 2. Create certification record
      const certRes = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          number,
          issueDate,
          expiryDate,
          documentUrl: uploadData.url,
        }),
      });

      const certData = await certRes.json();
      if (!certRes.ok) throw new Error(certData.error || "Certification record failed");

      setSuccess("Certification submitted for admin verification!");
      setUploadModalOpen(false);
      setFile(null);
      setNumber("");
      setIssueDate("");
      setExpiryDate("");
      fetchCertifications();
    } catch (err: any) {
      setError(err.message || "Failed to upload certificate.");
    } finally {
      setUploading(false);
    }
  };

  const now = new Date();
  const hasVerifiedCert = certifications.some(
    (c) => c.status === "VERIFIED" && new Date(c.expiryDate) > now
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pilot Aviation Certifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload your commercial licenses to receive the ✓ VERIFIED PILOT badge and unlock industrial contracts.
          </p>
        </div>

        <button
          id="open-upload-cert-modal-btn"
          onClick={() => {
            setError("");
            setUploadModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Certificate</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Verification Status Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl ${
        hasVerifiedCert
          ? "bg-gradient-to-r from-emerald-950/40 via-[#0c142b] to-[#070e22] border-emerald-500/40"
          : "bg-gradient-to-r from-amber-950/40 via-[#0c142b] to-[#070e22] border-amber-500/40"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              hasVerifiedCert ? "bg-emerald-500 text-slate-950" : "bg-amber-500 text-slate-950"
            }`}>
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {hasVerifiedCert ? "✓ VERIFIED PILOT" : "Verification Pending / Required"}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {hasVerifiedCert
                  ? "Your commercial Part 107 credential is verified by administration and active."
                  : "Upload a valid commercial drone certificate to gain priority listing and apply to restricted jobs."}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {hasVerifiedCert ? (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                Status: ACTIVE
              </span>
            ) : (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Submit Credentials
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Certifications List */}
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Certification Credentials on Record ({certifications.length})
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : certifications.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No Certifications on File"
            description="You have not uploaded your FAA Part 107 or equivalent commercial pilot license yet."
            actionText="Upload Certificate Now"
            onAction={() => setUploadModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div
                key={cert._id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white">{cert.type}</h4>
                      <StatusBadge status={cert.status} type="certification" />
                    </div>
                    <p className="text-xs text-slate-400">
                      License / Certificate ID: <strong className="text-cyan-300">{cert.number}</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Issued: {formatDate(cert.issueDate)} • Expiry: {formatDate(cert.expiryDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {cert.documentUrl && (
                      <a
                        href={cert.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Rejection Feedback if rejected */}
                {cert.status === "REJECTED" && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Admin Verification Note:</span>
                      <span>{cert.rejectionReason || "Uploaded document was unreadable or failed license verification."}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Certificate Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c142b] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                Upload Commercial Drone Certificate
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Certification Authority / Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="FAA Part 107 Commercial Remote Pilot">FAA Part 107 Commercial Remote Pilot (USA)</option>
                  <option value="DGCA Remote Pilot License (RPL)">DGCA Remote Pilot License (RPL - India)</option>
                  <option value="EASA Open / Specific Category Drone Certificate">EASA Open / Specific Category (EU)</option>
                  <option value="Transport Canada Advanced Drone Pilot Certificate">Transport Canada Advanced Pilot (Canada)</option>
                  <option value="ITC Infrared Thermography Level 1">ITC Infrared Thermography Level 1</option>
                  <option value="Pix4D / DroneDeploy Certified Photogrammetrist">Pix4D / DroneDeploy Certified Photogrammetrist</option>
                  <option value="Other National Aviation Commercial License">Other National Commercial License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Certificate / License Number
                </label>
                <input
                  id="cert-number-input"
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. 4829104-FAA or RPL-2024-883"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    id="cert-issue-date-input"
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="cert-expiry-date-input"
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document File (PDF, PNG, JPG - max 10MB)
                </label>
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500 text-center bg-[#070e22] transition cursor-pointer relative">
                  <input
                    id="cert-file-input"
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <FileText className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                  {file ? (
                    <p className="text-xs font-bold text-cyan-400 truncate">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-xs text-slate-300 font-semibold">Click or drag file here to upload</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Scanned certificate or digital license card</p>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  id="submit-cert-upload-btn"
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  {uploading ? "Uploading & Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
