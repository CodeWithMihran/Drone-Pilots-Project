"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  User,
  Globe,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

export default function CompanyProfileEditPage() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [industry, setIndustry] = useState("Commercial Services");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
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
            setCompanyName(user.profile.companyName || "");
            setContactPerson(user.profile.contactPerson || user.name || "");
            setIndustry(user.profile.industry || "Commercial Services");
            setWebsite(user.profile.website || "");
            setDescription(user.profile.description || "");
          }
        }
      } catch (err) {
        console.error("Fetch company profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/companies/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          companyName,
          contactPerson,
          industry,
          website,
          phone,
          city,
          state,
          country: "United States",
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setMessage({ type: "success", text: "Organization profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Update error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Commercial Client Profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Organization Profile & Headquarters
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Manage your legal entity records, industry sector, procurement contact, and operating location.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Building className="w-4 h-4 text-primary" />
          <span>{industry}</span>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type === "success" ? "success" : "error"}>
          <span>{message.text}</span>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs space-y-5 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="pb-3 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              Enterprise Information
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visible to commercial pilots reviewing your posted mission briefs.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company / Entity Legal Name" htmlFor="company-name-input">
                <Input
                  id="company-name-input"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>

              <Field label="Primary Sector" htmlFor="company-industry-select">
                <select
                  id="company-industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-control bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-primary h-10"
                >
                  <option value="Agriculture & Forestry">Agriculture & Forestry</option>
                  <option value="Infrastructure & Utilities">Infrastructure & Utilities</option>
                  <option value="Real Estate & Construction">Real Estate & Construction</option>
                  <option value="Energy & Solar/Wind">Energy & Solar/Wind</option>
                  <option value="Land Surveying & Mining">Land Surveying & Mining</option>
                  <option value="Media & Cinema">Media & Cinema</option>
                  <option value="Commercial Services">Commercial Services</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Procurement Contact Person">
                <Input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>

              <Field label="Corporate Website">
                <Input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Phone Contact">
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>

              <Field label="City Headquarters">
                <Input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>

              <Field label="State / Region">
                <Input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>
            </div>

            <Field label="Company Mission & Flight Operations Profile">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your organization's flight requirements, safety compliance, site access procedures..."
                className="w-full p-3 rounded-control bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-primary leading-relaxed"
              />
            </Field>
          </div>
        </div>

        <Button
          id="save-company-profile-btn"
          type="submit"
          variant="primary"
          size="md"
          disabled={saving}
          className="gap-2 h-10 px-6 font-semibold text-xs"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Organization Profile"}</span>
        </Button>
      </form>
    </div>
  );
}
