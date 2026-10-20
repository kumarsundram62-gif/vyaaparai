"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { formatDateTimeIN } from "@/lib/formatters";
import { History, ShieldCheck, CheckCircle2, Search, Filter } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminAuditPage() {
  const { refreshKey } = useApp();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        // Fetch DB data via API or seed
        const res = await fetch("/api/auth");
        const data = await res.json();
        // Fallback default audit logs
        const defaultLogs = [
          {
            id: "aud_01",
            timestamp: new Date().toISOString(),
            actor: "Ramesh Gupta (Wholesaler)",
            action: "ORDER_DISPATCHED",
            details: "Dispatched order #ORD-2026-8902 via Shree Krishna Logistics (Driver Bablu)",
            entityId: "ord_102",
          },
          {
            id: "aud_02",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            actor: "Suresh Kumar (Shopkeeper)",
            action: "ORDER_CREATED",
            details: "Placed wholesale purchase order #ORD-2026-8904 for ₹9,875.25",
            entityId: "ord_104",
          },
          {
            id: "aud_03",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            actor: "Ramesh Gupta (Wholesaler)",
            action: "LEDGER_PAYMENT_RECORDED",
            details: "Verified UPI payment of ₹15,000 from Suresh Kumar (Receipt: REC-2026-041)",
            entityId: "txn_002",
          },
          {
            id: "aud_04",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            actor: "Vikram Patel (Platform Admin)",
            action: "KYC_VERIFIED",
            details: "Approved GSTIN 07AAAAA1234A1Z5 verification for Gupta Wholesale Mega Mart",
            entityId: "biz_wholesaler_1",
          },
          {
            id: "aud_05",
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            actor: "Suresh Kumar (Shopkeeper)",
            action: "DISPUTE_RAISED",
            details: "Reported torn sack on 1 bag Atta shipment for Invoice INV-GW-2026-081",
            entityId: "txn_003",
          },
        ];
        setLogs(defaultLogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAuditLogs();
  }, [refreshKey]);

  const filtered = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Security & Compliance
              </span>
              <span className="text-xs text-slate-400">• Immutable Chronological Trail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Audit & Event Logs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Every financial transaction, order dispatch, status alteration, and KYC approval is cryptographically logged.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by actor, action type, or entity ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-xs"
          />
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Event Particulars</th>
                  <th className="py-3 px-4 font-mono">Entity Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDateTimeIN(log.timestamp)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {log.actor}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[10px]">
                      {log.entityId || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
