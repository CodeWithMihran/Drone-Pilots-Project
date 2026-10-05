import React from "react";
import Link from "next/link";
import {
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Search,
  ArrowRight,
  Plane,
  Building2,
  Camera,
  Layers,
  Trees,
  Construction,
  Award,
  Zap,
  Star,
  Users,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const services = [
    {
      id: "AGRICULTURAL_SPRAYING",
      title: "Agricultural Spraying",
      icon: Trees,
      desc: "Precision crop spraying, NDVI multispectral health indexing, and automated farm mapping.",
      color: "from-emerald-500/20 to-emerald-950/40 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "INFRASTRUCTURE_INSPECTION",
      title: "Infrastructure Inspection",
      icon: Building2,
      desc: "Thermal anomaly detection for powerlines, wind turbines, bridges, cell towers, and pipelines.",
      color: "from-cyan-500/20 to-cyan-950/40 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "REAL_ESTATE_MAPPING",
      title: "Real Estate & 3D Mapping",
      icon: Layers,
      desc: "High-resolution orthomosaics, 3D point clouds, digital elevation models, and luxury showcases.",
      color: "from-blue-500/20 to-blue-950/40 text-blue-400 border-blue-500/30",
    },
    {
      id: "CONSTRUCTION_MONITORING",
      title: "Construction Monitoring",
      icon: Construction,
      desc: "Weekly progression scans, volumetric stockpile calculations, cut-and-fill analysis, and BIM overlay.",
      color: "from-amber-500/20 to-amber-950/40 text-amber-400 border-amber-500/30",
    },
    {
      id: "LAND_SURVEYING",
      title: "Land Surveying & LiDAR",
      icon: Navigation,
      desc: "Centimeter-grade RTK/PPK topographic surveys, boundary mapping, and GIS integration.",
      color: "from-purple-500/20 to-purple-950/40 text-purple-400 border-purple-500/30",
    },
    {
      id: "AERIAL_PHOTOGRAPHY",
      title: "Aerial Photography & Cinema",
      icon: Camera,
      desc: "Commercial cinematography, 8K ProRes aerial filming, live event streaming, and media production.",
      color: "from-pink-500/20 to-pink-950/40 text-pink-400 border-pink-500/30",
    },
  ];

  const faqs = [
    {
      q: "How does pilot certification verification work?",
      a: "Every pilot must submit their official FAA Part 107 Commercial Remote Pilot License (or equivalent national aviation authority credentials). Our administration team verifies the certificate number against the aviation registry before granting the '✓ VERIFIED PILOT' badge.",
    },
    {
      q: "Can unverified pilots apply to industrial jobs?",
      a: "No. Industrial clients posting projects with certification requirements are only accessible to verified pilots with valid, non-expired credentials.",
    },
    {
      q: "How does the matching algorithm calculate match scores?",
      a: "The matching engine analyzes five core pillars: Active Certification (30 pts), Operating Location & Service Area (20 pts), Years of Specialized Experience (20 pts), Hardware & Drone Payloads (20 pts), and Schedule Availability (10 pts).",
    },
    {
      q: "How does payment protection work on the marketplace?",
      a: "When a company accepts a proposal, funds are allocated for the project. Payment is released to the pilot immediately upon the company verifying job completion.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#060b18]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 sm:pt-28 sm:pb-36 overflow-hidden">
        {/* Background glow & gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 animate-fade-in shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>FAA Part 107 Verified Commercial Flight Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Connect With{" "}
            <span className="gradient-text">Certified Drone Professionals</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Find verified commercial drone pilots for agriculture, real estate, infrastructure inspection, surveying, and industrial operations.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pilots"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <span>Find a Drone Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/jobs"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:text-white transition flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Browse Drone Jobs</span>
            </Link>
          </div>

          {/* Trust stats pill bar */}
          <div className="mt-16 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-[#0b132b]/80 border border-slate-800/80 backdrop-blur-md shadow-2xl">
            <div className="text-center p-2">
              <p className="text-xl sm:text-2xl font-black text-cyan-400">100%</p>
              <p className="text-[11px] text-slate-400 font-medium">Verified Part 107</p>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <p className="text-xl sm:text-2xl font-black text-white">$2.4M+</p>
              <p className="text-[11px] text-slate-400 font-medium">Flight Contracts</p>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <p className="text-xl sm:text-2xl font-black text-teal-400">12,500+</p>
              <p className="text-[11px] text-slate-400 font-medium">Flight Hours</p>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <p className="text-xl sm:text-2xl font-black text-amber-400">4.9 ★</p>
              <p className="text-[11px] text-slate-400 font-medium">Pilot Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#070e22] border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Streamlined Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How Certified Drone Pilots Works
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              A secure, professional end-to-end framework built specifically for high-stakes commercial drone operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Companies */}
            <div className="p-8 rounded-3xl bg-[#0b132b] border border-slate-800/90 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Companies & Clients</h3>
                  <p className="text-xs text-slate-400">Hire certified pilots with zero guesswork</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Post Your Drone Project",
                    desc: "Specify industry, location, flight date, budget, and required drone payloads.",
                  },
                  {
                    step: "02",
                    title: "Review Matched Pilot Proposals",
                    desc: "Compare verified pilots with AI-assisted match scores, certifications, and reviews.",
                  },
                  {
                    step: "03",
                    title: "Select & Assign Pilot",
                    desc: "Lock in terms, review pre-flight specs, and track milestone progression.",
                  },
                  {
                    step: "04",
                    title: "Complete & Release Payment",
                    desc: "Verify flight deliverables, approve payment payout, and leave feedback.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                    <span className="text-sm font-mono font-bold text-cyan-400 px-2 py-1 rounded-lg bg-cyan-500/10">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Pilots */}
            <div className="p-8 rounded-3xl bg-[#0b132b] border border-slate-800/90 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Drone Pilots</h3>
                  <p className="text-xs text-slate-400">Get hired for high-value commercial missions</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Create Profile & Fleet Specs",
                    desc: "List your commercial drone hardware, sensors (RTK, Thermal, LiDAR), and skills.",
                  },
                  {
                    step: "02",
                    title: "Verify Aviation Certification",
                    desc: "Upload your Part 107 license. Receive admin verification and badge within hours.",
                  },
                  {
                    step: "03",
                    title: "Apply to High-Score Jobs",
                    desc: "Browse filtered industrial projects. Submit custom proposals and bids.",
                  },
                  {
                    step: "04",
                    title: "Fly & Receive Direct Earnings",
                    desc: "Execute missions safely, submit completion, and get paid with verified reviews.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                    <span className="text-sm font-mono font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#060b18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Supported Sectors
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Industrial Commercial Drone Services
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Certified pilots ready with specialized payloads, enterprise sensors, and regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg flex flex-col justify-between hover:border-cyan-500/40 transition group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${srv.color} flex items-center justify-center mb-5 border shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <Link
                      href={`/jobs?service=${srv.id}`}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition"
                    >
                      <span>Explore Jobs & Pilots</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#070e22] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                The Certified Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                Why Industry Leaders Trust Our Pilot Network
              </h2>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                Industrial flight operations require strict regulatory compliance, precision flight logs, and certified equipment. We eliminate risk by rigorously validating every operator.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "100% Verified Part 107 Credentials",
                    desc: "Every certificate is cross-checked against FAA records before any proposal can be submitted.",
                  },
                  {
                    title: "Precision Matching Engine",
                    desc: "Scored on exact equipment (LiDAR, RTK, Thermal), flight radius, and sector experience.",
                  },
                  {
                    title: "Escrow Milestone Payouts",
                    desc: "Funds are protected and paid promptly upon client satisfaction and data delivery.",
                  },
                  {
                    title: "Authentic Reviews & Flight Records",
                    desc: "Transparent client reviews tied to verified completed flight contracts.",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Glassmorphic Showcase */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1838] to-[#080e22] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Captain Marcus Vance</p>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      ✓ VERIFIED PART 107 PILOT
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                  98% Match
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Equipment Fleet</span>
                  <span className="text-white font-medium">DJI Matrice 350 RTK, Zenmuse H20T</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Flight Experience</span>
                  <span className="text-white font-medium">8+ Years (1,840 Hours)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Specialization</span>
                  <span className="text-white font-medium">Infrastructure & Thermal Inspection</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Client Rating</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    ★★★★★ 5.0 (42 reviews)
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">Current Status: <strong className="text-emerald-400 font-semibold">Available for Deployments</strong></span>
                <Link
                  href="/pilots"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#060b18]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0c142b] border border-slate-800/80"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/40 via-teal-900/30 to-slate-900/80 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Deploy or Fly Industrial Drone Operations?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join thousands of commercial pilots and industrial enterprises leveraging the most trusted commercial drone network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register?role=COMPANY"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition"
            >
              Post a Project as Company
            </Link>
            <Link
              href="/register?role=PILOT"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Register as Certified Pilot
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
