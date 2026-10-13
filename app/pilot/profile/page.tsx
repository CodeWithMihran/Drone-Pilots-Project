"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  DollarSign,
  Award,
  Layers,
  Plane,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PilotProfileEditPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [experience, setExperience] = useState(2);
  const [rate, setRate] = useState(85);
  const [availability, setAvailability] = useState<"AVAILABLE" | "BUSY" | "UNAVAILABLE">("AVAILABLE");
  const [bio, setBio] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");

  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");

  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        const user = data?.user;

        if (user) {
          setName(user.name || "");
          setPhone(user.phone || "");
          setCity(user.location?.city || "");
          setState(user.location?.state || "");

          if (user.profile) {
            setExperience(user.profile.experience || 1);
            setRate(user.profile.rate || 75);
            setAvailability(user.profile.availability || "AVAILABLE");
            setBio(user.profile.bio || "");
            setSkills(user.profile.skills || []);
            setSpecializations(user.profile.specializations || []);
            setEquipment(user.profile.equipment || []);
            setServiceAreas(user.profile.serviceAreas || []);
          }
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/pilots/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          city,
          state,
          country: "United States",
          experience: Number(experience),
          rate: Number(rate),
          availability,
          bio,
          skills,
          specializations,
          equipment,
          serviceAreas,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setMessage({ type: "success", text: "Pilot profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Update error" });
    } finally {
      setSaving(false);
    }
  };

  const addTag = (list: string[], setList: (l: string[]) => void, item: string, setInput: (s: string) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()]);
      setInput("");
    }
  };

  const removeTag = (list: string[], setList: (l: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  // Reusable styles to match our new Input component for native select/textareas
  const inputMatchingClasses = "flex w-full rounded-control border border-border bg-background px-3.5 py-2 text-[15px] text-foreground shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-strong";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Pilot Profile & Equipment Fleet</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Keep your aircraft models, sensor payloads, and service coverage updated to optimize match scores.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Contact Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full Pilot Name</Label>
              <Input
                id="profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="profile-city">Home Base City</Label>
              <Input
                id="profile-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-state">State / Province</Label>
              <Input
                id="profile-state"
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Operational & Pricing Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Flight Experience & Rate
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="profile-experience">Commercial Experience (Years)</Label>
              <Input
                id="profile-experience"
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-rate">Standard Hourly Rate (USD)</Label>
              <Input
                id="profile-rate"
                type="number"
                min="0"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-availability">Flight Availability Status</Label>
              <select
                id="profile-availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className={`h-11 ${inputMatchingClasses}`}
              >
                <option value="AVAILABLE">AVAILABLE (Accepting missions)</option>
                <option value="BUSY">BUSY (Limited schedule)</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-bio">Pilot Biography & Operations Summary</Label>
            <textarea
              id="profile-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detail your industrial mission background, FAA waivers, safety records, and sensor capabilities..."
              className={`min-h-[100px] resize-y ${inputMatchingClasses}`}
            />
          </div>
        </div>

        {/* Drone Equipment Fleet */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            Drone Fleet & Payload Sensors
          </h3>
          <p className="text-sm text-muted-foreground">
            Add all drones and cameras/sensors you operate (e.g. DJI Matrice 350 RTK, Agras T40, Zenmuse H20T Thermal).
          </p>

          <div className="flex gap-3">
            <Input
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(equipment, setEquipment, newEquipment, setNewEquipment);
                }
              }}
              placeholder="e.g. DJI Matrice 300 RTK"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => addTag(equipment, setEquipment, newEquipment, setNewEquipment)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add 
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {equipment.map((eq, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full bg-secondary border border-border text-sm text-foreground flex items-center gap-2 font-medium"
              >
                <span>{eq}</span>
                <button
                  type="button"
                  onClick={() => removeTag(equipment, setEquipment, idx)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Specializations & Skills */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Specializations & Technical Skills
          </h3>

          <div className="flex gap-3">
            <Input
              type="text"
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(specializations, setSpecializations, newSpec, setNewSpec);
                }
              }}
              placeholder="e.g. LiDAR Topography, Orthomosaic 3D"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => addTag(specializations, setSpecializations, newSpec, setNewSpec)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add 
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {specializations.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary flex items-center gap-2 font-medium"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => removeTag(specializations, setSpecializations, idx)}
                  className="text-primary/70 hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <Button
          id="save-pilot-profile-btn"
          type="submit"
          disabled={saving}
          size="lg"
          block
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving Changes..." : "Save Profile & Fleet Details"}
        </Button>
      </form>
    </div>
  );
}