"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  Building2,
  Camera,
  Layers,
  Trees,
  Construction,
  Award,
  ChevronDown,
  Check,
  Radio,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sectors = [
    {
      id: "AGRICULTURAL_SPRAYING",
      title: "Agricultural Spraying",
      icon: Trees,
      desc: "Precision crop spraying, multispectral NDVI plant stress indexing, and automated acreage distribution.",
    },
    {
      id: "INFRASTRUCTURE_INSPECTION",
      title: "Infrastructure Inspection",
      icon: Building2,
      desc: "High-resolution thermal anomaly analysis for utilities, wind turbines, cell towers, and energy substations.",
    },
    {
      id: "REAL_ESTATE_MAPPING",
      title: "3D Orthomosaic Mapping",
      icon: Layers,
      desc: "Centimeter-accurate orthophotos, volumetric measurements, digital elevation models, and point clouds.",
    },
    {
      id: "CONSTRUCTION_MONITORING",
      title: "Construction Progression",
      icon: Construction,
      desc: "Weekly site progression sweeps, stockpile volumetric audits, cut-and-fill telemetry, and BIM integration.",
    },
    {
      id: "LAND_SURVEYING",
      title: "Topographic Land Surveying",
      icon: Navigation,
      desc: "RTK/PPK boundary surveys, terrain contours, GIS shapefile export, and civil engineering benchmarks.",
    },
    {
      id: "AERIAL_PHOTOGRAPHY",
      title: "Commercial Aerial Media",
      icon: Camera,
      desc: "ProRes 8K stabilized footage, industrial marketing captures, and broadcast-ready corporate media.",
    },
  ];

  const faqs = [
    {
      q: "How does pilot credential verification work?",
      a: "Every pilot must submit their official FAA Part 107 Commercial Remote Pilot License and current Certificate of Insurance (COI). Our compliance operations team verifies license numbers against the FAA airmen registry before granting the verified pilot designation.",
    },
    {
      q: "Can unverified pilots apply to enterprise projects?",
      a: "No. Enterprise jobs with compliance requirements are restricted exclusively to pilots with verified, non-expired Part 107 credentials and validated equipment specs.",
    },
    {
      q: "How are candidate match scores calculated?",
      a: "Our matching engine weights five operational factors: Active Part 107 credential validity (30%), operating radius to flight site (20%), verified hardware and payload sensors (20%), demonstrated industry track record (20%), and mission calendar availability (10%).",
    },
    {
      q: "How does milestone payment security work?",
      a: "When an enterprise awards a mission, project funds are secured in escrow. Funds are released directly to the pilot once the flight telemetry and specified deliverables are reviewed and accepted.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border overflow-hidden">
        {/* Subtle engineering grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Compliance Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs text-xs font-medium text-foreground mb-8">
            <span className="flex h-2 w-2 rounded-full bg-success"></span>
            <span>FAA Part 107 Certified Commercial Flight Network</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-foreground max-w-4xl mx-auto leading-[1.12]">
            Commercial drone pilots for critical industrial operations.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The dedicated operations marketplace connecting verified, credentialed drone pilots with enterprise leaders in infrastructure, agriculture, surveying, and energy.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button asChild size="lg" variant="primary">
              <Link href="/pilots" className="gap-2 font-semibold">
                <span>Find a Verified Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary">
              <Link href="/jobs" className="gap-2 font-medium">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>Browse Open Missions</span>
              </Link>
            </Button>
          </div>

          {/* Operational Metrics Bar */}
          <div className="mt-14 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-panel bg-surface border border-border shadow-xs">
            <div className="text-center p-2">
              <p className="text-xl sm:text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-0.5">FAA Part 107 Verified</p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-xl sm:text-2xl font-bold text-foreground">&lt; 2 cm</p>
              <p className="text-xs text-muted-foreground mt-0.5">RTK/PPK Precision</p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-xl sm:text-2xl font-bold text-foreground">$1M–$5M</p>
              <p className="text-xs text-muted-foreground mt-0.5">COI Insured Flights</p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-xl sm:text-2xl font-bold text-foreground">Escrow</p>
              <p className="text-xs text-muted-foreground mt-0.5">Milestone Secured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Sectors */}
      <section id="services" className="py-20 bg-surface-2 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <Badge variant="default" className="mb-3">
              Specialized Operations
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Industrial commercial sectors
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Equipped with enterprise payloads: dual thermal radiometric sensors, RTK ground stations, multispectral lenses, and heavy-lift sprayers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <Card
                  key={sector.id}
                  className="group hover:border-border-strong transition-all duration-150 flex flex-col justify-between"
                >
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-control bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {sector.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {sector.desc}
                    </p>
                  </CardContent>
                  <div className="px-6 pb-5 pt-0">
                    <Link
                      href={`/jobs?service=${sector.id}`}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>View missions in {sector.title.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bilateral Workflow */}
      <section id="how-it-works" className="py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3">
              Operational Workflow
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Built for rigorous field deployments
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              End-to-end mission scoping, automated compliance matching, and milestone-backed fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Companies */}
            <Card>
              <CardContent className="p-7 space-y-6">
                <div className="flex items-center gap-3 pb-5 border-b border-border">
                  <div className="w-9 h-9 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">For Enterprises & Agencies</h3>
                    <p className="text-xs text-muted-foreground">Hire compliant drone operators with verifiable credentials</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Define Flight Scope & Payload Specs",
                      desc: "Specify site coordinates, flight date window, budget, required sensors (LiDAR, RTK, Thermal), and deliverables.",
                    },
                    {
                      step: "02",
                      title: "Compare Verified Pilot Proposals",
                      desc: "Review compliant pilots with transparent algorithmic match scores based on hardware, radius, and historical performance.",
                    },
                    {
                      step: "03",
                      title: "Award Mission & Fund Milestone Escrow",
                      desc: "Lock mission parameters and fund project milestones securely prior to takeoff.",
                    },
                    {
                      step: "04",
                      title: "Accept Deliverables & Release Payout",
                      desc: "Verify raw sensor data, orthophotos, or telemetry reports. Release payment upon final acceptance.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3.5 p-3 rounded-control bg-surface-2 border border-border">
                      <span className="font-mono text-xs font-semibold text-primary px-2 py-1 rounded bg-surface border border-border shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Pilots */}
            <Card>
              <CardContent className="p-7 space-y-6">
                <div className="flex items-center gap-3 pb-5 border-b border-border">
                  <div className="w-9 h-9 rounded-control bg-success/10 text-success flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">For Commercial Pilots</h3>
                    <p className="text-xs text-muted-foreground">Access paid industrial missions tailored to your fleet</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Register Fleet & Operational Payload",
                      desc: "Catalog your airframes, optical/thermal sensors, RTK base stations, and certified flight hours.",
                    },
                    {
                      step: "02",
                      title: "Verify FAA Part 107 Credentials",
                      desc: "Submit your airmen license and COI insurance. Receive verified pilot status upon administrator audit.",
                    },
                    {
                      step: "03",
                      title: "Submit High-Match Proposals",
                      desc: "Receive alerts for high-matching industrial operations in your operational radius and submit bids.",
                    },
                    {
                      step: "04",
                      title: "Execute Flights & Direct Earnings",
                      desc: "Conduct operations safely, upload data deliverables, and receive immediate payouts with verified client reviews.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3.5 p-3 rounded-control bg-surface-2 border border-border">
                      <span className="font-mono text-xs font-semibold text-success px-2 py-1 rounded bg-surface border border-border shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance & Verification Feature Highlight */}
      <section className="py-20 bg-surface-2 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-3">
                Aviation Standards
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Rigorous compliance. Zero unverified operators.
              </h2>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Industrial flight operations carry real liabilities. Our platform mandates compliance safeguards before an operator is ever cleared to bid on a flight brief.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "FAA Registry Cross-Referenced",
                    desc: "Every remote pilot certificate number is verified against current FAA records to prevent expired licenses.",
                  },
                  {
                    title: "Sensor & Payload Matching",
                    desc: "Clients specify required sensors (thermal radiometric, multispectral, LiDAR), filtering out mismatched consumer rigs.",
                  },
                  {
                    title: "Protected Escrow Disbursements",
                    desc: "Eliminates payment chasing for pilots and incomplete delivery risks for hiring enterprises.",
                  },
                  {
                    title: "Immutable Mission Reviews",
                    desc: "Feedback is tied strictly to completed, verified contract transactions.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec Card UI Showcase */}
            <Card className="shadow-md">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-control bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
                      MV
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Marcus Vance</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="success" className="text-[10px] px-2 py-0">
                          FAA Part 107 Verified
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">Texas, USA</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="font-mono text-xs">
                    98% Match
                  </Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Certified Airframes</span>
                    <span className="font-medium text-foreground">DJI Matrice 350 RTK, Mavic 3 Enterprise</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Sensor Payloads</span>
                    <span className="font-medium text-foreground">Zenmuse H20T Thermal, L2 LiDAR</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Logged Flight Hours</span>
                    <span className="font-medium text-foreground">1,840 Commercial Hours</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">COI Insurance</span>
                    <span className="font-medium text-success">$2,000,000 Policy Verified</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Client Rating</span>
                    <span className="font-medium text-foreground">5.0 / 5.0 (42 missions)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild block variant="secondary" size="sm">
                    <Link href="/pilots">View Verified Pilot Profiles</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              FAQ
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Common questions regarding licensing, mission matching, and compliance.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-panel border border-border bg-surface overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-foreground hover:bg-surface-2 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "transform rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="py-16 bg-surface-2 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
            Deploy your next industrial drone mission today.
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join enterprise operations teams and commercial pilots leveraging verified credentials and milestone-secured contracts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" variant="primary">
              <Link href="/register?role=COMPANY">Post a Project as Company</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/register?role=PILOT">Register as Certified Pilot</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
