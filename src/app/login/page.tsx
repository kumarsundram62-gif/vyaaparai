"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { Building2, Store, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import AIChatModal from "@/components/AIChatModal";

export default function LoginPage() {
  const router = useRouter();
  const { switchDemoUser, showToast } = useApp();

  const [role, setRole] = useState<UserRole>("wholesaler");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          identifier: identifier || (role === "wholesaler" ? "ramesh@guptawholesale.in" : "suresh@apnikirana.in"),
          role,
        }),
      });

      const data = await res.json();
      if (data.success && data.session) {
        showToast(`Welcome back, ${data.session.user.name}!`);
        if (role === "wholesaler") router.push("/wholesaler");
        else if (role === "shopkeeper") router.push("/shopkeeper");
        else router.push("/admin");
      } else {
        showToast(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      showToast("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (userId: string, targetRole: UserRole) => {
    setLoading(true);
    await switchDemoUser(userId);
    if (targetRole === "wholesaler") router.push("/wholesaler");
    else if (targetRole === "shopkeeper") router.push("/shopkeeper");
    else router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors relative">
      {/* Top Bar with Theme Toggle & Return */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/"
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md">
            V
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Vyapar<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Sign In to Your Business Account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Wholesale distribution, retail Kirana, and shared digital Udhaar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 sm:px-10 space-y-6">
          {/* Role Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("wholesaler")}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  role === "wholesaler"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Wholesaler</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("shopkeeper")}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  role === "shopkeeper"
                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 shadow-xs"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Kirana</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  role === "admin"
                    ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-800 dark:text-purple-300 shadow-xs"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email / Registered Mobile
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  role === "wholesaler"
                    ? "ramesh@guptawholesale.in"
                    : role === "shopkeeper"
                    ? "suresh@apnikirana.in"
                    : "admin@vyaparai.in"
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
              Quick 1-Click Demo Logins:
            </p>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo("usr_wholesaler_1", "wholesaler")}
                className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/70 text-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>Ramesh Gupta (Wholesaler Demo)</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("usr_shopkeeper_1", "shopkeeper")}
                className="w-full p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-950/70 text-blue-950 dark:text-blue-300 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>Suresh Kumar (Kirana Shopkeeper Demo)</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("usr_admin_1", "admin")}
                className="w-full p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100/70 dark:hover:bg-purple-950/70 text-purple-950 dark:text-purple-300 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>Vikram Patel (Platform Admin Demo)</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Register Business
              </Link>
            </p>
            <p className="text-[11px]">
              Need help? Click the AI Assistant below or visit{" "}
              <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">
                Customer Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AIChatModal />
      <FloatingSupportWidget />
    </div>
  );
}
