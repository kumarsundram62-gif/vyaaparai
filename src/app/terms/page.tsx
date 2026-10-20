"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import { BRAND_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/constants";
import { ShieldCheck, FileCheck, Scale, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 mb-3">
              <Scale className="w-3.5 h-3.5" />
              Merchant User Agreement
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {BRAND_NAME} Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Effective Date: October 2026 • Governing B2B Wholesale &amp; Retail Transactions
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or registering with {BRAND_NAME}, you represent that you are an authorized representative of a commercial business, proprietorship, LLP, or corporation operating in India, and agree to be bound by these Terms of Service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                2. Shared Digital Udhaar (Khata) Obligations
              </h2>
              <p>
                The {BRAND_NAME} platform provides a synchronized two-sided ledger. When a wholesale order is accepted on credit (Udhaar), both parties agree that the ledger entry constitutes a valid commercial acknowledgment of indebtedness until marked settled via mutually verified payment receipts (Bank Transfer, UPI, Cash acknowledgment, or Cheque).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-600" />
                3. Dispute Resolution Protocol
              </h2>
              <p>
                In the event of damaged inventory, quantity shortages, or rate discrepancies, users must initiate a dispute ticket within 72 hours of consignment delivery through the integrated Dispute Resolution module. Platform admins review submitted batch proofs, invoices, and delivery challans to resolve discrepancies fairly.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                4. GST Invoicing &amp; Tax Compliance
              </h2>
              <p>
                Wholesalers agree to provide accurate Goods and Services Tax Identification Numbers (GSTIN) and apply appropriate HSN codes to listed inventory. {BRAND_NAME} generates standardized tax invoices based on seller configuration but does not act as a tax authority.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                5. Legal Jurisdiction &amp; Support
              </h2>
              <p className="text-xs">
                These terms are governed by the laws of India. For commercial queries, contact:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-0.5">
                <p className="text-slate-900 dark:text-white font-bold">VyaparAI Legal &amp; Compliance Team</p>
                <p className="text-slate-500">Email: {SUPPORT_EMAIL}</p>
                <p className="text-slate-500">Phone: {SUPPORT_PHONE}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingSupportWidget />
    </div>
  );
}
