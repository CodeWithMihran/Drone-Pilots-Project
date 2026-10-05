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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pilot Profile & Equipment Fleet</h1>
        <p className="text-xs text-slate-400 mt-1">
          Keep your aircraft models, sensor payloads, and service coverage updated to optimize match scores.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Contact Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Pilot Name
              </label>
              <input
                id="profile-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Home Base City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Operational & Pricing Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            Flight Experience & Rate
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Commercial Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Standard Hourly Rate (USD)
              </label>
              <input
                type="number"
                min="0"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Flight Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="AVAILABLE">AVAILABLE (Accepting missions)</option>
                <option value="BUSY">BUSY (Limited schedule)</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pilot Biography & Operations Summary
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detail your industrial mission background, FAA waivers, safety records, and sensor capabilities..."
              className="w-full p-3 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Drone Equipment Fleet */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Plane className="w-4 h-4 text-cyan-400" />
            Drone Fleet & Payload Sensors
          </h3>
          <p className="text-xs text-slate-400">
            Add all drones and cameras/sensors you operate (e.g. DJI Matrice 350 RTK, Agras T40, Zenmuse H20T Thermal).
          </p>

          <div className="flex gap-2">
            <input
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
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => addTag(equipment, setEquipment, newEquipment, setNewEquipment)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Equipment
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {equipment.map((eq, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 flex items-center gap-2 font-medium"
              >
                <span>{eq}</span>
                <button
                  type="button"
                  onClick={() => removeTag(equipment, setEquipment, idx)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Specializations & Skills */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Specializations & Technical Skills
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(specializations, setSpecializations, newSpec, setNewSpec);
                }
              }}
              placeholder="e.g. LiDAR Topography, Orthomosaic 3D, Thermal Inspection"
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => addTag(specializations, setSpecializations, newSpec, setNewSpec)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {specializations.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 font-medium"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => removeTag(specializations, setSpecializations, idx)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          id="save-pilot-profile-btn"
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Profile & Fleet Details"}</span>
        </button>
      </form>
    </div>
  );
}
