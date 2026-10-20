"use client";

import React, { useState } from "react";
import { LedgerTransaction } from "@/types";
import { formatINR, formatDateIN } from "@/lib/formatters";
import { AlertTriangle, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface DisputeModalProps {
  transaction: LedgerTransaction;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DisputeModal({
  transaction,
  onClose,
  onSuccess,
}: DisputeModalProps) {
  const { user, showToast } = useApp();

  const [reasonCategory, setReasonCategory] = useState("Damaged goods received");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast("Please provide details for the dispute");
      return;
    }

    setLoading(true);
    try {
      const fullReason = `${reasonCategory}: ${description}`;
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RAISE_DISPUTE",
          transactionId: transaction.id,
          reason: fullReason,
          raisedBy: user?.name || "Shopkeeper",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Dispute ticket raised. Wholesaler & Admin notified.");
        onSuccess();
        onClose();
      } else {
        showToast(data.error || "Failed to raise dispute");
      }
    } catch (err) {
      console.error(err);
      showToast("Error raising dispute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-scale-up">
        <div className="p-4 bg-amber-500 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-slate-950" />
            <h3 className="font-bold text-sm">Raise Transaction Dispute</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-900 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Transaction:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {transaction.transactionNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Amount:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatINR(transaction.debit || transaction.credit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Date:</span>
              <span className="text-slate-700 dark:text-slate-300">{formatDateIN(transaction.date)}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Dispute Category
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs font-semibold"
            >
              <option value="Damaged goods received">Damaged goods received</option>
              <option value="Quantity shortage / missing items">Quantity shortage / missing items</option>
              <option value="Pricing / billing rate discrepancy">Pricing / billing rate discrepancy</option>
              <option value="Duplicate entry">Duplicate entry in ledger</option>
              <option value="Payment not credited">Payment made but not credited</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Explanation & Supporting Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue (e.g. 2 bags of Atta had torn packaging upon delivery)..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Dispute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
