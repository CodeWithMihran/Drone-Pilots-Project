"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "pilot_certifications");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "File upload failed");

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

      setSuccess("Certification submitted for compliance verification!");
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
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              CREDENTIALS & COMPLIANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Part 107 & Remote Pilot Licenses
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Manage your commercial remote pilot license, authority flight waivers, and COI insurance verifications to unlock client shoots.
          </p>
        </div>

        <Button
          id="open-upload-cert-modal-btn"
          onClick={() => {
            setError("");
            setUploadModalOpen(true);
          }}
          className="h-10 px-6 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs gap-2 shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Credential</span>
        </Button>
      </div>

      {success && (
        <Alert variant="success" className="rounded-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{success}</span>
          </div>
        </Alert>
      )}

      {/* Verification Status Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs transition-all duration-200 ${
        hasVerifiedCert 
          ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20" 
          : "border-[#fabf28]/35 bg-[#fabf28]/10"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
              hasVerifiedCert ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-[#fabf28]/20 text-[#fabf28]"
            }`}>
              {hasVerifiedCert ? <ShieldCheck className="w-6 h-6 stroke-[2]" /> : <AlertTriangle className="w-6 h-6 stroke-[2]" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {hasVerifiedCert ? "FAA Part 107 Verified Operator" : "Credential Verification Pending"}
                </h3>
                <Badge variant={hasVerifiedCert ? "success" : "warning"} className="rounded-full">
                  {hasVerifiedCert ? "Verified & Active" : "Action Needed"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                {hasVerifiedCert
                  ? "Your commercial remote pilot license is authenticated against aviation registries. You have full clearance to accept client bookings."
                  : "Upload your Part 107 license (or national aviation equivalent) to unlock bidding on compliance-restricted commercial missions."}
              </p>
            </div>
          </div>

          {!hasVerifiedCert && (
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="rounded-full px-6 h-10 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0 active:scale-[0.98]"
            >
              Upload License Now
            </Button>
          )}
        </div>
      </div>

      {/* Certifications Record List */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs space-y-6 p-6 sm:p-8">
        <div className="pb-4 border-b border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              CREDENTIALS ON RECORD ({certifications.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Historical submissions reviewed by platform compliance officers.
            </p>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse border border-border/60 dark:border-zinc-800" />
              ))}
            </div>
          ) : certifications.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No credentials on record"
              description="Upload your FAA Part 107 or national commercial remote pilot license to receive verified operator credentials."
              actionText="Upload Certificate Now"
              onAction={() => setUploadModalOpen(true)}
            />
          ) : (
            <div className="space-y-3.5">
              {certifications.map((cert) => (
                <div
                  key={cert._id}
                  className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800 space-y-3 transition-all hover:border-zinc-400 dark:hover:border-zinc-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h4 className="text-sm sm:text-base font-bold text-foreground">{cert.type}</h4>
                        <StatusBadge status={cert.status} type="certification" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        License ID: <strong className="text-foreground font-mono font-bold">{cert.number}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Issued: {formatDate(cert.issueDate)} • Expiry: {formatDate(cert.expiryDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {cert.documentUrl && (
                        <Button asChild variant="secondary" size="sm" className="rounded-full px-4 h-9 gap-1.5 active:scale-[0.98] border border-border dark:border-zinc-800 text-xs font-semibold">
                          <a
                            href={cert.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Document</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {cert.status === "REJECTED" && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Compliance Feedback:</span>
                        <span>{cert.rejectionReason || "Uploaded license failed validation against official aviation registry records."}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Certificate Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-zinc-800">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#fabf28]" />
                Submit Commercial Pilot License
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {error && (
              <Alert variant="error" className="rounded-2xl">
                <span>{error}</span>
              </Alert>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <Field label="Certification Authority & License Type" htmlFor="cert-type-select">
                <select
                  id="cert-type-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-[#fabf28]"
                >
                  <option value="FAA Part 107 Commercial Remote Pilot">FAA Part 107 Commercial Remote Pilot (USA)</option>
                  <option value="DGCA Remote Pilot License (RPL)">DGCA Remote Pilot License (RPL - India)</option>
                  <option value="EASA Open / Specific Category Drone Certificate">EASA Open / Specific Category (EU)</option>
                  <option value="Transport Canada Advanced Drone Pilot Certificate">Transport Canada Advanced Pilot (Canada)</option>
                  <option value="ITC Infrared Thermography Level 1">ITC Infrared Thermography Level 1</option>
                  <option value="Pix4D / DroneDeploy Certified Photogrammetrist">Pix4D / DroneDeploy Certified Photogrammetrist</option>
                  <option value="Other National Aviation Commercial License">Other National Commercial License</option>
                </select>
              </Field>

              <Field label="License / Registration Number" htmlFor="cert-number-input">
                <Input
                  id="cert-number-input"
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. 4829104-FAA or RPL-2024-883"
                  className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Issue Date" htmlFor="cert-issue-date-input">
                  <Input
                    id="cert-issue-date-input"
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                  />
                </Field>

                <Field label="Expiry Date" htmlFor="cert-expiry-date-input">
                  <Input
                    id="cert-expiry-date-input"
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                  />
                </Field>
              </div>

              <Field label="Official Certificate Document (PDF or Photo)" htmlFor="cert-file-input">
                <input
                  id="cert-file-input"
                  type="file"
                  required
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#fabf28] file:text-zinc-950 hover:file:bg-[#e6ae22] cursor-pointer"
                />
              </Field>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/80 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-full px-5 h-10 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="rounded-full px-6 h-10 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs"
                >
                  {uploading ? "Uploading Document..." : "Submit for Verification"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
