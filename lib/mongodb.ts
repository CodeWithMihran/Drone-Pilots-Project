import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, memoryServer: null, seeded: false };
}

async function autoSeedInMemory() {
  if (cached.seeded) return;
  cached.seeded = true;
  try {
    // Dynamically import seed function to avoid circular dependencies
    const bcrypt = await import("bcryptjs");
    const { User } = await import("@/models/User");
    const { PilotProfile } = await import("@/models/PilotProfile");
    const { CompanyProfile } = await import("@/models/CompanyProfile");
    const { Certification } = await import("@/models/Certification");
    const { Job } = await import("@/models/Job");
    const { Application } = await import("@/models/Application");
    const { Payment } = await import("@/models/Payment");
    const { Review } = await import("@/models/Review");
    const { Notification } = await import("@/models/Notification");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) return; // Already seeded

    console.log("Auto-seeding in-memory database...");

    const adminHash = await bcrypt.default.hash("admin123", 10);
    const pilotHash = await bcrypt.default.hash("pilot123", 10);
    const companyHash = await bcrypt.default.hash("company123", 10);

    // Create admin
    const admin = await User.create({
      name: "Platform Admin",
      email: "admin@example.com",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "+1 (555) 000-0001",
      location: { city: "Washington", state: "DC", country: "United States" },
      status: "ACTIVE",
    });

    // Create pilot user
    const pilotUser = await User.create({
      name: "Alex Rivera",
      email: "pilot@example.com",
      passwordHash: pilotHash,
      role: "PILOT",
      phone: "+1 (555) 100-2001",
      location: { city: "Austin", state: "Texas", country: "United States" },
      status: "ACTIVE",
    });

    await PilotProfile.create({
      userId: pilotUser._id,
      experience: 5,
      skills: ["Commercial Drone Pilot", "Aerial Mapping", "Thermal Imaging", "LiDAR Scanning", "Agricultural Spraying"],
      specializations: ["Infrastructure Inspection", "Agricultural Spraying", "Land Surveying"],
      equipment: ["DJI Matrice 350 RTK", "DJI Mavic 3 Enterprise", "Autel EVO II Pro", "Freefly Alta X"],
      availability: "AVAILABLE",
      serviceAreas: ["Austin, Texas", "Houston, Texas", "San Antonio, Texas"],
      rate: 125,
      rating: 4.8,
      totalReviews: 12,
      bio: "FAA Part 107 certified commercial drone operator with 5+ years in infrastructure inspection and precision agriculture.",
    });

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 2);
    const issue = new Date();
    issue.setFullYear(issue.getFullYear() - 1);

    const cert = await Certification.create({
      pilotId: pilotUser._id,
      type: "FAA Part 107 Commercial Remote Pilot",
      number: "FA3107-2024-001",
      issueDate: issue,
      expiryDate: expiry,
      documentUrl: "https://placehold.co/800x600/0b132b/06b6d4?text=FAA+Part+107+Certificate",
      status: "VERIFIED",
      verifiedAt: new Date(),
      verifiedBy: admin._id,
    });

    // Create extra pilots
    const pilots = [];
    const pilotData = [
      { name: "Sarah Chen", email: "sarah.chen@droneops.com", city: "Denver", state: "Colorado", exp: 3, rate: 95 },
      { name: "Marcus Johnson", email: "marcus.j@skyops.com", city: "Phoenix", state: "Arizona", exp: 7, rate: 150 },
      { name: "Emily Torres", email: "emily.torres@aerotech.com", city: "Miami", state: "Florida", exp: 2, rate: 80 },
    ];
    for (const pd of pilotData) {
      const pu = await User.create({
        name: pd.name,
        email: pd.email,
        passwordHash: pilotHash,
        role: "PILOT",
        phone: "+1 (555) 200-0001",
        location: { city: pd.city, state: pd.state, country: "United States" },
        status: "ACTIVE",
      });
      await PilotProfile.create({
        userId: pu._id,
        experience: pd.exp,
        skills: ["Commercial Drone Pilot", "Aerial Photography"],
        specializations: ["Aerial Photography", "Real Estate Mapping"],
        equipment: ["DJI Mavic 3 Pro", "DJI Air 3"],
        availability: "AVAILABLE",
        serviceAreas: [`${pd.city}, ${pd.state}`],
        rate: pd.rate,
        rating: 4.5,
        totalReviews: 5,
        bio: `Certified commercial drone pilot based in ${pd.city}, ${pd.state}.`,
      });
      const e2 = new Date(); e2.setFullYear(e2.getFullYear() + 1);
      const i2 = new Date(); i2.setFullYear(i2.getFullYear() - 1);
      await Certification.create({
        pilotId: pu._id,
        type: "FAA Part 107 Commercial Remote Pilot",
        number: `FA3107-2024-00${Math.floor(Math.random() * 900) + 100}`,
        issueDate: i2,
        expiryDate: e2,
        documentUrl: "https://placehold.co/800x600/0b132b/06b6d4?text=FAA+Part+107+Certificate",
        status: "VERIFIED",
        verifiedAt: new Date(),
        verifiedBy: admin._id,
      });
      pilots.push(pu);
    }

    // Create company user
    const companyUser = await User.create({
      name: "Sarah Jenkins",
      email: "company@example.com",
      passwordHash: companyHash,
      role: "COMPANY",
      phone: "+1 (555) 300-4001",
      location: { city: "Dallas", state: "Texas", country: "United States" },
      status: "ACTIVE",
    });

    await CompanyProfile.create({
      userId: companyUser._id,
      companyName: "Skyline Industrial Corp",
      contactPerson: "Sarah Jenkins",
      industry: "Infrastructure & Utilities",
      website: "https://skylineindustrial.com",
      description: "Leading industrial infrastructure firm specializing in power grid inspection and pipeline monitoring.",
      rating: 4.7,
      totalReviews: 8,
    });

    // More companies
    const companies = [];
    const companyData = [
      { name: "Farmland Solutions Inc", email: "info@farmlandsolutions.com", industry: "Agriculture & Forestry", city: "Des Moines", state: "Iowa" },
      { name: "BuildRight Construction", email: "contact@buildright.com", industry: "Real Estate & Construction", city: "Chicago", state: "Illinois" },
    ];
    for (const cd of companyData) {
      const cu = await User.create({
        name: cd.name,
        email: cd.email,
        passwordHash: companyHash,
        role: "COMPANY",
        phone: "+1 (555) 400-0001",
        location: { city: cd.city, state: cd.state, country: "United States" },
        status: "ACTIVE",
      });
      await CompanyProfile.create({
        userId: cu._id,
        companyName: cd.name,
        contactPerson: cd.name,
        industry: cd.industry,
        website: "",
        description: `Commercial drone services buyer based in ${cd.city}, ${cd.state}.`,
        rating: 4.4,
        totalReviews: 3,
      });
      companies.push(cu);
    }

    // Create jobs
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
    const deadline = new Date(); deadline.setDate(deadline.getDate() + 14);
    const pastDate = new Date(); pastDate.setDate(pastDate.getDate() - 30);

    const jobsData = [
      {
        companyId: companyUser._id,
        title: "Pipeline Infrastructure Aerial Inspection - West Texas",
        serviceType: "INFRASTRUCTURE_INSPECTION",
        description: "Comprehensive thermal and visual drone inspection of 45 miles of gas pipeline infrastructure across West Texas. Pilot must have thermal imaging capability and experience with industrial inspection reporting.",
        location: { city: "Austin", state: "Texas", country: "United States", address: "I-35 Corridor, North Austin" },
        date: nextWeek,
        startTime: "07:00 AM",
        duration: "3 Days",
        budget: 4500,
        requiredCertification: "FAA Part 107 Commercial Remote Pilot",
        requiredExperience: 3,
        requiredEquipment: ["DJI Matrice 350 RTK", "Thermal Camera Payload"],
        requirements: ["Thermal imaging capability", "Industrial inspection experience", "Deliverables within 48hrs"],
        applicationDeadline: deadline,
        status: "OPEN",
      },
      {
        companyId: companies[0]._id,
        title: "Precision Agricultural Crop Analysis - Spring Season",
        serviceType: "AGRICULTURAL_SPRAYING",
        description: "NDVI mapping and multispectral analysis for 800 acres of corn and soybean fields. Looking for experienced agricultural drone operators with multispectral sensing capabilities.",
        location: { city: "Des Moines", state: "Iowa", country: "United States", address: "Rural Route 4, Polk County" },
        date: nextWeek,
        startTime: "06:30 AM",
        duration: "5 Days",
        budget: 6200,
        requiredCertification: "FAA Part 107 Commercial Remote Pilot",
        requiredExperience: 2,
        requiredEquipment: ["Multispectral Camera", "Agricultural Drone"],
        requirements: ["NDVI analysis capability", "Spray mapping data delivery", "Crop health report"],
        applicationDeadline: deadline,
        status: "OPEN",
      },
      {
        companyId: companies[1]._id,
        title: "Construction Progress Monitoring - Downtown High-Rise",
        serviceType: "CONSTRUCTION_MONITORING",
        description: "Weekly aerial photogrammetry and 3D mapping for a 45-story mixed-use development. Pilot must provide weekly progress reports and deliverables in standard construction formats.",
        location: { city: "Chicago", state: "Illinois", country: "United States", address: "123 N Michigan Ave, Chicago" },
        date: tomorrow,
        startTime: "09:00 AM",
        duration: "6 Months (Weekly)",
        budget: 2800,
        requiredCertification: "FAA Part 107 Commercial Remote Pilot",
        requiredExperience: 2,
        requiredEquipment: ["DJI Mavic 3 Enterprise", "RTK GPS Module"],
        requirements: ["3D photogrammetry", "Weekly deliverables", "BIM format exports"],
        applicationDeadline: deadline,
        status: "OPEN",
      },
      {
        companyId: companyUser._id,
        title: "Solar Farm Annual Inspection - South Texas",
        serviceType: "INFRASTRUCTURE_INSPECTION",
        description: "Full thermal inspection of 15,000 solar panels at a 50MW solar installation. Looking for pilots with experience in PV panel thermal imaging and anomaly detection.",
        location: { city: "San Antonio", state: "Texas", country: "United States" },
        date: nextWeek,
        startTime: "08:00 AM",
        duration: "2 Days",
        budget: 3200,
        requiredCertification: "FAA Part 107 Commercial Remote Pilot",
        requiredExperience: 3,
        requiredEquipment: ["Thermal Camera Payload", "DJI Matrice 350 RTK"],
        requirements: ["PV panel thermal inspection", "Anomaly mapping", "Diagnostic report"],
        applicationDeadline: deadline,
        status: "APPLICATIONS_RECEIVED",
        assignedPilotId: pilotUser._id,
      },
      {
        companyId: companyUser._id,
        title: "Real Estate Aerial Photography Package - Luxury Estates",
        serviceType: "REAL_ESTATE_MAPPING",
        description: "High-quality aerial photography and video for 5 luxury properties in the Austin Hill Country. Need pilot with cinematic skills and experience in real estate aerial content.",
        location: { city: "Austin", state: "Texas", country: "United States" },
        date: tomorrow,
        startTime: "08:00 AM",
        duration: "1 Day",
        budget: 1200,
        requiredCertification: "FAA Part 107 Commercial Remote Pilot",
        requiredExperience: 1,
        requiredEquipment: ["DJI Mavic 3 Pro", "ND Filters Kit"],
        requirements: ["4K video delivery", "RAW photo files", "48hr turnaround"],
        applicationDeadline: deadline,
        status: "OPEN",
      },
    ];

    const createdJobs = [];
    for (const jd of jobsData) {
      const job = await Job.create(jd);
      createdJobs.push(job);
    }

    // Create applications from main pilot
    const app1 = await Application.create({
      jobId: createdJobs[0]._id,
      pilotId: pilotUser._id,
      proposal: "I have 5 years of infrastructure inspection experience with DJI Matrice 350 RTK and thermal imaging payloads. I've completed 3 similar pipeline inspection contracts and can deliver detailed thermal reports within 24 hours.",
      bidAmount: 4200,
      availability: "Available from next Monday, can complete within the 3-day window.",
      status: "SHORTLISTED",
      matchScore: 92,
    });

    const app2 = await Application.create({
      jobId: createdJobs[1]._id,
      pilotId: pilotUser._id,
      proposal: "Experienced in agricultural drone operations with multispectral sensing. I own a Parrot Sequoia+ sensor and have experience processing NDVI data for crop analysis.",
      bidAmount: 5800,
      availability: "Available this week, can start immediately.",
      status: "PENDING",
      matchScore: 78,
    });

    // Completed job + payment for pilot
    const completedJob = await Job.create({
      companyId: companyUser._id,
      title: "Bridge Safety Inspection - Colorado River",
      serviceType: "INFRASTRUCTURE_INSPECTION",
      description: "Annual structural safety inspection using drones with LiDAR and visual cameras.",
      location: { city: "Austin", state: "Texas", country: "United States" },
      date: pastDate,
      startTime: "07:00 AM",
      duration: "2 Days",
      budget: 3800,
      requiredCertification: "FAA Part 107 Commercial Remote Pilot",
      requiredExperience: 3,
      requiredEquipment: ["LiDAR Scanner", "DJI Matrice 350 RTK"],
      requirements: ["Structural analysis report"],
      applicationDeadline: pastDate,
      status: "COMPLETED",
      assignedPilotId: pilotUser._id,
    });

    await Application.create({
      jobId: completedJob._id,
      pilotId: pilotUser._id,
      proposal: "Experienced LiDAR operator for bridge inspection.",
      bidAmount: 3600,
      availability: "Immediately available.",
      status: "ACCEPTED",
      matchScore: 95,
    });

    await Payment.create({
      jobId: completedJob._id,
      companyId: companyUser._id,
      pilotId: pilotUser._id,
      amount: 3600,
      status: "PAID",
      paidAt: new Date(),
      transactionId: `TXN-${Date.now()}-001`,
      notes: "Full payment for Bridge Safety Inspection - Colorado River",
    });

    await Review.create({
      jobId: completedJob._id,
      reviewerId: companyUser._id,
      revieweeId: pilotUser._id,
      reviewerRole: "COMPANY",
      rating: 5,
      comment: "Alex was exceptional. Delivered high-quality LiDAR data ahead of schedule, and the structural analysis report was comprehensive and well-documented. Highly recommended!",
    });

    await Review.create({
      jobId: completedJob._id,
      reviewerId: pilotUser._id,
      revieweeId: companyUser._id,
      reviewerRole: "PILOT",
      rating: 5,
      comment: "Great client! Clear requirements, professional communication, and prompt payment. Would work with Skyline Industrial Corp again.",
    });

    // Notifications
    await Notification.create({
      userId: pilotUser._id,
      title: "Welcome to Certified Drone Pilots!",
      message: "Your Part 107 certification has been VERIFIED. You are now a Verified Pilot with access to premium commercial contracts.",
      type: "CERTIFICATION",
      isRead: false,
      link: "/pilot/certification",
    });

    await Notification.create({
      userId: pilotUser._id,
      title: "Application Shortlisted",
      message: `Your application for "Pipeline Infrastructure Aerial Inspection - West Texas" has been shortlisted by Skyline Industrial Corp. They will be in touch soon.`,
      type: "APPLICATION",
      isRead: false,
      link: `/pilot/applications`,
    });

    await Notification.create({
      userId: companyUser._id,
      title: "New Application Received",
      message: `Alex Rivera has applied for your job "Pipeline Infrastructure Aerial Inspection - West Texas". Match score: 92%. Review their profile now.`,
      type: "APPLICATION",
      isRead: false,
      link: `/company/applications`,
    });

    await Notification.create({
      userId: admin._id,
      title: "New Certification Pending Review",
      message: "A newly registered pilot has submitted certification documents for review.",
      type: "CERTIFICATION",
      isRead: false,
      link: "/admin/certifications",
    });

    console.log("Auto-seed complete!");
  } catch (err: any) {
    console.error("Auto-seed error:", err.message);
    cached.seeded = false; // Allow retry
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let uri = process.env.MONGODB_URI;

    cached.promise = (async () => {
      // If uri is provided, attempt to connect
      if (uri) {
        try {
          const conn = await mongoose.connect(uri, { ...opts, serverSelectionTimeoutMS: 2000 });
          return conn;
        } catch (err: any) {
          console.warn("Direct MongoDB connection failed:", err.message);
        }
      }

      // If direct connection failed or no uri provided, spin up in-memory mongodb
      console.log("Starting in-memory MongoDB fallback server...");
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        if (!cached.memoryServer) {
          cached.memoryServer = await MongoMemoryServer.create({
            instance: {
              dbName: "drone_marketplace",
            },
          });
        }
        const memoryUri = cached.memoryServer.getUri();
        console.log("In-memory MongoDB started at:", memoryUri);
        const conn = await mongoose.connect(memoryUri, opts);
        // Auto-seed demo data so the platform is functional out of the box
        await autoSeedInMemory();
        return conn;
      } catch (memErr: any) {
        console.error("Failed to start MongoMemoryServer:", memErr.message);
        throw memErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
