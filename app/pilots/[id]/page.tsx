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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-muted-foreground">Retrieving verified pilot flight record...</p>
      </div>
    );
  }

  if (!pilot) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Pilot record not found</h2>
        <p className="text-xs text-muted-foreground">This operator profile is inactive or unavailable.</p>
        <Button asChild variant="secondary" size="sm">
          <Link href="/pilots">Return to pilot roster</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/pilots" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Pilot Roster
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{pilot.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-control bg-primary/15 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                      {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                        {pilot.name}
                      </h1>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-subtle" />
                        {pilot.location?.city || "Station Base"}, {pilot.location?.state}
                      </p>
                    </div>
                  </div>

                  <div>
                    {pilot.isVerified ? (
                      <Badge variant="success" className="gap-1.5 py-1 px-3">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>FAA Part 107 Verified</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="py-1 px-3">
                        Standard Account
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 py-3.5 border-y border-border text-xs">
                  <StarRating rating={pilot.profile?.rating || 5.0} totalReviews={pilot.profile?.totalReviews || 0} />
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{pilot.profile?.experience || 2}+ Years In Flight</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>{pilot.completedJobsCount || 0} Missions Completed</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Professional Brief & Capabilities
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {pilot.profile?.bio || "Experienced commercial remote pilot specializing in precision photogrammetry, thermal inspection, and automated flight services."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Certifications Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  Validated Credentials & Aviation Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {pilot.certifications && pilot.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {pilot.certifications.map((cert: any) => (
                      <div
                        key={cert._id}
                        className="p-4 rounded-control bg-surface-2 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-foreground">{cert.type}</h4>
                            <StatusBadge status={cert.status} type="certification" />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Certificate ID: <strong className="text-foreground font-mono">{cert.number}</strong>
                          </p>
                          <p className="text-[11px] text-subtle">
                            Validity: {formatDate(cert.issueDate)} – {formatDate(cert.expiryDate)}
                          </p>
                        </div>

                        {cert.documentUrl && (
                          <Button asChild variant="secondary" size="sm">
                            <a
                              href={cert.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs"
                            >
                              Verify Document
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No public certificates recorded on file.</p>
                )}
              </CardContent>
            </Card>

            {/* Hardware Fleet */}
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Plane className="w-4 h-4 text-primary" />
                  Airframe Fleet & Sensor Payloads
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {(pilot.profile?.equipment || ["DJI Matrice 350 RTK", "DJI Mavic 3 Enterprise", "Zenmuse H20T Thermal"]).map(
                    (eq: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-control bg-surface-2 border border-border text-xs font-medium text-foreground"
                      >
                        {eq}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client Reviews Section */}
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  Verified Mission Reviews ({pilot.reviews?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {pilot.reviews && pilot.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {pilot.reviews.map((rev: any) => (
                      <div
                        key={rev._id}
                        className="p-4 rounded-control bg-surface-2 border border-border space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-surface border border-border text-foreground font-bold text-[11px] flex items-center justify-center">
                              {rev.reviewerId?.name ? rev.reviewerId.name.charAt(0) : "C"}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                {rev.reviewerId?.name || "Industrial Client"}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {rev.jobId?.title || "Flight Operation"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <StarRating rating={rev.rating} size="sm" />
                            <span className="text-[10px] text-subtle block">{formatDate(rev.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No client reviews recorded yet. Ratings are recorded upon completed mission acceptance.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Rail */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Standard Deployment Rate
                  </span>
                  <div className="text-2xl font-bold text-foreground mt-1 font-mono">
                    ${pilot.profile?.rate || 85}
                    <span className="text-xs font-normal text-muted-foreground"> / hour</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs py-3 border-y border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deployment Status:</span>
                    <span className="text-success font-semibold">
                      {pilot.profile?.availability || "AVAILABLE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Station Base:</span>
                    <span className="text-foreground font-medium">{pilot.location?.city}, {pilot.location?.state}</span>
                  </div>
                </div>

                <Button asChild block variant="primary">
                  <Link href="/company/post-job">Post Mission to Hire Pilot</Link>
                </Button>
              </CardContent>
            </Card>

            <LocationMapFallback
              location={pilot.location}
              title={`Operating Radius: ${pilot.location?.city || "Station Base"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
