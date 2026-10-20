"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  FOUNDER_NAME,
  FOUNDER_LINKEDIN,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_NUMBER,
} from "@/lib/constants";
import {
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  MessageSquareQuote,
  Heart,
  ChevronRight,
} from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Col 1: Brand & Founder Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-900/30">
                  V
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    {BRAND_NAME}
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full ml-2">
                    B2B SaaS
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-400 font-medium">
                &ldquo;{BRAND_TAGLINE}&rdquo;
              </p>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Empowering India&apos;s wholesale distributors and retail kirana stores with
                seamless digital orders, dispute-free shared udhaar ledgers, GST compliance,
                and predictive AI inventory intelligence.
              </p>

              <div className="pt-2">
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 max-w-sm">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 text-[11px]">Architected & Founded by</span>
                    <a
                      href={FOUNDER_LINKEDIN}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="font-bold text-white text-xs">{FOUNDER_NAME}</p>
                  <p className="text-[11px] text-slate-400">Founder & Chief Architect, VyaparAI</p>
                </div>
              </div>
            </div>

            {/* Col 2: Platform & Products */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Platform Solutions
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/shopkeeper/marketplace"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Wholesale Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shopkeeper/ledger"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Shared Digital Udhaar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shopkeeper/inventory"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Kirana Stock & Run-rates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wholesaler/products"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Distributor Catalog & MOQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wholesaler/reports"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    GST Sales & Tax Reports
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Company & Community */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Company & Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    About VyaparAI & Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#founder"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Founder Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Share Product Feedback
                  </button>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Customer Support Hub
              </h4>
              <div className="space-y-2.5 text-xs">
                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{SUPPORT_PHONE}</span>
                </a>

                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{SUPPORT_EMAIL}</span>
                </a>

                <a
                  href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Namaste Shivam / VyaparAI Support! I need assistance with the platform."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    <span>Open Helpdesk & Tickets</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              &copy; {currentYear} {BRAND_NAME} Technologies. All rights reserved. Made for Indian B2B Commerce.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                GST Compliant ERP
              </span>
              <span>•</span>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Give Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
