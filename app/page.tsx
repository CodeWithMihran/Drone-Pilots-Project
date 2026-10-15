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
      code: "AG-107",
      title: "Agricultural Spraying",
      icon: Trees,
      payload: "DJI Agras T40 / 40L Spray Tank",
      metric: "Up to 500 acres/day",
      desc: "Variable rate chemical application, multispectral NDVI plant stress indexing, and automated acreage distribution.",
    },
    {
      id: "INFRASTRUCTURE_INSPECTION",
      code: "IN-204",
      title: "Infrastructure Inspection",
      icon: Building2,
      payload: "Radiometric Thermal / 640×512 NETD",
      metric: "Sub-millimeter flaw detection",
      desc: "Thermal anomaly analysis for utility grids, wind turbine blades, cell tower arrays, and electrical substations.",
    },
    {
      id: "REAL_ESTATE_MAPPING",
      code: "MP-301",
      title: "3D Orthomosaic Mapping",
      icon: Layers,
      payload: "Full-frame 45MP / RTK Ground Base",
      metric: "< 1.5 cm GSD Accuracy",
      desc: "Survey-grade orthophotos, volumetric measurements, digital surface models (DSM), and geo-referenced point clouds.",
    },
    {
      id: "CONSTRUCTION_MONITORING",
      code: "CM-408",
      title: "Construction Progression",
      icon: Construction,
      payload: "Weekly BIM Overlay / Cut & Fill",
      metric: "Weekly Cadence / 24h Turnaround",
      desc: "Scheduled jobsite progression flights, stockpile volumetric audits, earthwork verification, and Autodesk BIM integration.",
    },
    {
      id: "LAND_SURVEYING",
      code: "SV-502",
      title: "Topographic Land Surveying",
      icon: Navigation,
      payload: "Aerial LiDAR / PPK Georeferenced",
      metric: "Civil 3D / GIS Ready",
      desc: "Boundary contouring, digital terrain modeling through heavy canopy, GIS shapefile export, and civil engineering benchmarks.",
    },
    {
      id: "AERIAL_PHOTOGRAPHY",
      code: "MD-605",
      title: "Commercial Aerial Media",
      icon: Camera,
      payload: "ProRes 8K / 3-Axis Gimbal Cine",
      metric: "Cinema DCI 8K ProRes",
      desc: "Broadcast-grade industrial marketing cinematography, stabilized tracking shots, and corporate investor media packages.",
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
      <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-36 lg:pt-36 lg:pb-40 border-b border-border dark:border-zinc-800 overflow-hidden">
        {/* Subtle engineering grid & atmospheric radial glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(59,130,246,0.18),rgba(0,0,0,0))] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
          {/* Compliance Pill with live beacon */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface/90 dark:bg-zinc-900/90 border border-border dark:border-zinc-800 shadow-xs text-xs font-medium text-foreground mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span>FAA Part 107 Certified Commercial Flight Network</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-foreground max-w-4xl mx-auto leading-[1.08]">
            Commercial drone pilots for critical industrial operations.
          </h1>

          {/* Subtitle */}
          <p className="mt-7 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            The dedicated operations marketplace connecting verified, credentialed drone pilots with enterprise leaders in infrastructure, agriculture, surveying, and energy.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="primary" className="h-12 px-6 text-sm font-semibold">
              <Link href="/pilots" className="gap-2 font-semibold">
                <span>Find a Verified Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-sm font-medium">
              <Link href="/jobs" className="gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>Browse Open Missions</span>
              </Link>
            </Button>
          </div>

          {/* Operational Metrics Bar */}
          <div className="mt-16 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-panel bg-surface dark:bg-zinc-950/80 border border-border dark:border-zinc-800 shadow-sm backdrop-blur-md">
            <div className="text-center p-2.5">
              <p className="text-xl sm:text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-0.5">FAA Part 107 Verified</p>
            </div>
            <div className="text-center p-2.5 border-l border-border dark:border-zinc-800">
              <p className="text-xl sm:text-2xl font-bold text-foreground">&lt; 2 cm</p>
              <p className="text-xs text-muted-foreground mt-0.5">RTK/PPK Precision</p>
            </div>
            <div className="text-center p-2.5 border-l border-border dark:border-zinc-800">
              <p className="text-xl sm:text-2xl font-bold text-foreground">$1M–$5M</p>
              <p className="text-xs text-muted-foreground mt-0.5">COI Insured Flights</p>
            </div>
            <div className="text-center p-2.5 border-l border-border dark:border-zinc-800">
              <p className="text-xl sm:text-2xl font-bold text-foreground">Escrow</p>
              <p className="text-xs text-muted-foreground mt-0.5">Milestone Secured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Sectors */}
      <section id="services" className="py-24 sm:py-32 bg-surface-2 dark:bg-[#060608] border-b border-border dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <Badge variant="default" className="mb-3.5">
              Specialized Operations
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground">
              Industrial commercial sectors
            </h2>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              Equipped with enterprise payloads: dual thermal radiometric sensors, RTK ground stations, multispectral lenses, and heavy-lift sprayers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.id}
                  className="group rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 hover:border-border-strong dark:hover:border-zinc-700 shadow-xs hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition-all duration-300 ease-out p-7 flex flex-col justify-between"
                >
                  <div>
                    {/* Header with technical code & subtle icon badge */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-border dark:border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                          {sector.code}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-primary px-2.5 py-0.5 rounded-control bg-primary/10">
                        {sector.metric}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {sector.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {sector.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60 dark:border-zinc-800/80">
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Standard Payload: <span className="font-sans font-medium text-foreground">{sector.payload}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border dark:border-zinc-800/80 flex items-center justify-between">
                    <Link
                      href={`/jobs?service=${sector.id}`}
                      className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore missions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">
                      Part 107
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bilateral Workflow */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-background dark:bg-black border-b border-border dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <Badge variant="outline" className="mb-3.5">
              Operational Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground">
              Built for rigorous field deployments
            </h2>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              End-to-end mission scoping, automated compliance matching, and milestone-backed fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* For Companies */}
            <Card className="hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 sm:p-10 space-y-7">
                <div className="flex items-center gap-3.5 pb-6 border-b border-border dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">For Enterprises & Agencies</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Hire compliant drone operators with verifiable credentials</p>
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
                    <div key={item.step} className="flex items-start gap-4 p-4 rounded-control bg-surface-2 dark:bg-zinc-900/60 border border-border dark:border-zinc-800/80">
                      <span className="font-mono text-xs font-semibold text-primary px-2.5 py-1 rounded bg-surface dark:bg-zinc-950 border border-border dark:border-zinc-800 shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Pilots */}
            <Card className="hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 sm:p-10 space-y-7">
                <div className="flex items-center gap-3.5 pb-6 border-b border-border dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-control bg-success/10 text-success flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">For Commercial Pilots</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Access paid industrial missions tailored to your fleet</p>
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
                    <div key={item.step} className="flex items-start gap-4 p-4 rounded-control bg-surface-2 dark:bg-zinc-900/60 border border-border dark:border-zinc-800/80">
                      <span className="font-mono text-xs font-semibold text-success px-2.5 py-1 rounded bg-surface dark:bg-zinc-950 border border-border dark:border-zinc-800 shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
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
      <section className="py-24 sm:py-32 bg-surface-2 dark:bg-[#060608] border-b border-border dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-3.5">
                Aviation Standards
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground leading-tight">
                Rigorous compliance. Zero unverified operators.
              </h2>
              <p className="text-base text-muted-foreground mt-4 leading-relaxed">
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
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec Card UI Showcase */}
            <Card className="shadow-lg hover:shadow-2xl dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.9)] transition-all duration-300">
              <CardContent className="p-7 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-5 border-b border-border dark:border-zinc-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-control bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
                      MV
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-foreground">Marcus Vance</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="success" className="text-[10px] px-2 py-0">
                          FAA Part 107 Verified
                        </Badge>
                        <span className="text-xs text-muted-foreground">Texas, USA</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="font-mono text-xs">
                    98% Match
                  </Badge>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-border dark:border-zinc-800">
                    <span className="text-muted-foreground">Certified Airframes</span>
                    <span className="font-medium text-foreground">DJI Matrice 350 RTK, Mavic 3 Enterprise</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border dark:border-zinc-800">
                    <span className="text-muted-foreground">Sensor Payloads</span>
                    <span className="font-medium text-foreground">Zenmuse H20T Thermal, L2 LiDAR</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border dark:border-zinc-800">
                    <span className="text-muted-foreground">Logged Flight Hours</span>
                    <span className="font-medium text-foreground">1,840 Commercial Hours</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border dark:border-zinc-800">
                    <span className="text-muted-foreground">COI Insurance</span>
                    <span className="font-medium text-success">$2,000,000 Policy Verified</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Client Rating</span>
                    <span className="font-medium text-foreground">5.0 / 5.0 (42 missions)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild block variant="secondary" size="md">
                    <Link href="/pilots">View Verified Pilot Profiles</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32 bg-background dark:bg-black border-b border-border dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-3.5">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted-foreground mt-2.5">
              Common questions regarding licensing, mission matching, and compliance.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-panel border border-border dark:border-zinc-800 bg-surface dark:bg-zinc-950 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-foreground hover:bg-surface-2 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "transform rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border dark:border-zinc-800 pt-3">
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
      <section className="py-20 sm:py-28 bg-surface-2 dark:bg-[#060608] border-b border-border dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
            Deploy your next industrial drone mission today.
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join enterprise operations teams and commercial pilots leveraging verified credentials and milestone-secured contracts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Button asChild size="lg" variant="primary" className="h-12 px-6">
              <Link href="/register?role=COMPANY">Post a Project as Company</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-12 px-6">
              <Link href="/register?role=PILOT">Register as Certified Pilot</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
