"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  FOUNDER_NAME,
  FOUNDER_TITLE,
  FOUNDER_IMAGE,
  FOUNDER_LINKEDIN,
  FOUNDER_BIO,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_NUMBER,
} from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import FeedbackModal from "@/components/FeedbackModal";
import {
  Sparkles,
  ArrowRight,
  Building2,
  Store,
  ShieldCheck,
  BookOpen,
  Bot,
  Truck,
  Receipt,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  MessageSquareQuote,
  CheckCircle2,
  Headphones,
} from "lucide-react";

export default function LandingPage() {
  const { switchDemoUser } = useApp();
  const router = useRouter();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleLaunchRole = async (userId: string, targetPath: string) => {
    await switchDemoUser(userId);
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-2xl tracking-tight">V</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Vyapar<span className="text-emerald-600 dark:text-emerald-400">AI</span>
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide">
                    India B2B
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  {BRAND_TAGLINE}
                </p>
              </div>
            </Link>
          </div>

          {/* Quick links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <a href="#demo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Live Demo
              </a>
              <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Platform
              </a>
              <a href="#founder" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Founder
              </a>
              <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Support
              </Link>
            </nav>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

            <ThemeToggle />

            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Register Business
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Next-Gen Indian B2B Commerce &amp; Shared Digital Khata</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Smarter Business.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:to-teal-300">
                Stronger Connections.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              VyaparAI unites Indian wholesale distributors and retail Kirana shopkeepers in one seamless digital ecosystem. Browse bulk FMCG catalogs, maintain transparent shared digital Udhaar (khata), generate instant GST invoices, and utilize predictive AI inventory forecasting.
            </p>

            {/* Quick Demo Switcher Hero Cards */}
            <div id="demo" className="pt-6">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                Experience Working Live Portals (1-Click Instant Login):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Wholesaler Card */}
                <div
                  onClick={() => handleLaunchRole("usr_wholesaler_1", "/wholesaler")}
                  className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Wholesaler Portal
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Gupta Wholesale Mega Mart
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ramesh Gupta • Azadpur Mandi, Delhi
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Enter Wholesaler Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Shopkeeper Card */}
                <div
                  onClick={() => handleLaunchRole("usr_shopkeeper_1", "/shopkeeper")}
                  className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                      Kirana Portal
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Aapki Apni Kirana Store
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Suresh Kumar • Chandni Chowk, Delhi
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Enter Kirana Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Admin Card */}
                <div
                  onClick={() => handleLaunchRole("usr_admin_1", "/admin")}
                  className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      Master Admin
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    VyaparAI Headquarters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Vikram Patel • Platform Ops &amp; KYC
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>Enter Admin Console</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Matrix */}
      <section id="features" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Why Indian Businesses Choose VyaparAI
            </h2>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Built for Ground-Reality Indian Commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Shared Digital Udhaar</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Wholesaler and Kirana view the exact same ledger entries. Formula: Opening + Invoices - Payments - Credit Notes. No disputes or hidden balance edits.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Bilingual AI Assistant</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ask in English or Hinglish: &ldquo;Mera kaunsa product jaldi khatam hone wala hai?&rdquo; Instant stock run-out forecasts and automated WhatsApp reminder drafts.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Live Tempo &amp; Order Tracking</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                End-to-end status workflow: Pending → Accepted → Packed → Dispatched → Delivered, with driver contact info and automatic inventory updates.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Instant GST Tax Invoices</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                One-click printable GST compliant e-invoices with HSN code breakdowns, SGST/CGST rates, buyer/supplier GSTINs, and digital signature stamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER PROFILE SECTION */}
      <section id="founder" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Photo & Identity */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/30 ring-4 ring-emerald-500/10">
                  <Image
                    src={FOUNDER_IMAGE}
                    alt={FOUNDER_NAME}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 176px, 208px"
                  />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-4">
                  {FOUNDER_NAME}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {FOUNDER_TITLE}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <a
                    href={FOUNDER_LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Bio & Leadership */}
              <div className="md:col-span-8 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Leadership &amp; Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Meet the Architect Behind VyaparAI
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {FOUNDER_BIO}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  &ldquo;Our vision is to ensure that no Kirana store owner in India loses business due to out-of-stock essentials, and no wholesale distributor suffers from cashflow freeze caused by disputed credit ledgers.&rdquo;
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Directly Accessible for Enterprise Onboarding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Dedicated 24/7 B2B Architecture Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER SUPPORT HUB SECTION */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 block">
              Dedicated Customer Support Hub
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Direct &amp; Responsive B2B Support
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Whether you need assistance with an invoice, ledger settlement, or account recovery, our support channels are active.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-emerald-500 transition-all">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Direct Phone Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Immediate live voice support for operations and orders.
                </p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                  {SUPPORT_PHONE}
                </p>
              </div>
              <div className="pt-4">
                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-600"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-emerald-500 transition-all">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">WhatsApp Desk</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Share screenshots, delivery receipts, or ask quick queries.
                </p>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                  +{SUPPORT_WHATSAPP_NUMBER}
                </p>
              </div>
              <div className="pt-4">
                <a
                  href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Namaste Shivam / VyaparAI Support! I need assistance with the platform."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-emerald-500 transition-all">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Email Helpdesk</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Formal inquiries, invoicing reconciliation, and legal.
                </p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-2 font-mono break-all">
                  {SUPPORT_EMAIL}
                </p>
              </div>
              <div className="pt-4">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Support Ticket Hub */}
            <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm">Ticket Management</h3>
                <p className="text-xs text-emerald-100 mt-1">
                  Submit a trackable support ticket with SLA turnaround.
                </p>
                <p className="text-xs font-semibold text-emerald-200 mt-3">
                  Average resolution: &lt; 2 hrs
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-colors"
                >
                  <span>Open Contact Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS IMPROVEMENT BANNER */}
      <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-teal-900/60 rounded-3xl p-8 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Product Voice
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Help Us Improve VyaparAI
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Have an idea for a feature, notice an issue, or want to suggest an improvement? We listen and iterate every week.
              </p>
            </div>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-emerald-700/30 hover:scale-105 active:scale-95 shrink-0"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Share Your Feedback</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Footer */}
      <Footer />

      {/* Floating AI & Support Launcher */}
      <FloatingSupportWidget />

      {/* Global Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
