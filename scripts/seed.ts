import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/mongodb";
import { User } from "../models/User";
import { PilotProfile } from "../models/PilotProfile";
import { CompanyProfile } from "../models/CompanyProfile";
import { Certification } from "../models/Certification";
import { Job } from "../models/Job";
import { Application } from "../models/Application";
import { Payment } from "../models/Payment";
import { Review } from "../models/Review";
import { Notification } from "../models/Notification";

async function seed() {
  console.log("Connecting to database for seeding...");
  await connectToDatabase();

  console.log("Cleaning existing database collections...");
  await Promise.all([
    User.deleteMany({}),
    PilotProfile.deleteMany({}),
    CompanyProfile.deleteMany({}),
    Certification.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Payment.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const defaultPassword = "password123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const pilotPasswordHash = await bcrypt.hash("pilot123", 10);
  const companyPasswordHash = await bcrypt.hash("company123", 10);

  console.log("Seeding Admin user...");
  const admin = await User.create({
    name: "Aviation Administrator",
    email: "admin@example.com",
    passwordHash: adminPasswordHash,
    role: "ADMIN",
    phone: "+1 (800) 555-0199",
    location: { city: "Washington", state: "DC", country: "United States" },
    status: "ACTIVE",
  });

  console.log("Seeding Companies...");
  const companiesData = [
    {
      name: "Sarah Jenkins",
      email: "company@example.com",
      passwordHash: companyPasswordHash,
      companyName: "Skyline Infrastructure Audits",
      industry: "Infrastructure & Utilities",
      city: "Phoenix",
      state: "Arizona",
      desc: "Enterprise energy grid monitoring, bridge inspections, and high-voltage transmission analysis.",
    },
    {
      name: "David Chen",
      email: "chen@agrigrowth.com",
      passwordHash,
      companyName: "AgriGrowth Precision Farming",
      industry: "Agriculture & Forestry",
      city: "Sacramento",
      state: "California",
      desc: "Large-scale vineyard crop spraying, multispectral NDVI indexing, and automated irrigation audits.",
    },
    {
      name: "Elena Rostova",
      email: "elena@vertexmapping.com",
      passwordHash,
      companyName: "Vertex 3D Geospatial",
      industry: "Land Surveying & Mining",
      city: "Denver",
      state: "Colorado",
      desc: "Mining volumetrics, cut/fill calculation, and high-precision LiDAR topography.",
    },
    {
      name: "Marcus Sterling",
      email: "marcus@sterlingrealty.com",
      passwordHash,
      companyName: "Sterling Commercial Real Estate",
      industry: "Real Estate & Construction",
      city: "Austin",
      state: "Texas",
      desc: "Luxury commercial campus photogrammetry, cinematic flythroughs, and 3D architectural models.",
    },
    {
      name: "Rachel Thorne",
      email: "rachel@horizonbuilt.com",
      passwordHash,
      companyName: "Horizon Construction Management",
      industry: "Construction Monitoring",
      city: "Seattle",
      state: "Washington",
      desc: "Weekly site progression scanning, BIM overlay validation, and crane hazard compliance.",
    },
  ];

  const createdCompanies: any[] = [];
  for (const c of companiesData) {
    const user = await User.create({
      name: c.name,
      email: c.email,
      passwordHash: c.passwordHash,
      role: "COMPANY",
      phone: "+1 (555) 012-3456",
      location: { city: c.city, state: c.state, country: "United States" },
      status: "ACTIVE",
    });

    const profile = await CompanyProfile.create({
      userId: user._id,
      companyName: c.companyName,
      contactPerson: c.name,
      industry: c.industry,
      website: `https://${c.email.split("@")[1]}`,
      description: c.desc,
      rating: 4.9,
      totalReviews: 8,
    });

    createdCompanies.push({ user, profile });
  }

  console.log("Seeding Pilots & Certifications...");
  const pilotsData = [
    {
      name: "Alex Rivera (Verified Pilot)",
      email: "pilot@example.com",
      passwordHash: pilotPasswordHash,
      city: "Phoenix",
      state: "Arizona",
      experience: 7,
      rate: 110,
      skills: ["FAA Part 107", "FLIR Thermal Level 1", "RTK Photogrammetry", "LiDAR Survey"],
      specializations: ["Infrastructure Inspection", "Agricultural Spraying", "Real Estate Mapping"],
      equipment: ["DJI Matrice 350 RTK", "Zenmuse H20T Thermal", "DJI Mavic 3 Enterprise"],
      certStatus: "VERIFIED",
      certNumber: "FAA-4829104-COMM",
      certType: "FAA Part 107 Commercial Remote Pilot",
    },
    {
      name: "Jordan Hayes",
      email: "jordan@dronepilot.io",
      passwordHash,
      city: "Sacramento",
      state: "California",
      experience: 5,
      rate: 95,
      skills: ["Multispectral Imaging", "Agras Spraying", "Pix4D Fields", "NDVI Mapping"],
      specializations: ["Agricultural Spraying", "Land Surveying"],
      equipment: ["DJI Agras T40", "DJI Mavic 3 Multispectral", "Phantom 4 RTK"],
      certStatus: "VERIFIED",
      certNumber: "FAA-3910291-AGRI",
      certType: "FAA Part 107 Commercial Remote Pilot",
    },
    {
      name: "Maya Lin",
      email: "maya@skysurvey.com",
      passwordHash,
      city: "Denver",
      state: "Colorado",
      experience: 6,
      rate: 125,
      skills: ["LiDAR Point Clouds", "Volumetric Surveying", "AutoCAD Civil 3D", "RTK Base Station"],
      specializations: ["Land Surveying", "Construction Monitoring"],
      equipment: ["DJI Matrice 300 RTK", "Zenmuse L1 LiDAR", "DJI Zenmuse P1"],
      certStatus: "VERIFIED",
      certNumber: "FAA-5192039-SURV",
      certType: "FAA Part 107 Commercial Remote Pilot",
    },
    {
      name: "Derrick Cole",
      email: "derrick@flightpros.com",
      passwordHash,
      city: "Austin",
      state: "Texas",
      experience: 2,
      rate: 70,
      skills: ["8K Aerial Filming", "Real Estate Staging", "3D Matterport Tour"],
      specializations: ["Real Estate Mapping", "Aerial Photography"],
      equipment: ["DJI Inspire 3", "DJI Air 3"],
      certStatus: "PENDING", // Pending Admin Review
      certNumber: "FAA-PENDING-77182",
      certType: "FAA Part 107 Commercial Remote Pilot",
    },
    {
      name: "Tyler Vance",
      email: "tyler@aeroinspect.net",
      passwordHash,
      city: "Seattle",
      state: "Washington",
      experience: 3,
      rate: 80,
      skills: ["Roof Inspections", "Orthomosaic Mapping"],
      specializations: ["Construction Monitoring"],
      equipment: ["DJI Mavic 3 Pro"],
      certStatus: "REJECTED", // Rejected credential
      certNumber: "DOC-ILLEGIBLE-99",
      certType: "FAA Part 107 Commercial Remote Pilot",
    },
  ];

  const createdPilots: any[] = [];
  for (const p of pilotsData) {
    const user = await User.create({
      name: p.name,
      email: p.email,
      passwordHash: p.passwordHash,
      role: "PILOT",
      phone: "+1 (555) 987-6543",
      location: { city: p.city, state: p.state, country: "United States" },
      status: "ACTIVE",
    });

    const profile = await PilotProfile.create({
      userId: user._id,
      experience: p.experience,
      skills: p.skills,
      specializations: p.specializations,
      equipment: p.equipment,
      availability: "AVAILABLE",
      serviceAreas: [`${p.city}, ${p.state}`, "Regional Flight Radius 100mi"],
      rate: p.rate,
      rating: 4.9,
      totalReviews: 6,
      bio: `Certified commercial remote pilot specializing in ${p.specializations.join(" and ")} with ${p.experience} years of flight logs.`,
    });

    // Create certification record
    const cert = await Certification.create({
      pilotId: user._id,
      type: p.certType,
      number: p.certNumber,
      issueDate: new Date("2023-01-15"),
      expiryDate: new Date("2027-01-15"),
      documentUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
      status: p.certStatus,
      verifiedBy: p.certStatus === "VERIFIED" ? admin._id : undefined,
      verifiedAt: p.certStatus === "VERIFIED" ? new Date("2023-01-16") : undefined,
      rejectionReason: p.certStatus === "REJECTED" ? "Uploaded license document was blurry and license number was invalid." : "",
    });

    createdPilots.push({ user, profile, cert });
  }

  console.log("Seeding Jobs across all statuses...");
  const jobsData = [
    {
      companyIdx: 0,
      title: "High-Voltage Substation Thermal & Corona Discharge Inspection",
      serviceType: "INFRASTRUCTURE_INSPECTION",
      description: "Perform thermal infrared scan across 3 substation transformer banks and 8 transmission towers. High-resolution radiometric radiometric thermal JPGs and fault log required.",
      city: "Phoenix",
      state: "Arizona",
      budget: 3200,
      status: "OPEN",
      requiredEquipment: ["DJI Matrice 350 RTK", "Zenmuse H20T Thermal"],
      duration: "1 Day",
    },
    {
      companyIdx: 1,
      title: "1,200-Acre Vineyard Precision Organic Spraying & NDVI Indexing",
      serviceType: "AGRICULTURAL_SPRAYING",
      description: "Targeted organic fungicide distribution across 1,200 acres of high-density grape vines. Pre-flight multispectral NDVI mapping required to isolate fungal stress zones.",
      city: "Sacramento",
      state: "California",
      budget: 5400,
      status: "OPEN",
      requiredEquipment: ["DJI Agras T40", "DJI Mavic 3 Multispectral"],
      duration: "3 Days",
    },
    {
      companyIdx: 2,
      title: "Aggregate Quarry Cut-and-Fill Volumetric Topo Survey",
      serviceType: "LAND_SURVEYING",
      description: "Centimeter-accurate PPK LiDAR point cloud scan for 14 gravel stockpiles. Generate CAD contours, elevation heatmaps, and cubic yardage tonnage calculations.",
      city: "Denver",
      state: "Colorado",
      budget: 2800,
      status: "OPEN",
      requiredEquipment: ["Zenmuse L1 LiDAR", "DJI Matrice 300 RTK"],
      duration: "1 Day",
    },
    {
      companyIdx: 3,
      title: "Luxury Commercial Tech Campus 3D Digital Twin & Showcase",
      serviceType: "REAL_ESTATE_MAPPING",
      description: "Capture 8K cinematic marketing flythroughs and create textured 3D mesh model for a newly constructed 450,000 sq ft headquarters campus.",
      city: "Austin",
      state: "Texas",
      budget: 2500,
      status: "APPLICATIONS_RECEIVED",
      requiredEquipment: ["DJI Mavic 3 Pro", "DJI Inspire 3"],
      duration: "2 Days",
    },
    {
      companyIdx: 4,
      title: "Commercial High-Rise Structural Progression & Crane Clearance",
      serviceType: "CONSTRUCTION_MONITORING",
      description: "Weekly automated flight grid to monitor concrete pour stages and verify tower crane clearance envelope with BIM overlay integration.",
      city: "Seattle",
      state: "Washington",
      budget: 1800,
      status: "PILOT_SELECTED",
      assignedPilotIdx: 2,
      requiredEquipment: ["DJI Matrice 300 RTK"],
      duration: "1 Day",
    },
    {
      companyIdx: 0,
      title: "Wind Turbine Blade Leading-Edge Erosion Inspection",
      serviceType: "INFRASTRUCTURE_INSPECTION",
      description: "Telephoto zoom examination of 24 GE 1.7MW wind turbine blades to detect composite delamination and lightning strike puncture damage.",
      city: "Phoenix",
      state: "Arizona",
      budget: 4500,
      status: "IN_PROGRESS",
      assignedPilotIdx: 0,
      requiredEquipment: ["DJI Matrice 350 RTK", "Zenmuse H20T Thermal"],
      duration: "2 Days",
    },
    {
      companyIdx: 1,
      title: "Central Valley Almond Orchard Canopy Stress Mapping",
      serviceType: "AGRICULTURAL_SPRAYING",
      description: "Multispectral flight scan to analyze water stress and soil salinization before harvest season.",
      city: "Sacramento",
      state: "California",
      budget: 3100,
      status: "COMPLETED",
      assignedPilotIdx: 1,
      requiredEquipment: ["DJI Mavic 3 Multispectral"],
      duration: "2 Days",
    },
    {
      companyIdx: 3,
      title: "Downtown Austin High-Rise Glazing & Facade Inspection",
      serviceType: "REAL_ESTATE_MAPPING",
      description: "Facade safety inspection for 38-story residential high rise.",
      city: "Austin",
      state: "Texas",
      budget: 2200,
      status: "COMPLETED",
      assignedPilotIdx: 0,
      requiredEquipment: ["DJI Mavic 3 Enterprise"],
      duration: "1 Day",
    },
    {
      companyIdx: 2,
      title: "Highway 70 Overpass Post-Earthquake Structural Assessment",
      serviceType: "INFRASTRUCTURE_INSPECTION",
      description: "Emergency high-res bridge joint scan and crack measurement photogrammetry.",
      city: "Denver",
      state: "Colorado",
      budget: 3900,
      status: "COMPLETED",
      assignedPilotIdx: 2,
      requiredEquipment: ["DJI Matrice 300 RTK"],
      duration: "1 Day",
    },
    {
      companyIdx: 4,
      title: "Harbor Container Terminal Drone Surveillance & Mapping",
      serviceType: "OTHER",
      description: "Logistics terminal layout mapping and automated container inventory verification.",
      city: "Seattle",
      state: "Washington",
      budget: 2000,
      status: "CANCELLED",
      duration: "1 Day",
    },
  ];

  const createdJobs: any[] = [];
  for (const j of jobsData) {
    const company = createdCompanies[j.companyIdx];
    const assignedPilot = j.assignedPilotIdx !== undefined ? createdPilots[j.assignedPilotIdx].user : undefined;

    const job = await Job.create({
      companyId: company.user._id,
      title: j.title,
      serviceType: j.serviceType,
      description: j.description,
      location: {
        city: j.city,
        state: j.state,
        country: "United States",
        address: `${j.city} Commercial Site Area`,
      },
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startTime: "09:00 AM",
      duration: j.duration,
      budget: j.budget,
      requiredCertification: "FAA Part 107 Commercial Remote Pilot",
      requiredExperience: 2,
      requiredEquipment: j.requiredEquipment,
      requirements: [
        "FAA Part 107 License on file",
        "Pre-flight safety inspection log",
        "Deliverables in Cloud Drive within 48 hours",
      ],
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: j.status,
      assignedPilotId: assignedPilot ? assignedPilot._id : undefined,
    });

    createdJobs.push(job);
  }

  console.log("Seeding Applications...");
  // Pilot 0 applies to Job 3
  await Application.create({
    jobId: createdJobs[3]._id,
    pilotId: createdPilots[0].user._id,
    proposal: "We specialize in 3D digital twins and high-end commercial drone cinematography. We have completed over 40 tech campus scans using RTK ground control points.",
    bidAmount: 2450,
    availability: "Available on project date with backup aircraft",
    matchScore: 95,
    status: "PENDING",
  });

  // Pilot 1 applies to Job 0
  await Application.create({
    jobId: createdJobs[0]._id,
    pilotId: createdPilots[1].user._id,
    proposal: "Equipped with high-end thermal sensors and RTK GNSS receivers for utility inspections.",
    bidAmount: 3100,
    availability: "Full crew ready",
    matchScore: 88,
    status: "SHORTLISTED",
  });

  // Pilot 2 accepted for Job 4
  await Application.create({
    jobId: createdJobs[4]._id,
    pilotId: createdPilots[2].user._id,
    proposal: "Weekly BIM progress integration expert. We provide automated volume delta calculations.",
    bidAmount: 1800,
    availability: "Available every Monday morning",
    matchScore: 98,
    status: "ACCEPTED",
  });

  console.log("Seeding Payments for Completed Jobs...");
  // Completed Job 6 (Paid to Pilot 1)
  await Payment.create({
    jobId: createdJobs[6]._id,
    companyId: createdCompanies[1].user._id,
    pilotId: createdPilots[1].user._id,
    amount: 3100,
    status: "PAID",
    transactionId: `TXN-DRN-SEED-${Date.now()}-1`,
    notes: "Approved payment for orchard multispectral scan.",
  });

  // Completed Job 7 (Paid to Pilot 0)
  await Payment.create({
    jobId: createdJobs[7]._id,
    companyId: createdCompanies[3].user._id,
    pilotId: createdPilots[0].user._id,
    amount: 2200,
    status: "PAID",
    transactionId: `TXN-DRN-SEED-${Date.now()}-2`,
    notes: "High-rise glazing inspection contract completion payout.",
  });

  // Completed Job 8 (Paid to Pilot 2)
  await Payment.create({
    jobId: createdJobs[8]._id,
    companyId: createdCompanies[2].user._id,
    pilotId: createdPilots[2].user._id,
    amount: 3900,
    status: "PAID",
    transactionId: `TXN-DRN-SEED-${Date.now()}-3`,
    notes: "Emergency bridge structure survey payout.",
  });

  console.log("Seeding Reviews...");
  await Review.create({
    jobId: createdJobs[7]._id,
    reviewerId: createdCompanies[3].user._id,
    revieweeId: createdPilots[0].user._id,
    rating: 5,
    comment: "Alex delivered phenomenal high-resolution facade scans. Precision flight within tight downtown corridors without any safety issues.",
  });

  await Review.create({
    jobId: createdJobs[6]._id,
    reviewerId: createdCompanies[1].user._id,
    revieweeId: createdPilots[1].user._id,
    rating: 5,
    comment: "Jordan's multispectral NDVI maps identified our vineyard irrigation leaks within 24 hours. Saved us thousands in crop yield.",
  });

  console.log("Seeding In-App Notifications...");
  await Notification.create({
    userId: createdPilots[0].user._id,
    title: "Payment Received! 💰",
    message: "You received a payout of $2,200 for completing the Downtown Austin Facade Inspection.",
    type: "PAYMENT",
    link: "/pilot/earnings",
    read: false,
  });

  await Notification.create({
    userId: createdCompanies[0].user._id,
    title: "New Job Proposal Received",
    message: "Alex Rivera submitted a 95% match proposal for your substation thermal inspection.",
    type: "APPLICATION",
    link: `/company/applications?jobId=${createdJobs[0]._id}`,
    read: false,
  });

  await Notification.create({
    userId: admin._id,
    title: "New Pilot Certification Uploaded",
    message: "Derrick Cole uploaded FAA Part 107 credentials awaiting review.",
    type: "CERTIFICATION",
    link: "/admin/certifications",
    read: false,
  });

  console.log("\n============================================================");
  console.log("✅ SEED DATA COMPLETED SUCCESSFULLY!");
  console.log("============================================================");
  console.log("DEMO ACCOUNTS:");
  console.log("1. ADMIN:   admin@example.com   / admin123");
  console.log("2. PILOT:   pilot@example.com   / pilot123 (Verified Part 107)");
  console.log("3. COMPANY: company@example.com / company123");
  console.log("============================================================\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
