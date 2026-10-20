"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { Building2, Store, CheckCircle2, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import AIChatModal from "@/components/AIChatModal";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast, triggerRefresh } = useApp();

  const [role, setRole] = useState<UserRole>("shopkeeper");
  const [ownerName, setOwnerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Kirana & General Store");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Delhi");
  const [state, setState] = useState("Delhi");
  const [pincode, setPincode] = useState("110006");
  const [gstin, setGstin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          role,
          ownerName,
          businessName,
          businessType,
          phone,
          email,
          address,
          city,
          state,
          pincode,
          gstin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Business registered successfully! Welcome ${ownerName}.`);
        triggerRefresh();
        if (role === "wholesaler") router.push("/wholesaler");
        else router.push("/shopkeeper");
      } else {
        showToast(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      showToast("Error registering business");
    } finally {
      setLoading(false);
    }
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

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md">
            V
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Vyapar<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Register Your Business on VyaparAI
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Join the trusted network of distributors, wholesalers, and Kirana shopkeepers
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 sm:px-10">
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole("wholesaler");
                    setBusinessType("FMCG & Grains Wholesaler");
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    role === "wholesaler"
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Wholesaler / Distributor</p>
                    <p className="text-[11px] text-slate-500">
                      Manage bulk catalog, orders, and customer credit ledger
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("shopkeeper");
                    setBusinessType("Kirana & General Store");
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    role === "shopkeeper"
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Store className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Retail Shopkeeper</p>
                    <p className="text-[11px] text-slate-500">
                      Order from wholesalers, track deliveries & manage shop stock
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Owner / Proprietor Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sharma Provision Store"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Number (for WhatsApp Alerts) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@sharmastore.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Shop Address & Delivery Location *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No. 4, Main Market Road"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* GSTIN */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                GSTIN Number (Optional for small Kiranas)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="07AAAAA0000A1Z5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono uppercase"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Entering a valid GSTIN enables instant Verified Business status.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50"
            >
              {loading ? "Registering..." : `Complete Business Registration`}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 space-y-1">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Sign In
              </Link>
            </p>
            <p className="text-[11px]">
              Need help registering?{" "}
              <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">
                Contact Customer Support
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
