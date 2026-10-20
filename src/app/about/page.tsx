"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  FOUNDER_NAME,
  FOUNDER_TITLE,
  FOUNDER_IMAGE,
  FOUNDER_LINKEDIN,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_NUMBER,
} from "@/lib/constants";
import {
  ShieldCheck,
  Building2,
  Store,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Phone,
  CheckCircle2,
  Users,
  Target,
  Award,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/15 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              The Story Behind VyaparAI
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Digitizing India&apos;s Wholesale &amp; Retail Commerce
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              &ldquo;{BRAND_TAGLINE}&rdquo;
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Empowering local kirana stores and FMCG wholesalers with the digital superpowers of
              enterprise ERPs—simplified, bilingual, and free of bookkeeping disputes.
            </p>
          </div>
        </section>

        {/* Founder Spotlight Section */}
        <section id="founder" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Photo Column */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/30 ring-4 ring-emerald-500/10">
                  <Image
                    src={FOUNDER_IMAGE}
                    alt={FOUNDER_NAME}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 192px, 224px"
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

              {/* Bio & Vision Column */}
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  <Award className="w-3.5 h-3.5" />
                  Founder&apos;s Note &amp; Vision
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  &ldquo;Commerce in India thrives on trust. We built the software to back that trust.&rdquo;
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Growing up observing Indian marketplaces, one friction was ever-present: the
                  traditional <span className="font-semibold text-slate-900 dark:text-white">Bahi-Khata</span> (credit notebook).
                  Wholesalers maintained one notebook, kirana store owners maintained another, and
                  inevitably, at the end of the month, payments stalled due to ledger mismatches.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white">{BRAND_NAME}</span> was conceived to eliminate
                  this friction forever. By establishing a single, synchronized, real-time shared
                  ledger backed by automated GST calculation, verified purchase orders, and bilingual
                  AI inventory forecasting, we give Indian SMBs the technological foundation to scale
                  without headaches.
                </p>

                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Direct Line</p>
                    <p className="text-slate-500 font-mono text-[11px]">{SUPPORT_PHONE}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Email</p>
                    <p className="text-slate-500 truncate text-[11px]">{SUPPORT_EMAIL}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Location</p>
                    <p className="text-slate-500 text-[11px]">Bengaluru &amp; Pan-India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              The Three Core Pillars of VyaparAI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Engineered with extreme care for the real-world operational challenges of Indian merchants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Zero Ledger Disputes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When a retailer buys goods on credit, both parties see the exact same invoice entry
                and payment verification timestamp simultaneously.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Predictive AI Advisor
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Calculates daily sales velocity, detects upcoming stockouts 4 days in advance, and
                suggests consolidated reorders before customers walk out empty-handed.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bilingual &amp; WhatsApp First
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Designed for real Indian traders. Speak or type in English, Hindi, or Hinglish, with
                one-click manual WhatsApp reminders and invoice sharing.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingSupportWidget />
    </div>
  );
}
