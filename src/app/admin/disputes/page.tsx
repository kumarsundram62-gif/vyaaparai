"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { LedgerTransaction } from "@/types";
import { formatINR, formatDateIN } from "@/lib/formatters";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Building2,
  Store,
  X,
} from "lucide-react";

export default function AdminDisputesPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolution Modal
  const [activeTxn, setActiveTxn] = useState<LedgerTransaction | null>(null);
  const [status, setStatus] = useState<"RESOLVED" | "REJECTED">("RESOLVED");
  const [notes, setNotes] = useState("Mediated by Admin after verifying proof.");
  const [creditAmount, setCreditAmount] = useState(0);

  useEffect(() => {
    async function loadDisputes() {
      try {
        const res = await fetch("/api/ledger");
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDisputes();
  }, [business, refreshKey]);

  const disputes = transactions.filter((t) => t.disputeStatus !== "NONE");

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTxn) return;

    try {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESOLVE_DISPUTE",
          transactionId: activeTxn.id,
          status,
          resolutionNotes: notes,
          creditNoteAmount: Number(creditAmount),
          resolvedBy: "VyaparAI Admin",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Dispute resolved. Status updated to ${status}.`);
        setActiveTxn(null);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating dispute");
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Arbitration Center
              </span>
              <span className="text-xs text-slate-400">• Disputed Ledger Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Transaction Disputes & Fraud Review
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review quantity shortages, damaged transit claims, and billing discrepancies reported by Kiranas or Wholesalers.
            </p>
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {disputes.map((d) => {
            const isOpen = d.disputeStatus === "OPEN";

            return (
              <div
                key={d.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {d.transactionNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isOpen
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {d.disputeStatus}
                    </span>
                    <span className="text-slate-400 font-mono">{formatDateIN(d.date)}</span>
                  </div>

                  <span className="font-mono font-bold text-slate-900 text-sm">
                    Claim Amount: {formatINR(d.debit || d.credit)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-500">Parties Involved:</p>
                    <p className="font-bold text-slate-900">
                      Buyer: <span className="font-semibold">{d.shopkeeperName}</span>
                    </p>
                    <p className="font-bold text-slate-900">
                      Wholesaler: <span className="font-semibold">{d.wholesalerName}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-bold text-amber-950">Reported Dispute Reason:</p>
                    <p className="text-slate-800 italic">&quot;{d.disputeReason}&quot;</p>
                    {d.disputeRaisedBy && (
                      <p className="text-[10px] text-slate-500">
                        Raised by: {d.disputeRaisedBy}
                      </p>
                    )}
                  </div>
                </div>

                {d.disputeResolutionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                    <p className="font-bold">Resolution Notes:</p>
                    <p className="mt-0.5 text-slate-800">{d.disputeResolutionNotes}</p>
                  </div>
                )}

                {isOpen && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveTxn(d);
                        setCreditAmount(d.debit);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                    >
                      Arbitrate & Issue Credit Note
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {disputes.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">Zero Active Disputes</h3>
              <p>No billing or inventory discrepancies currently open on the network.</p>
            </div>
          )}
        </div>

        {/* Mediation Modal */}
        {activeTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Arbitrate Dispute as Master Admin</h3>
                <button onClick={() => setActiveTxn(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResolve} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Decision</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="RESOLVED">Approve Dispute & Issue Credit Note</option>
                    <option value="REJECTED">Reject Claim as Unsubstantiated</option>
                  </select>
                </div>

                {status === "RESOLVED" && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Credit Note Adjustment Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arbitration Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTxn(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                  >
                    Confirm Arbitration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
