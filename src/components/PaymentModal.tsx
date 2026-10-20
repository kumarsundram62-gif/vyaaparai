"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/formatters";
import { X, CheckCircle2, QrCode, Banknote, Landmark, FileText } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface PaymentModalProps {
  wholesalerId: string;
  wholesalerName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  orderId?: string;
  invoiceNumber?: string;
  outstandingBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  wholesalerId,
  wholesalerName,
  shopkeeperId,
  shopkeeperName,
  orderId,
  invoiceNumber,
  outstandingBalance,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { user, showToast } = useApp();

  const [amount, setAmount] = useState<number>(outstandingBalance || 5000);
  const [method, setMethod] = useState<"UPI" | "CASH" | "BANK_TRANSFER" | "CHEQUE">("UPI");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast("Please enter a valid payment amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RECORD_PAYMENT",
          wholesalerId,
          wholesalerName,
          shopkeeperId,
          shopkeeperName,
          orderId,
          invoiceNumber,
          amount: Number(amount),
          paymentMethod: method,
          referenceNotes: notes || `Payment recorded via ${method}`,
          actorName: user?.name || "User",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Payment of ${formatINR(amount)} successfully recorded in shared ledger!`);
        onSuccess();
        onClose();
      } else {
        showToast(data.error || "Failed to record payment");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error recording payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm">Record / Make Payment</h3>
            <p className="text-[11px] text-slate-300">
              Shared Digital Udhaar & Ledger
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Party details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">To Wholesaler:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{wholesalerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">From Shopkeeper:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{shopkeeperName}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Total Outstanding:</span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">
                {formatINR(outstandingBalance)}
              </span>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              max={outstandingBalance > 0 ? outstandingBalance : undefined}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full text-base font-bold font-mono px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            />

            {/* Presets */}
            {outstandingBalance > 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAmount(outstandingBalance)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200 hover:bg-emerald-100"
                >
                  Full ({formatINR(outstandingBalance)})
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(Math.round(outstandingBalance / 2))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200 hover:bg-slate-200"
                >
                  50% ({formatINR(Math.round(outstandingBalance / 2))})
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(5000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200 hover:bg-slate-200"
                >
                  ₹5,000
                </button>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod("UPI")}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold text-left transition-colors ${
                  method === "UPI"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("CASH")}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold text-left transition-colors ${
                  method === "CASH"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash to Agent</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("BANK_TRANSFER")}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold text-left transition-colors ${
                  method === "BANK_TRANSFER"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>NEFT / RTGS</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("CHEQUE")}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold text-left transition-colors ${
                  method === "CHEQUE"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Cheque</span>
              </button>
            </div>
          </div>

          {/* UPI Simulated QR view */}
          {method === "UPI" && (
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center space-y-2">
              <div className="w-24 h-24 mx-auto bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-900">
                UPI ID: guptawholesale@hdfcbank
              </p>
              <p className="text-[10px] text-slate-500">
                Scan via PhonePe, GPay, Paytm or BHIM to complete transfer.
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Transaction Reference / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. UTR #4829103982 or Cash handed to Driver Bablu"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {loading ? "Recording..." : `Confirm Payment`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
