"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { LedgerTransaction, Business } from "@/types";
import { formatINR, formatDateIN, getDaysOverdue } from "@/lib/formatters";
import {
  BookOpen,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  FileCheck2,
  X,
} from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

export default function WholesalerLedgerPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [customers, setCustomers] = useState<Business[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Dispute resolution modal
  const [resolvingTxn, setResolvingTxn] = useState<LedgerTransaction | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<"RESOLVED" | "REJECTED">("RESOLVED");
  const [resolutionNotes, setResolutionNotes] = useState("Credit note issued after checking return warehouse batch.");
  const [creditNoteAmount, setCreditNoteAmount] = useState<number>(0);

  useEffect(() => {
    async function loadLedger() {
      try {
        const [ledgerRes, bizRes] = await Promise.all([
          fetch(`/api/ledger?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
          fetch("/api/businesses?role=shopkeeper"),
        ]);

        const ledgerData = await ledgerRes.json();
        const bizData = await bizRes.json();

        if (ledgerData.success) setTransactions(ledgerData.transactions);
        if (bizData.success) setCustomers(bizData.businesses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLedger();
  }, [business, refreshKey]);

  const filteredTxns = transactions.filter((t) => {
    if (selectedCustomerId === "all") return true;
    return t.shopkeeperId === selectedCustomerId;
  });

  const totalDebits = filteredTxns.reduce((sum, t) => sum + t.debit, 0);
  const totalCredits = filteredTxns.reduce((sum, t) => sum + t.credit, 0);
  const currentOutstanding = Math.max(0, Math.round((totalDebits - totalCredits) * 100) / 100);

  const handleResolveDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTxn) return;

    try {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESOLVE_DISPUTE",
          transactionId: resolvingTxn.id,
          status: resolutionStatus,
          resolutionNotes,
          creditNoteAmount: Number(creditNoteAmount),
          resolvedBy: business?.ownerName || "Ramesh Gupta",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Dispute marked as ${resolutionStatus}`);
        setResolvingTxn(null);
        triggerRefresh();
      } else {
        showToast(data.error || "Failed to resolve dispute");
      }
    } catch (err) {
      console.error(err);
      showToast("Error resolving dispute");
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Transparent Digital Udhaar
              </span>
              <span className="text-xs text-slate-400">• Double-Entry Audited Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shared Digital Udhaar & Accounts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Wholesalers and retail Kiranas see the exact same transaction history and mathematical running balance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Record Payment Received</span>
            </button>
          </div>
        </div>

        {/* Audit Formula Explanation Card */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
              ∑
            </div>
            <div>
              <p className="font-bold text-emerald-950">
                Deterministic Ledger Balance Formula:
              </p>
              <p className="font-mono text-emerald-800 text-[11px]">
                Outstanding Balance = Opening Balance + Credit Invoices - Payments - Credit Notes
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-white px-3 py-1 rounded-full border border-emerald-300 text-emerald-900">
            Immutable Audit Trail Enabled
          </span>
        </div>

        {/* Customer Filter & Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Credit Purchases (Billed)
            </span>
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatINR(totalDebits)}
            </p>
            <p className="text-[11px] text-slate-500">Gross credit extended to retailers</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Payments & Adjustments
            </span>
            <p className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              {formatINR(totalCredits)}
            </p>
            <p className="text-[11px] text-slate-500">Received via UPI, Cash, Cheque & Credit Notes</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Current Outstanding Balance
            </span>
            <p className="text-2xl font-black text-amber-600 tracking-tight font-mono">
              {formatINR(currentOutstanding)}
            </p>
            <p className="text-[11px] text-amber-700 font-semibold">Net market receivables</p>
          </div>
        </div>

        {/* Customer Selector Dropdown */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter By Customer:</span>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:bg-white focus:outline-hidden"
          >
            <option value="all">All Connected Shopkeepers ({customers.length} stores)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.ownerName} - {c.city})
              </option>
            ))}
          </select>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Txn #</th>
                  <th className="py-3 px-4">Retail Shopkeeper</th>
                  <th className="py-3 px-4">Type & Description</th>
                  <th className="py-3 px-4 text-right">Debit (+)</th>
                  <th className="py-3 px-4 text-right">Credit (-)</th>
                  <th className="py-3 px-4 text-right">Running Balance</th>
                  <th className="py-3 px-4 text-center">Due / Status</th>
                  <th className="py-3 px-4 text-center">Dispute Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxns.map((t) => {
                  const isDebit = t.debit > 0;
                  const daysOverdue = getDaysOverdue(t.dueDate);
                  const isDisputed = t.disputeStatus === "OPEN";

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {formatDateIN(t.date)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {t.transactionNumber}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {t.shopkeeperName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 text-[11px] block">
                          {t.type.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-xs block">
                          {t.referenceNotes}
                        </span>
                        {t.receiptNumber && (
                          <span className="font-mono text-[10px] text-emerald-700">
                            Receipt: {t.receiptNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-red-600">
                        {t.debit > 0 ? formatINR(t.debit) : "-"}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                        {t.credit > 0 ? formatINR(t.credit) : "-"}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {formatINR(t.runningBalance)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {t.dueDate ? (
                          daysOverdue > 0 ? (
                            <span className="inline-block text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                              Overdue by {daysOverdue}d
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Due: {formatDateIN(t.dueDate)}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isDisputed ? (
                          <button
                            onClick={() => {
                              setResolvingTxn(t);
                              setCreditNoteAmount(t.debit);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-xs"
                          >
                            Resolve Dispute
                          </button>
                        ) : t.disputeStatus === "RESOLVED" ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Dispute Resolved
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Payment Modal */}
        {isPaymentModalOpen && (
          <PaymentModal
            wholesalerId={business?.id || "biz_wholesaler_1"}
            wholesalerName={business?.name || "Gupta Wholesale Mega Mart"}
            shopkeeperId={selectedCustomerId !== "all" ? selectedCustomerId : "biz_shopkeeper_1"}
            shopkeeperName={
              customers.find((c) => c.id === selectedCustomerId)?.name || "Aapki Apni Kirana Store"
            }
            outstandingBalance={currentOutstanding}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={triggerRefresh}
          />
        )}

        {/* Dispute Resolution Modal */}
        {resolvingTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-amber-500 text-slate-950 flex items-center justify-between">
                <h3 className="font-bold text-sm">Mediate & Resolve Dispute</h3>
                <button
                  onClick={() => setResolvingTxn(null)}
                  className="p-1 text-slate-900 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResolveDisputeSubmit} className="p-5 space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <p className="font-bold text-amber-950">Dispute Reported by Customer:</p>
                  <p className="text-slate-800 italic">&quot;{resolvingTxn.disputeReason}&quot;</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Resolution Decision
                  </label>
                  <select
                    value={resolutionStatus}
                    onChange={(e: any) => setResolutionStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="RESOLVED">Approve & Issue Credit Note Adjustment</option>
                    <option value="REJECTED">Reject Dispute (Claim Invalid)</option>
                  </select>
                </div>

                {resolutionStatus === "RESOLVED" && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Credit Note Amount (₹) to deduct from balance
                    </label>
                    <input
                      type="number"
                      required
                      value={creditNoteAmount}
                      onChange={(e) => setCreditNoteAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resolution Notes</label>
                  <textarea
                    rows={2}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setResolvingTxn(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md"
                  >
                    Submit Resolution
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
