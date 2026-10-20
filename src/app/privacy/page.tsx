"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import { BRAND_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/constants";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Data Protection &amp; Confidentiality
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {BRAND_NAME} Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Last Updated: October 2026 • Compliant with Indian Information Technology Act &amp; DPDP Guidelines
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                1. Our Commitment to Merchant Privacy
              </h2>
              <p>
                At {BRAND_NAME}, we recognize that your inventory counts, wholesale purchase prices, customer khata balances, and GST invoices represent your trade secrets. We never sell, monetize, or disclose your proprietary business data to competitors or third-party ad networks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                2. Information We Collect
              </h2>
              <p>
                We collect information essential to operate your B2B commerce account:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Business Identity:</strong> Firm Name, Trade Address, GSTIN, and authorized signatory phone/email.</li>
                <li><strong>Order &amp; Catalog Data:</strong> Wholesale SKUs, batch numbers, MRP, wholesale rate, and quantities.</li>
                <li><strong>Shared Ledger Data:</strong> Debit and credit ledger entries created mutually between verified buyers and sellers.</li>
                <li><strong>AI Diagnostics:</strong> Anonymous stock velocity counts used strictly to forecast restock dates for your store.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3. Zero-Credential Architecture
              </h2>
              <p>
                Our AI assistants, support staff, and automated background systems are designed with strict zero-knowledge constraints. We will never ask you for or store your passwords, bank UPI PINs, ATM codes, or OTPs. All payment transactions utilize standard verifiable bank references.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                4. Data Ownership &amp; Export
              </h2>
              <p>
                You retain complete ownership of your ledger and product records. Wholesalers and shopkeepers can download standard PDF and print statements for GST auditing at any time without fees or artificial lock-ins.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                5. Privacy Grievance Officer
              </h2>
              <p className="text-xs">
                If you have questions regarding data privacy or want to exercise your data rights, contact our office:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-0.5">
                <p className="text-slate-900 dark:text-white font-bold">VyaparAI Data Protection Officer</p>
                <p className="text-slate-500">Email: {SUPPORT_EMAIL}</p>
                <p className="text-slate-500">Helpline: {SUPPORT_PHONE}</p>
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
