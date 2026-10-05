export interface MatchingPilotInput {
  userId?: string;
  experience?: number;
  skills?: string[];
  equipment?: string[];
  availability?: string;
  serviceAreas?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  certifications?: Array<{
    type: string;
    status: string;
    expiryDate: Date | string;
  }>;
}

export interface MatchingJobInput {
  serviceType?: string;
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  requiredCertification?: string;
  requiredExperience?: number;
  requiredEquipment?: string[];
}

export interface MatchScoreResult {
  score: number; // 0 to 100
  breakdown: {
    certification: number; // Max 30
    location: number;      // Max 20
    experience: number;    // Max 20
    equipment: number;     // Max 20
    availability: number;  // Max 10
  };
  eligible: boolean;
  reasons: string[];
}

export function calculateMatchScore(
  pilot: MatchingPilotInput,
  job: MatchingJobInput
): MatchScoreResult {
  let certScore = 0;
  let locScore = 0;
  let expScore = 0;
  let eqScore = 0;
  let availScore = 0;
  const reasons: string[] = [];

  const now = new Date();

  // 1. Certification Score (Max 30)
  const validCerts = (pilot.certifications || []).filter((c) => {
    const isVerified = c.status === "VERIFIED";
    const notExpired = new Date(c.expiryDate) > now;
    return isVerified && notExpired;
  });

  const reqCert = (job.requiredCertification || "").toLowerCase();
  const hasMatchingCert = validCerts.some(
    (c) =>
      c.type.toLowerCase().includes(reqCert) ||
      reqCert.includes(c.type.toLowerCase()) ||
      c.type.toLowerCase().includes("part 107")
  );

  if (validCerts.length > 0 && hasMatchingCert) {
    certScore = 30;
    reasons.push("Verified certification matches job criteria (+30 pts)");
  } else if (validCerts.length > 0) {
    certScore = 20;
    reasons.push("Verified pilot certification on file (+20 pts)");
  } else {
    const hasPending = (pilot.certifications || []).some((c) => c.status === "PENDING");
    if (hasPending) {
      certScore = 10;
      reasons.push("Certification is currently pending admin review (+10 pts)");
    } else {
      certScore = 0;
      reasons.push("No active verified commercial certification (0 pts)");
    }
  }

  // 2. Location Score (Max 20)
  const jobCity = (job.location?.city || "").toLowerCase().trim();
  const jobState = (job.location?.state || "").toLowerCase().trim();
  const pilotCity = (pilot.location?.city || "").toLowerCase().trim();
  const pilotState = (pilot.location?.state || "").toLowerCase().trim();
  const serviceAreas = (pilot.serviceAreas || []).map((s) => s.toLowerCase().trim());

  if (jobCity && pilotCity && jobCity === pilotCity) {
    locScore = 20;
    reasons.push(`Exact city match in ${job.location.city} (+20 pts)`);
  } else if (
    serviceAreas.some((area) => area.includes(jobCity) || area.includes(jobState)) ||
    (jobState && pilotState && jobState === pilotState)
  ) {
    locScore = 16;
    reasons.push(`Covers target regional service area (+16 pts)`);
  } else if (pilot.location?.country && job.location?.country && pilot.location.country === job.location.country) {
    locScore = 10;
    reasons.push(`Operates in same country (+10 pts)`);
  } else {
    locScore = 5;
    reasons.push(`Standard travel distance (+5 pts)`);
  }

  // 3. Experience Score (Max 20)
  const pilotExp = pilot.experience || 0;
  const reqExp = job.requiredExperience || 1;

  if (pilotExp >= reqExp) {
    expScore = 20;
    reasons.push(`Meets or exceeds ${reqExp} year(s) required experience (+20 pts)`);
  } else if (pilotExp >= reqExp * 0.5) {
    expScore = 12;
    reasons.push(`Partial experience match (${pilotExp} yrs vs ${reqExp} yrs) (+12 pts)`);
  } else {
    expScore = 5;
    reasons.push(`Entry level experience (+5 pts)`);
  }

  // 4. Equipment Score (Max 20)
  const reqEquipment = (job.requiredEquipment || []).filter(Boolean);
  const pilotEquipment = (pilot.equipment || []).map((e) => e.toLowerCase());

  if (reqEquipment.length === 0) {
    eqScore = 20;
    reasons.push("All required drone gear provided (+20 pts)");
  } else {
    let matchedCount = 0;
    for (const req of reqEquipment) {
      const isMatched = pilotEquipment.some((pe) => pe.includes(req.toLowerCase()) || req.toLowerCase().includes(pe));
      if (isMatched) matchedCount++;
    }

    if (matchedCount === reqEquipment.length) {
      eqScore = 20;
      reasons.push("Fully equipped with all required drone models/payloads (+20 pts)");
    } else if (matchedCount > 0) {
      eqScore = Math.round((matchedCount / reqEquipment.length) * 20);
      reasons.push(`Equipped with ${matchedCount}/${reqEquipment.length} required assets (+${eqScore} pts)`);
    } else if (pilotEquipment.length > 0) {
      eqScore = 8;
      reasons.push("Equipped with enterprise drone fleet (+8 pts)");
    } else {
      eqScore = 0;
    }
  }

  // 5. Availability Score (Max 10)
  const avail = pilot.availability || "AVAILABLE";
  if (avail === "AVAILABLE") {
    availScore = 10;
    reasons.push("Pilot is ready & available (+10 pts)");
  } else if (avail === "BUSY") {
    availScore = 5;
    reasons.push("Pilot has limited availability (+5 pts)");
  } else {
    availScore = 0;
    reasons.push("Pilot is currently unavailable (0 pts)");
  }

  const totalScore = Math.min(100, Math.max(0, certScore + locScore + expScore + eqScore + availScore));
  const isEligible = certScore >= 20 || !job.requiredCertification;

  return {
    score: totalScore,
    breakdown: {
      certification: certScore,
      location: locScore,
      experience: expScore,
      equipment: eqScore,
      availability: availScore,
    },
    eligible: isEligible,
    reasons,
  };
}
