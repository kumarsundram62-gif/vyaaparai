"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { LedgerTransaction } from "@/types";
import { formatINR, formatDateIN, getDaysOverdue } from "@/lib/formatters";
import {
  BookOpen,
  CreditCard,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Download,
  Filter,
} from "lucide-react";
import PaymentModal from "@/components/PaymentModal";
import DisputeModal from "@/components/DisputeModal";

export default function ShopkeeperLedgerPage() {
  const { business, refreshKey, triggerRefresh } = useApp();

  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [disputeTargetTxn, setDisputeTargetTxn] = useState<LedgerTransaction | null>(null);

  useEffect(() => {
    async function loadLedger() {
      try {
        const res = await fetch(`/api/ledger?shopkeeperId=${business?.id || "biz_shopkeeper_1"}`);
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions);
          setTotalBalance(data.totalBalance || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLedger();
  }, [business, refreshKey]);

  const totalBilled = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalPaid = transactions.reduce((sum, t) => sum + t.credit, 0);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Shared Digital Passbook
              </span>
              <span className="text-xs text-slate-400">• Transparent Credit & Bills</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Udhaar & Wholesaler Accounts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Identical ledger records verified between your store and connected distributors. No disputed balance edits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <QrCode className="w-4 h-4" />
              <span>Pay Udhaar via UPI / Cash</span>
            </button>
          </div>
        </div>

        {/* Formula Guarantee Banner */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
              ∑
            </div>
            <div>
              <p className="font-bold text-blue-950">
                Transparent Formula:
              </p>
              <p className="font-mono text-blue-800 text-[11px]">
                Outstanding Balance = Opening Balance + Credit Purchases - Payments - Credit Notes
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-white px-3 py-1 rounded-full border border-blue-300 text-blue-900">
            Credit Limit: {formatINR(business?.creditLimit || 150000)}
          </span>
        </div>

        {/* Three KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Purchases Billed
            </span>
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatINR(totalBilled)}
            </p>
            <p className="text-[11px] text-slate-500">Total delivered wholesale goods</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Payments Made
            </span>
            <p className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              {formatINR(totalPaid)}
            </p>
            <p className="text-[11px] text-slate-500">Cleared via UPI & Cash</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Remaining Udhaar Balance
            </span>
            <p className="text-2xl font-black text-amber-600 tracking-tight font-mono">
              {formatINR(totalBalance)}
            </p>
            <p className="text-[11px] text-amber-700 font-semibold">Available credit: {formatINR((business?.creditLimit || 150000) - totalBalance)}</p>
          </div>
        </div>

        {/* Passbook Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Passbook Transaction History
            </h3>
            <button
              onClick={() => window.print()}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Txn #</th>
                  <th className="py-3 px-4">Wholesaler</th>
                  <th className="py-3 px-4">Type & Details</th>
                  <th className="py-3 px-4 text-right">Debit (+)</th>
                  <th className="py-3 px-4 text-right">Credit (-)</th>
                  <th className="py-3 px-4 text-right">Running Balance</th>
                  <th className="py-3 px-4 text-center">Due Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => {
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
                        {t.wholesalerName}
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
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Disputed
                          </span>
                        ) : t.disputeStatus === "RESOLVED" ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            Resolved
                          </span>
                        ) : t.debit > 0 ? (
                          <button
                            onClick={() => setDisputeTargetTxn(t)}
                            className="text-[11px] text-amber-700 hover:text-amber-800 font-bold hover:underline"
                          >
                            Raise Dispute
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Paid</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {isPayModalOpen && (
          <PaymentModal
            wholesalerId="biz_wholesaler_1"
            wholesalerName="Gupta Wholesale Mega Mart"
            shopkeeperId={business?.id || "biz_shopkeeper_1"}
            shopkeeperName={business?.name || "Aapki Apni Kirana Store"}
            outstandingBalance={totalBalance}
            onClose={() => setIsPayModalOpen(false)}
            onSuccess={triggerRefresh}
          />
        )}

        {/* Dispute Modal */}
        {disputeTargetTxn && (
          <DisputeModal
            transaction={disputeTargetTxn}
            onClose={() => setDisputeTargetTxn(null)}
            onSuccess={triggerRefresh}
          />
        )}
      </div>
    </AppLayout>
  );
}
