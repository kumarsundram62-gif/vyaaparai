"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Business, Order, LedgerTransaction } from "@/types";
import { formatINR, formatDateIN } from "@/lib/formatters";
import {
  ShieldCheck,
  Building2,
  Store,
  FileCheck2,
  AlertTriangle,
  TrendingUp,
  History,
  Activity,
  CheckCircle2,
  Users,
  LifeBuoy,
  MessageSquareQuote,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const { business, refreshKey, triggerRefresh } = useApp();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [bizRes, ordersRes, ledgerRes] = await Promise.all([
          fetch("/api/businesses"),
          fetch("/api/orders"),
          fetch("/api/ledger"),
        ]);

        const bizData = await bizRes.json();
        const ordersData = await ordersRes.json();
        const ledgerData = await ledgerRes.json();

        if (bizData.success) setBusinesses(bizData.businesses);
        if (ordersData.success) setOrders(ordersData.orders);
        if (ledgerData.success) setTransactions(ledgerData.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [business, refreshKey]);

  const wholesalersCount = businesses.filter((b) => b.role === "wholesaler").length;
  const shopkeepersCount = businesses.filter((b) => b.role === "shopkeeper").length;
  const pendingKycCount = businesses.filter((b) => b.verificationStatus === "PENDING_REVIEW").length;
  const openDisputes = transactions.filter((t) => t.disputeStatus === "OPEN");
  const totalPlatformGMV = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Platform Administration & Operations HQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              VyaparAI Network Operations Console
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Supervise registered B2B businesses, verify GSTINs and KYC records, arbitrate financial transaction disputes, and monitor network health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Network Status: Healthy</span>
            </span>
          </div>
        </div>

        {/* Admin KPI Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Wholesalers */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Registered Wholesalers
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {wholesalersCount} Distributors
            </p>
            <div className="text-[11px] text-emerald-600 font-semibold">
              100% GSTIN Verified
            </div>
          </div>

          {/* Card 2: Shopkeepers */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Retail Kirana Stores
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {shopkeepersCount} Stores
            </p>
            <div className="text-[11px] text-slate-500">
              Delhi NCR, UP & Haryana
            </div>
          </div>

          {/* Card 3: Platform GMV */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Processed Orders GMV
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-700 tracking-tight font-mono">
              {formatINR(totalPlatformGMV)}
            </p>
            <div className="text-[11px] text-slate-500">
              Across {orders.length} wholesale orders
            </div>
          </div>

          {/* Card 4: Action Queue */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Pending Actions
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 tracking-tight">
              {pendingKycCount + openDisputes.length} Tasks
            </p>
            <div className="text-[11px] text-amber-700 font-semibold">
              {pendingKycCount} KYC & {openDisputes.length} Disputes
            </div>
          </div>
        </div>

        {/* Verification Queue & Open Disputes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KYC Queue */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Business KYC Verification Queue
                </h3>
                <p className="text-[11px] text-slate-500">
                  New registrations requiring document & GST review
                </p>
              </div>
              <Link
                href="/admin/businesses"
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                Review All
              </Link>
            </div>

            <div className="space-y-3">
              {businesses
                .filter((b) => b.verificationStatus === "PENDING_REVIEW")
                .map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{b.name}</p>
                      <p className="text-[11px] text-slate-600">
                        {b.ownerName} • {b.city} ({b.role})
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {b.gstin ? `GST: ${b.gstin}` : "Small Kirana (No GSTIN)"}
                      </p>
                    </div>

                    <Link
                      href="/admin/businesses"
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                    >
                      Verify Business
                    </Link>
                  </div>
                ))}

              {pendingKycCount === 0 && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  All registered business accounts are fully verified!
                </div>
              )}
            </div>
          </div>

          {/* Open Disputes */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Dispute & Arbitration Queue
                </h3>
                <p className="text-[11px] text-slate-500">
                  Reported ledger quantity/quality discrepancies
                </p>
              </div>
              <Link
                href="/admin/disputes"
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                Dispute Center
              </Link>
            </div>

            <div className="space-y-3">
              {openDisputes.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-red-900 text-xs">
                      {d.transactionNumber}
                    </span>
                    <p className="text-slate-800 font-semibold mt-0.5">
                      {d.shopkeeperName} vs {d.wholesalerName}
                    </p>
                    <p className="text-[11px] text-slate-600 italic">
                      &quot;{d.disputeReason}&quot;
                    </p>
                  </div>
                  <Link
                    href="/admin/disputes"
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
                  >
                    Mediate
                  </Link>
                </div>
              ))}

              {openDisputes.length === 0 && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  No open ledger disputes. Platform running in harmony!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support & Voice of Customer Central */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/support"
            className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Customer Support Helpdesk
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage incoming support tickets, phone requests, and WhatsApp escalations
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/feedback"
            className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  User Feedback &amp; Suggestions
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review product enhancement ideas, feature requests, and bug reports
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
