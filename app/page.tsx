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
  ArrowUpRight,
  FileText,
  CalendarCheck,
  CreditCard,
  UserCheck,
  Briefcase,
  Send,
  Clock,
  Sparkles,
  Zap,
  Wallet,
  Headphones,
  HelpCircle,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Heart,
  Building,
  Film,
  Sprout,
  Map,
  Compass,
  Palmtree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/shared/ScrollReveal";


/**
 * Smooth emerging scroll section component.
 * Animates into view smoothly when scrolled down, and repeats on scroll up.
 */
function ScrollSection({
  children,
  className = "",
  id,
  initialVisible = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  initialVisible?: boolean;
}) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(initialVisible);

  React.useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "relative w-full transition-all duration-700 ease-out will-change-[transform,opacity]",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * Staggered emerging card component for grid items.
 */
function ScrollCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "transition-all duration-700 ease-out will-change-[transform,opacity] h-full",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-7 scale-[0.98]",
        className
      )}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Exact 7 visual category cards + 1 yellow custom brief card matching Pilotbase reference
  const categories = [
    {
      id: "AERIAL_PHOTOGRAPHY",
      title: "Weddings & Events",
      icon: Heart,
      bgImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=AERIAL_PHOTOGRAPHY",
    },
    {
      id: "REAL_ESTATE_MAPPING",
      title: "Real Estate",
      icon: Building,
      bgImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=REAL_ESTATE_MAPPING",
    },
    {
      id: "FILM_PRODUCTION",
      title: "Film & Production",
      icon: Film,
      bgImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=AERIAL_PHOTOGRAPHY",
    },
    {
      id: "AGRICULTURAL_SPRAYING",
      title: "Agriculture",
      icon: Sprout,
      bgImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=AGRICULTURAL_SPRAYING",
    },
    {
      id: "LAND_SURVEYING",
      title: "Surveying & Mapping",
      icon: Map,
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=LAND_SURVEYING",
    },
    {
      id: "INFRASTRUCTURE_INSPECTION",
      title: "Inspection",
      icon: Compass,
      bgImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=INFRASTRUCTURE_INSPECTION",
    },
    {
      id: "TOURISM_RESORTS",
      title: "Tourism & Resorts",
      icon: Palmtree,
      bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      href: "/jobs?service=AERIAL_PHOTOGRAPHY",
    },
  ];

  const faqs = [
    {
      category: "clients",
      q: "How does pilot credential & license verification work?",
      a: "Every pilot on AeroLink undergoes strict credential verification. We validate their official FAA Part 107 Commercial Remote Pilot License against federal airmen registries, confirm active Certificate of Insurance (COI) coverage, and verify government-issued ID before they can accept bookings.",
    },
    {
      category: "escrow",
      q: "How does milestone escrow protect my payment?",
      a: "When you book a shoot, your payment is held securely in an underwritten escrow account. Funds are never released to the pilot until you have reviewed and approved the delivered footage or sensor data, eliminating financial risk for both parties.",
    },
    {
      category: "clients",
      q: "How quickly will I receive proposals after posting a brief?",
      a: "Most briefs receive qualified pilot matches within minutes. Our automated matching algorithm immediately notifies certified pilots in your target city matching your required camera or payload specifications, with full proposals typically arriving in under 2 hours.",
    },
    {
      category: "pilots",
      q: "How do pilots get paid and what are the payout timelines?",
      a: "Once the client reviews and accepts your uploaded deliverables, escrow funds are automatically initiated for disbursement directly to your verified bank account within 24 to 48 hours. Zero chasing invoices or late client payments.",
    },
    {
      category: "pilots",
      q: "What equipment, airframes, and sensor payloads are supported?",
      a: "AeroLink supports everything from high-end cinematography setups (Inspire 3, RED, ARRI, Sony FX) and standard commercial rigs (DJI Mavic 3 Pro/Enterprise) to specialized industrial hardware including radiometric thermal cameras, LiDAR sensors, and agricultural dispersal airframes (DJI Agras T40).",
    },
    {
      category: "clients",
      q: "What happens if adverse weather prevents flying on the shoot date?",
      a: "If weather conditions exceed legal flight minimums or safety thresholds (such as high winds or rain), the shoot can be rescheduled without penalty with your pilot. Both parties coordinate alternative dates directly through our booking calendar, and escrow funds remain safeguarded.",
    },
    {
      category: "pilots",
      q: "Is it free to join AeroLink as a pilot?",
      a: "Yes, joining AeroLink and listing your pilot profile, gear kit, flight reel, and certifications is 100% free. You only pay a competitive platform fee when you successfully win and complete paid missions.",
    },
  ];

  const filteredFaqs = faqCategory === "all" ? faqs : faqs.filter((f) => f.category === faqCategory);

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground transition-colors duration-150">
      
      {/* Split-Screen Hero Section (Text Left, Video Right) */}
      <ScrollSection initialVisible={true} className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-border dark:border-zinc-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Narrative, CTAs, Metrics */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs font-medium text-foreground shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  FAA Part 107 Certified
                </span>
              </div>

              {/* Display Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
                Connecting Industries with Certified Drone Pilots.
              </h1>

              {/* Sub-narrative */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Discover verified commercial drone pilots for infrastructure inspections, precision agriculture, construction monitoring, and aerial surveying. One platform. Every mission.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="primary" className="group h-12 px-7 rounded-full shadow-md font-semibold text-sm">
                  <Link href="/company/post-job" className="gap-2">
                    <span>Post a Mission</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="secondary" className="group h-12 px-7 rounded-full border border-border dark:border-zinc-800 font-semibold text-sm">
                  <Link href="/pilots" className="gap-2">
                    <span>Explore Pilots</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>

              {/* Trust Metrics Row */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border/80 dark:border-zinc-800/80 mt-4 max-w-lg">
                <div className="space-y-0.5">
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">100%</p>
                  <p className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">FAA Part 107</p>
                </div>
                <div className="space-y-0.5 border-l border-border dark:border-zinc-800 pl-3 sm:pl-4">
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">&lt; 1.5 cm</p>
                  <p className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">RTK Accuracy</p>
                </div>
                <div className="space-y-0.5 border-l border-border dark:border-zinc-800 pl-3 sm:pl-4">
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">$5.0M</p>
                  <p className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">COI Insured</p>
                </div>
              </div>

            </div>

            {/* Right Column: Split-Screen Hero Video Container */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-zinc-950 shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full group">
                
                {/* Background Video */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  defaultMuted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Subtle Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-medium shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#fabf28] animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      Live UAV Operations
                    </span>
                  </div>
                </div>

                {/* Floating Bottom Metadata & Audio Toggle */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3">
                  <div className="px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs">
                    <p className="font-semibold text-[11px] text-white">4K Commercial Flight Reel</p>
                    <p className="text-[10px] text-zinc-300 font-mono">Aerial Survey • Thermography • Production</p>
                  </div>

                  {/* Audio Mute/Unmute Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
                    className="w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md"
                  >
                    {isVideoMuted ? (
                      <VolumeX className="w-4 h-4 text-zinc-300" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#fabf28]" />
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </ScrollSection>

      {/* Reference Section: Find pilots for every shoot */}
      <ScrollSection id="services" className="py-16 sm:py-24 bg-background border-b border-border dark:border-zinc-800 transition-colors">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.03em] text-foreground leading-tight">
              Find pilots for every shoot
            </h2>
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <span>Browse all categories</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* 8-Card Grid: 7 Visual Image Cards + 1 Yellow Custom Brief Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <ScrollCard key={cat.title} delay={(idx % 4) * 80}>
                  <Link
                    href={cat.href}
                    className="group relative h-[360px] sm:h-[420px] md:h-[460px] lg:h-[480px] xl:h-[500px] rounded-[28px] overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-7 lg:p-8 select-none block w-full"
                  >
                    {/* Photo Background with subtle scale zoom */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${cat.bgImage})` }}
                    />
                    
                    {/* Cinematic dark scrim overlays for text readability in both dark and light themes */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Content Pill at Bottom */}
                    <div className="relative z-10 flex items-center gap-2.5 text-white">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 group-hover:border-white/50 group-hover:scale-105 transition-all shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                        {cat.title}
                      </span>
                    </div>
                  </Link>
                </ScrollCard>
              );
            })}

            {/* 8th Card: Bold Yellow 'Post a custom brief' Card matching the reference exactly */}
            <ScrollCard delay={3 * 80}>
              <Link
                href="/company/post-job"
                className="group relative h-[360px] sm:h-[420px] md:h-[460px] lg:h-[480px] xl:h-[500px] rounded-[28px] overflow-hidden bg-[#fabf28] text-zinc-950 p-7 sm:p-8 lg:p-9 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:brightness-105 shadow-xs select-none block w-full"
              >
                {/* Top 'NOT SURE?' Tag */}
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-950 border border-black/10">
                    NOT SURE?
                  </span>
                </div>

                {/* Bottom Content & Arrow */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-950 leading-tight">
                      Post a custom brief
                    </h3>
                    <p className="text-sm text-zinc-850 leading-relaxed font-medium">
                      Describe your shoot or mission. We&apos;ll match verified pilots in 2 hours.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-950 pt-1 group-hover:gap-2.5 transition-all">
                    <span>Start brief</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </ScrollCard>
          </div>

        </div>
      </ScrollSection>

      {/* How it works - Two paths, one platform */}
      <ScrollSection id="how-it-works" className="py-20 sm:py-28 bg-background border-b border-border dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-12 sm:mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[2px] bg-[#fabf28]" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#fabf28]">
                HOW IT WORKS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.035em] text-foreground leading-[1.08]">
              Two paths, one platform.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Whether you need footage flown or you&apos;re the one flying it — we handle the boring stuff so the right people find each other faster.
            </p>
          </div>

          {/* Two-Column Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            
            {/* Left Card: FOR CLIENTS (Bold Pilotbase Yellow Theme) */}
            <ScrollCard delay={80}>
            <div className="rounded-3xl bg-[#fabf28] text-zinc-950 p-7 sm:p-9 flex flex-col justify-between shadow-lg select-none h-full">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-800 block mb-2">
                  FOR CLIENTS
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 leading-tight mb-8">
                  Need a shoot? Brief us.
                </h3>

                {/* 2x2 Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                  
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-black/[0.07] border border-black/[0.08] flex items-start gap-3 transition-colors hover:bg-black/[0.1]">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 text-[#fabf28] flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 block">
                        STEP 1
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 leading-tight mt-0.5">
                        Post a brief
                      </h4>
                      <p className="text-[11px] text-zinc-800 leading-snug mt-1 font-medium">
                        Describe the shoot, date, and budget — 60 seconds.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-black/[0.07] border border-black/[0.08] flex items-start gap-3 transition-colors hover:bg-black/[0.1]">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 text-[#fabf28] flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 block">
                        STEP 2
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 leading-tight mt-0.5">
                        Get matched
                      </h4>
                      <p className="text-[11px] text-zinc-800 leading-snug mt-1 font-medium">
                        AI ranks pilots by city, kit, and category in minutes.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-black/[0.07] border border-black/[0.08] flex items-start gap-3 transition-colors hover:bg-black/[0.1]">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 text-[#fabf28] flex items-center justify-center shrink-0 shadow-xs">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 block">
                        STEP 3
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 leading-tight mt-0.5">
                        Book & brief
                      </h4>
                      <p className="text-[11px] text-zinc-800 leading-snug mt-1 font-medium">
                        Confirm a date, share refs, sign with one tap.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl bg-black/[0.07] border border-black/[0.08] flex items-start gap-3 transition-colors hover:bg-black/[0.1]">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 text-[#fabf28] flex items-center justify-center shrink-0 shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 block">
                        STEP 4
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 leading-tight mt-0.5">
                        Pay on delivery
                      </h4>
                      <p className="text-[11px] text-zinc-800 leading-snug mt-1 font-medium">
                        Escrow protects you until you accept the footage.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href="/company/post-job"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-bold tracking-tight shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Post a brief</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
            </ScrollCard>

            {/* Right Card: FOR PILOTS (Pitch Obsidian Charcoal Theme) */}
            <ScrollCard delay={160}>
            <div className="rounded-3xl bg-[#111111] dark:bg-[#161b22] border border-zinc-800/80 text-white p-7 sm:p-9 flex flex-col justify-between shadow-lg select-none h-full">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400 block mb-2">
                  FOR PILOTS
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight mb-8">
                  Fly for a living.
                </h3>

                {/* 2x2 Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                  
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3 transition-colors hover:bg-zinc-850 hover:border-zinc-700">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                        STEP 1
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                        Apply free
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1 font-normal">
                        Verify ID, DGCA, kit, and insurance. Takes 10 minutes.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3 transition-colors hover:bg-zinc-850 hover:border-zinc-700">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Briefcase className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                        STEP 2
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                        Browse live jobs
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1 font-normal">
                        Filter by city, day rate, and category — instant alerts.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3 transition-colors hover:bg-zinc-850 hover:border-zinc-700">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Send className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                        STEP 3
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                        Pitch & win
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1 font-normal">
                        Send a proposal with price, timeline, and reel.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3 transition-colors hover:bg-zinc-850 hover:border-zinc-700">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                        STEP 4
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                        Get paid
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1 font-normal">
                        Receive escrow payouts within 48 hours of delivery.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href="/register?role=PILOT"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fabf28] text-zinc-950 hover:bg-[#e6ae22] text-xs font-bold tracking-tight shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Join as a pilot</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
            </ScrollCard>

          </div>

        </div>
      </ScrollSection>

      {/* Why AeroLink / Core Value Proposition */}
      <ScrollSection id="why-aerolink" className="py-20 sm:py-28 bg-background border-b border-border/80 dark:border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#fabf28] font-bold text-base leading-none">—</span>
                  <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                    WHY AEROLINK
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.12]">
                  Built for serious work, <br className="hidden sm:inline" />
                  from the air down.
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground mt-5 leading-relaxed">
                  We obsess over the boring stuff — permits, paperwork, insurance — so creators can focus on the frame, and clients can focus on the story.
                </p>
              </div>

              {/* Horizontal Divider and Metrics */}
              <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-8 mt-10 sm:mt-12">
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-sans">
                      500+
                    </div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                      PILOTS
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-sans">
                      42
                    </div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                      CITIES
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-sans">
                      12,000+
                    </div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                      SHOOTS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2x2 Feature Cards Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Card 1: Verified & insured */}
                <ScrollCard delay={60}>
                  <div className="rounded-3xl border border-border/80 dark:border-zinc-800 bg-white dark:bg-[#161b22] p-7 sm:p-8 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-start h-full">
                    <div className="mb-4 text-[#fabf28]">
                      <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
                      Verified & insured
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                      Every pilot is DGCA-aware, ID-verified, and insurance-backed.
                    </p>
                  </div>
                </ScrollCard>

                {/* Card 2: Fast matching */}
                <ScrollCard delay={120}>
                  <div className="rounded-3xl border border-border/80 dark:border-zinc-800 bg-white dark:bg-[#161b22] p-7 sm:p-8 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-start h-full">
                    <div className="mb-4 text-[#fabf28]">
                      <Zap className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
                      Fast matching
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                      AI-matched to your brief in minutes, not days.
                    </p>
                  </div>
                </ScrollCard>

                {/* Card 3: Transparent pricing */}
                <ScrollCard delay={180}>
                  <div className="rounded-3xl border border-border/80 dark:border-zinc-800 bg-white dark:bg-[#161b22] p-7 sm:p-8 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-start h-full">
                    <div className="mb-4 text-[#fabf28]">
                      <Wallet className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
                      Transparent pricing
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                      Flat day rates, milestone escrow, zero surprises.
                    </p>
                  </div>
                </ScrollCard>

                {/* Card 4: Concierge support */}
                <ScrollCard delay={240}>
                  <div className="rounded-3xl border border-border/80 dark:border-zinc-800 bg-white dark:bg-[#161b22] p-7 sm:p-8 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-start h-full">
                    <div className="mb-4 text-[#fabf28]">
                      <Headphones className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
                      Concierge support
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                      A real human producer on every booking.
                    </p>
                  </div>
                </ScrollCard>

              </div>
            </div>

          </div>
        </div>
      </ScrollSection>

      {/* FAQ Section with Pilotbase Design Aesthetic */}
      <ScrollSection id="faq" className="py-20 sm:py-28 bg-background dark:bg-[#0d1117] border-b border-border dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[#fabf28] font-bold text-base leading-none">—</span>
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
              Got questions? <br className="hidden sm:inline" />
              We&apos;ve got answers.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Everything you need to know about booking shoots, pilot verification, equipment compliance, and milestone escrow protection.
            </p>

            {/* Quick Filter Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {[
                { id: "all", label: "All Questions" },
                { id: "clients", label: "For Clients" },
                { id: "pilots", label: "For Pilots" },
                { id: "escrow", label: "Trust & Escrow" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFaqCategory(tab.id);
                    setOpenFaq(0);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 ${
                    faqCategory === tab.id
                      ? "bg-[#fabf28] text-zinc-950 shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-900 text-muted-foreground hover:text-foreground border border-border/80 dark:border-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5 sm:space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-zinc-400 dark:border-zinc-650 bg-white dark:bg-[#161b22] shadow-sm"
                      : "border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161b22] hover:border-zinc-350 dark:hover:border-zinc-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
                  >
                    <span className="font-bold text-sm sm:text-base text-foreground tracking-tight pr-4 leading-snug">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen
                          ? "bg-[#fabf28] text-zinc-950 shadow-xs rotate-180"
                          : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground group-hover:text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Concierge Help Card at Bottom */}
          <div className="mt-12 sm:mt-16 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161b22] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#fabf28]/15 text-[#fabf28] flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground tracking-tight">
                  Still have questions?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  Our concierge team is available around the clock to help scope briefs or onboard your aircraft.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/company/post-job"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-100 text-xs font-bold tracking-tight shadow-xs transition-all active:scale-[0.98]"
              >
                <span>Post a brief</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </ScrollSection>

      {/* Call to Action Section (Pilotbase Style) */}
      <ScrollSection id="get-started" className="py-20 sm:py-28 bg-background border-b border-border/80 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-[#fabf28] font-bold text-base leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              GET STARTED TODAY
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground leading-[1.08]">
            Your next shoot is <br /><span className="italic font-light">a tap away.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Join 500+ verified pilots and the businesses they fly for. Free to list, free to brief.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button asChild size="lg" className="group h-12 px-8 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-100 shadow-md font-semibold text-xs tracking-tight">
              <Link href="/company/post-job" className="gap-2">
                <span>I&apos;m Hiring a Pilot</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" className="group h-12 px-8 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 shadow-md font-bold text-xs tracking-tight">
              <Link href="/register?role=PILOT" className="gap-2">
                <span>I&apos;m a Drone Pilot</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </ScrollSection>

      <Footer />
    </div>
  );
}
