"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  ChevronDown,
  Droplets,
  Flame,
  Layers,
  HardHat,
  Crosshair,
  Aperture,
  Plane,
  Building2,
  FileCheck2,
  Lock,
  ArrowRight,
  ChevronRight,
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
      title: "Agricultural Dispersal",
      icon: Droplets,
      payload: "DJI Agras T40 / 40L Spray Grid",
      metric: "500 acres/day",
      desc: "Variable rate chemical application, multispectral NDVI plant stress indexing, and automated acreage distribution.",
    },
    {
      id: "INFRASTRUCTURE_INSPECTION",
      code: "IN-204",
      title: "Utility & Grid Inspection",
      icon: Flame,
      payload: "Radiometric Thermal / 640×512 NETD",
      metric: "Sub-mm precision",
      desc: "Thermal anomaly detection for high-voltage substations, wind turbine blade composites, and cell transmission arrays.",
    },
    {
      id: "REAL_ESTATE_MAPPING",
      code: "MP-301",
      title: "3D Photogrammetry & Orthomosaics",
      icon: Layers,
      payload: "Full-Frame 45MP / RTK Ground Base",
      metric: "< 1.5 cm GSD",
      desc: "Survey-grade orthophotos, digital elevation models, volumetric stockpile quantification, and geo-referenced point clouds.",
    },
    {
      id: "CONSTRUCTION_MONITORING",
      code: "CM-408",
      title: "Construction Progression",
      icon: HardHat,
      payload: "Weekly BIM Overlay / Cut & Fill",
      metric: "Weekly Cadence",
      desc: "Scheduled jobsite progression flights, earthwork audits, civil contractor compliance documentation, and BIM overlay integration.",
    },
    {
      id: "LAND_SURVEYING",
      code: "SV-502",
      title: "Topographic Land Surveying",
      icon: Crosshair,
      payload: "Aerial LiDAR / PPK Georeferenced",
      metric: "Civil 3D Ready",
      desc: "Boundary contouring, canopy-penetrating terrain mapping, GIS shapefile export, and state-plane coordinate benchmarks.",
    },
    {
      id: "AERIAL_PHOTOGRAPHY",
      code: "MD-605",
      title: "Commercial Aerial Media",
      icon: Aperture,
      payload: "ProRes 8K / 3-Axis Gimbal Cine",
      metric: "Cinema DCI 8K",
      desc: "Broadcast-grade industrial marketing cinematography, stabilized tracking sequences, and executive investor presentations.",
    },
  ];

  const enterpriseClients = [
    { name: "Apex Energy Holdings", region: "Texas ERCOT Grid" },
    { name: "Vanguard Infrastructure", region: "Midwest Corridor" },
    { name: "Pacific Civil Engineering", region: "California DOT" },
    { name: "Borealis Wind Systems", region: "Great Plains" },
    { name: "Stewardship Ag Partners", region: "Central Valley" },
  ];

  const faqs = [
    {
      q: "How does pilot credential verification work?",
      a: "Every pilot submits their official FAA Part 107 Commercial Remote Pilot License and current Certificate of Insurance (COI). License numbers are verified directly against the FAA Airmen Certification Registry before commercial bids can be placed.",
    },
    {
      q: "Can unverified pilots apply to enterprise projects?",
      a: "No. Enterprise jobs with compliance requirements are restricted exclusively to pilots with verified, active Part 107 credentials and validated equipment specs.",
    },
    {
      q: "How are candidate match scores calculated?",
      a: "Our matching engine weights five operational factors: Active Part 107 credential validity (30%), operating radius to flight site (20%), verified hardware and payload sensors (20%), demonstrated industry track record (20%), and mission calendar availability (10%).",
    },
    {
      q: "How does milestone escrow security work?",
      a: "When an enterprise awards a mission, project capital is funded into escrow. Funds are released directly to the pilot once raw flight deliverables and inspection reports pass quality control review.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-150">
      
      {/* Institutional Top Trust Bar */}
      <div className="border-b border-border/80 dark:border-zinc-800/80 bg-surface dark:bg-zinc-950/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            <span className="font-medium text-foreground">FAA Part 107 Airmen Registry Connected</span>
            <span className="text-border dark:text-zinc-700">|</span>
            <span>\$5,000,000 Policy Coverage Supported</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>DISPATCH NETWORK: N. AMERICA</span>
            <span className="hidden md:inline text-border dark:text-zinc-700">|</span>
            <span className="hidden md:inline">SYSTEM HEALTH: NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32 border-b border-border dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-xs font-medium text-foreground mx-auto transition-colors duration-150 hover:border-border-strong dark:hover:border-zinc-700">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>Enterprise Commercial UAV Dispatch Platform</span>
          </div>

          {/* Classical Monolithic Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-semibold tracking-[-0.035em] text-foreground leading-[1.08] max-w-3xl mx-auto">
            Commercial drone infrastructure for critical operations.
          </h1>

          {/* Crisp Institutional Narrative */}
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Aether connects enterprise asset owners with vetted, insured commercial remote pilots. Scoped for utility grids, agricultural acreage, heavy civil engineering, and survey-grade orthomosaics.
          </p>

          {/* Action Strip: Primary & Secondary with smooth arrow slide */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" variant="primary" className="group h-11 px-6 shadow-xs hover:shadow-sm">
              <Link href="/company/post-job" className="gap-2">
                <span>Deploy a Mission</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="group h-11 px-6">
              <Link href="/pilots" className="gap-2">
                <span>Explore Vetted Pilots</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Underwritten Metrics Row with hover highlight */}
          <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 pt-10 border-t border-border dark:border-zinc-800 mt-6">
            <div className="group space-y-0.5 text-center p-2 rounded-control transition-colors duration-150 hover:bg-surface-2/60 dark:hover:bg-zinc-900/40">
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono transition-transform duration-150 group-hover:-translate-y-0.5">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Part 107 Airmen Verified</p>
            </div>
            <div className="group space-y-0.5 border-l border-border dark:border-zinc-800 text-center pl-2 sm:pl-4 p-2 rounded-control transition-colors duration-150 hover:bg-surface-2/60 dark:hover:bg-zinc-900/40">
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono transition-transform duration-150 group-hover:-translate-y-0.5">&lt; 1.5 cm</p>
              <p className="text-xs text-muted-foreground mt-1">RTK Survey Accuracy</p>
            </div>
            <div className="group space-y-0.5 border-l border-border dark:border-zinc-800 text-center pl-2 sm:pl-4 p-2 rounded-control transition-colors duration-150 hover:bg-surface-2/60 dark:hover:bg-zinc-900/40">
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono transition-transform duration-150 group-hover:-translate-y-0.5">\$5.0M</p>
              <p className="text-xs text-muted-foreground mt-1">COI Insurance Underwritten</p>
            </div>
          </div>

        </div>
      </section>

      {/* Institutional Enterprise Social Proof */}
      <section className="py-7 border-b border-border dark:border-zinc-800 bg-surface-2/40 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-4">
            Operations deployed across North American industrial corridors
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {enterpriseClients.map((client) => (
              <div
                key={client.name}
                className="group flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded transition-colors duration-150 hover:text-foreground hover:bg-surface dark:hover:bg-zinc-900"
              >
                <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 transition-colors group-hover:bg-primary" />
                <span className="font-semibold text-foreground/90 group-hover:text-foreground">{client.name}</span>
                <span className="text-[11px] text-muted-foreground font-mono">({client.region})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial Commercial Sectors */}
      <section id="services" className="py-20 sm:py-28 bg-surface-2 dark:bg-[#060608] border-b border-border dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Operational Scope
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
              Industrial mission capabilities
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Standardized airframes equipped with dual thermal radiometric sensors, RTK base stations, aerial LiDAR, and heavy-lift agricultural systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.id}
                  className="group rounded-panel bg-surface dark:bg-zinc-950 border border-border dark:border-zinc-800 p-6 flex flex-col justify-between transition-all duration-200 ease-out hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border/80 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 flex items-center justify-center text-foreground transition-colors duration-150 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:text-primary">
                          <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                        </div>
                        <span className="text-xs font-mono font-medium text-muted-foreground uppercase">
                          {sector.code}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-muted-foreground px-2 py-0.5 rounded bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 transition-colors duration-150 group-hover:border-border-strong">
                        {sector.metric}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                      {sector.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {sector.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60 dark:border-zinc-800/80">
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Payload: <span className="font-sans font-medium text-foreground">{sector.payload}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border dark:border-zinc-800 flex items-center justify-between">
                    <Link
                      href={`/jobs?service=${sector.id}`}
                      className="text-xs font-medium text-foreground group-hover:text-primary inline-flex items-center gap-1 transition-colors duration-150"
                    >
                      <span>Explore missions</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform duration-150 ease-out group-hover:translate-x-1" />
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
      <section id="how-it-works" className="py-20 sm:py-28 bg-background dark:bg-black border-b border-border dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Bilateral Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
              Built for commercial compliance
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Standardized contract scoping, algorithmic hardware-to-airspace matching, and milestone-secured escrow disbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* For Companies */}
            <div className="rounded-panel border border-border dark:border-zinc-800 bg-surface dark:bg-zinc-950 p-7 sm:p-8 space-y-6 transition-colors duration-150 hover:border-border-strong dark:hover:border-zinc-700">
              <div className="flex items-center gap-3 pb-5 border-b border-border dark:border-zinc-800">
                <div className="w-9 h-9 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">For Enterprise Asset Owners</h3>
                  <p className="text-xs text-muted-foreground">Procure compliant flight operations with zero liability gaps</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Define Flight Scope & Required Payloads",
                    desc: "Specify site coordinates, required sensors (LiDAR, RTK, Thermal), and deliverables format.",
                  },
                  {
                    step: "02",
                    title: "Review Algorithmic Matches",
                    desc: "Compare vetted pilots filtered by equipment payload, operating radius, and historical performance.",
                  },
                  {
                    step: "03",
                    title: "Fund Milestone Escrow",
                    desc: "Deposit mission capital into escrow prior to wheels-up to protect operational timelines.",
                  },
                  {
                    step: "04",
                    title: "Accept Verified Deliverables",
                    desc: "Audit raw sensor data, orthomosaic deliverables, or inspection reports before releasing payouts.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="group flex items-start gap-3.5 p-3.5 rounded-control bg-surface-2/60 dark:bg-zinc-900/40 border border-border/80 dark:border-zinc-800/80 transition-all duration-150 hover:bg-surface-2 dark:hover:bg-zinc-900 hover:border-border-strong dark:hover:border-zinc-700 hover:translate-x-0.5"
                  >
                    <span className="font-mono text-xs font-semibold text-foreground px-2 py-0.5 rounded bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 shrink-0 transition-colors group-hover:border-zinc-400 dark:group-hover:border-zinc-600">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Pilots */}
            <div className="rounded-panel border border-border dark:border-zinc-800 bg-surface dark:bg-zinc-950 p-7 sm:p-8 space-y-6 transition-colors duration-150 hover:border-border-strong dark:hover:border-zinc-700">
              <div className="flex items-center gap-3 pb-5 border-b border-border dark:border-zinc-800">
                <div className="w-9 h-9 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">For Commercial Flight Crews</h3>
                  <p className="text-xs text-muted-foreground">Access qualified industrial flight briefs matched to your fleet</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Catalog Fleet & Specialized Sensors",
                    desc: "Register certified airframes, optical payloads, thermal radiometers, and RTK equipment.",
                  },
                  {
                    step: "02",
                    title: "Submit Airmen Credentials & Insurance",
                    desc: "Pass FAA Part 107 registry check and provide active Certificate of Insurance (COI).",
                  },
                  {
                    step: "03",
                    title: "Receive Targeted Dispatch Briefs",
                    desc: "Bid on commercial missions scoped specifically for your equipment in your operational radius.",
                  },
                  {
                    step: "04",
                    title: "Execute Flights & Direct Escrow Release",
                    desc: "Conduct operations safely, upload data files, and receive prompt settlement without chasing accounts.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="group flex items-start gap-3.5 p-3.5 rounded-control bg-surface-2/60 dark:bg-zinc-900/40 border border-border/80 dark:border-zinc-800/80 transition-all duration-150 hover:bg-surface-2 dark:hover:bg-zinc-900 hover:border-border-strong dark:hover:border-zinc-700 hover:translate-x-0.5"
                  >
                    <span className="font-mono text-xs font-semibold text-foreground px-2 py-0.5 rounded bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 shrink-0 transition-colors group-hover:border-zinc-400 dark:group-hover:border-zinc-600">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="py-20 sm:py-28 bg-surface-2 dark:bg-[#060608] border-b border-border dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-5">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Institutional Risk Mitigation
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight">
                Rigorous compliance. Zero unvetted operations.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Industrial flights introduce real site liabilities. Our protocol mandates automated credential audits before any remote pilot can place a proposal on an operational brief.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "FAA Registry Cross-Referenced",
                    desc: "Every certificate number is validated directly against current federal airmen databases.",
                  },
                  {
                    title: "Payload-Specific Qualification",
                    desc: "Matches missions only to operators with verified industrial-grade sensor payloads.",
                  },
                  {
                    title: "Underwritten Escrow Architecture",
                    desc: "Guarantees payment delivery for operators while ensuring quality data fulfillment for enterprises.",
                  },
                  {
                    title: "Verified Transaction Records",
                    desc: "Performance records are tethered strictly to completed, verified commercial contracts.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-1.5 rounded transition-colors duration-150 hover:bg-surface/60 dark:hover:bg-zinc-900/30">
                    <div className="w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credential Card Showcase */}
            <div className="rounded-panel border border-border dark:border-zinc-800 bg-surface dark:bg-zinc-950 p-6 sm:p-7 space-y-5 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-border dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground flex items-center justify-center font-bold text-xs font-mono">
                    MV
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Marcus Vance</h4>
                    <p className="text-xs text-muted-foreground">Remote Pilot #4892019 • Texas, USA</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground">
                  AUDITED
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/70 dark:border-zinc-800/80 transition-colors duration-150 hover:bg-surface-2/40 dark:hover:bg-zinc-900/30 px-1 rounded">
                  <span className="text-muted-foreground">Certified Airframes</span>
                  <span className="font-medium text-foreground">DJI Matrice 350 RTK, Mavic 3 Enterprise</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70 dark:border-zinc-800/80 transition-colors duration-150 hover:bg-surface-2/40 dark:hover:bg-zinc-900/30 px-1 rounded">
                  <span className="text-muted-foreground">Sensor Payloads</span>
                  <span className="font-medium text-foreground">Zenmuse H20T Thermal, L2 LiDAR</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70 dark:border-zinc-800/80 transition-colors duration-150 hover:bg-surface-2/40 dark:hover:bg-zinc-900/30 px-1 rounded">
                  <span className="text-muted-foreground">Logged Flight Hours</span>
                  <span className="font-medium text-foreground font-mono">1,840 Commercial Hours</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70 dark:border-zinc-800/80 transition-colors duration-150 hover:bg-surface-2/40 dark:hover:bg-zinc-900/30 px-1 rounded">
                  <span className="text-muted-foreground">COI Insurance</span>
                  <span className="font-medium text-foreground font-mono">\$2,000,000 Verified</span>
                </div>
                <div className="flex justify-between py-1.5 transition-colors duration-150 hover:bg-surface-2/40 dark:hover:bg-zinc-900/30 px-1 rounded">
                  <span className="text-muted-foreground">Client Rating</span>
                  <span className="font-medium text-foreground font-mono">5.0 / 5.0 (42 missions)</span>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild block variant="secondary" size="md" className="group">
                  <Link href="/pilots" className="gap-1.5">
                    <span>View Verified Pilot Profiles</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with smooth accordion expand */}
      <section className="py-20 sm:py-28 bg-background dark:bg-black border-b border-border dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Compliance & Protocols
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-panel border bg-surface dark:bg-zinc-950 overflow-hidden transition-colors duration-150 ${
                    isOpen
                      ? "border-zinc-400 dark:border-zinc-600 shadow-2xs"
                      : "border-border dark:border-zinc-800 hover:border-border-strong dark:hover:border-zinc-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-foreground hover:bg-surface-2/60 dark:hover:bg-zinc-900/60 transition-colors duration-150"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ease-out shrink-0 ml-4 ${
                        isOpen ? "transform rotate-180 text-foreground" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/80 dark:border-zinc-800 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Executive Call to Action */}
      <section className="py-20 sm:py-24 bg-surface-2 dark:bg-[#060608] border-b border-border dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            Deploy your next commercial mission.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Connect with certified Part 107 pilots backed by verified airframes, radiometric payloads, and milestone escrow security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" variant="primary" className="group h-11 px-6 shadow-xs">
              <Link href="/company/post-job" className="gap-2">
                <span>Post Commercial Mission</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="group h-11 px-6">
              <Link href="/register?role=PILOT" className="gap-2">
                <span>Apply as Verified Operator</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
