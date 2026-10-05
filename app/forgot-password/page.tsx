"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navigation, Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#060b18] relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="p-8 rounded-3xl bg-[#0b132b]/90 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-2">
                <Navigation className="w-6 h-6 text-cyan-400 transform -rotate-45" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your account email to receive recovery instructions
            </p>
          </div>

          {sent ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-white">Recovery link generated!</p>
              <p className="text-xs text-slate-400">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive password reset instructions.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 text-xs text-cyan-400 hover:underline"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
