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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Aviation Certifications
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your commercial remote pilot licenses, authority credentials, and insurance verifications.
          </p>
        </div>

        <Button
          id="open-upload-cert-modal-btn"
          onClick={() => {
            setError("");
            setUploadModalOpen(true);
          }}
          variant="primary"
          size="sm"
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Credential</span>
        </Button>
      </div>

      {success && (
        <Alert variant="success">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>{success}</span>
          </div>
        </Alert>
      )}

      {/* Verification Status Card */}
      <Card className={hasVerifiedCert ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5"}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-control flex items-center justify-center shrink-0 ${
                hasVerifiedCert ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              }`}>
                {hasVerifiedCert ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {hasVerifiedCert ? "FAA Part 107 Verified Operator" : "Credential Verification Required"}
                  </h3>
                  <Badge variant={hasVerifiedCert ? "success" : "warning"}>
                    {hasVerifiedCert ? "Active" : "Action Needed"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                  {hasVerifiedCert
                    ? "Your commercial remote pilot license is authenticated against aviation registries. You have full clearance to bid on enterprise contracts."
                    : "Upload an official Part 107 license (or national aviation equivalent) to unlock bidding on compliance-restricted industrial missions."}
                </p>
              </div>
            </div>

            {!hasVerifiedCert && (
              <Button
                onClick={() => setUploadModalOpen(true)}
                variant="primary"
                size="sm"
                className="shrink-0"
              >
                Upload License Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certifications Record List */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Credentials on Record ({certifications.length})
          </CardTitle>
          <CardDescription>
            Historical submissions reviewed by platform compliance officers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-surface-2 rounded-control animate-pulse border border-border" />
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
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert._id}
                  className="p-4 rounded-control bg-surface-2 border border-border space-y-3 transition-colors hover:border-border-strong"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground">{cert.type}</h4>
                        <StatusBadge status={cert.status} type="certification" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        License ID: <strong className="text-foreground font-mono">{cert.number}</strong>
                      </p>
                      <p className="text-xs text-subtle mt-0.5">
                        Issued: {formatDate(cert.issueDate)} • Expiry: {formatDate(cert.expiryDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {cert.documentUrl && (
                        <Button asChild variant="secondary" size="sm">
                          <a
                            href={cert.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="gap-1.5 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Document</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {cert.status === "REJECTED" && (
                    <div className="p-3 rounded-control bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Compliance Officer Feedback:</span>
                        <span>{cert.rejectionReason || "Uploaded license failed validation against official aviation registry records."}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Certificate Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-panel bg-surface border border-border shadow-2xl p-6 space-y-5 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Submit Commercial Pilot License
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1 rounded-control hover:bg-surface-2"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {error && (
              <Alert variant="error">
                <span>{error}</span>
              </Alert>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <Field label="Certification Authority & License Type" htmlFor="cert-type-select">
                <select
                  id="cert-type-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
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

              <Field label="Certificate / License Registration Number" htmlFor="cert-number-input">
                <Input
                  id="cert-number-input"
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. 4829104-FAA or RPL-2024-883"
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
                  />
                </Field>

                <Field label="Expiry Date" htmlFor="cert-expiry-date-input">
                  <Input
                    id="cert-expiry-date-input"
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Document Upload (PDF, PNG, JPG - max 10MB)">
                <div className="p-4 rounded-control border-2 border-dashed border-border hover:border-primary text-center bg-surface-2 transition-colors cursor-pointer relative">
                  <input
                    id="cert-file-input"
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-1.5 opacity-60" />
                  {file ? (
                    <p className="text-xs font-semibold text-primary truncate">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-xs text-foreground font-medium">Click or drag license document to upload</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Scanned certificate or digital license card</p>
                    </>
                  )}
                </div>
              </Field>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  id="submit-cert-upload-btn"
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={uploading}
                >
                  {uploading ? "Submitting..." : "Submit for Verification"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
