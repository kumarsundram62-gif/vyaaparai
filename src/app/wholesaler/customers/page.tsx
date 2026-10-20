"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Business, LedgerTransaction } from "@/types";
import { formatINR, formatDateIN, formatWhatsAppUrl } from "@/lib/formatters";
import {
  Users,
  CreditCard,
  MessageSquare,
  Banknote,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import PaymentModal from "@/components/PaymentModal";

export default function WholesalerCustomersPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [customers, setCustomers] = useState<Business[]>([]);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Payment Modal state
  const [paymentTarget, setPaymentTarget] = useState<{
    id: string;
    name: string;
    balance: number;
  } | null>(null);

  // WhatsApp Reminder Modal
  const [whatsappModalCust, setWhatsappModalCust] = useState<{
    name: string;
    phone: string;
    balance: number;
    shopName: string;
  } | null>(null);
  const [langPreference, setLangPreference] = useState<"hindi" | "english">("hindi");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const [bizRes, ledgerRes] = await Promise.all([
          fetch("/api/businesses?role=shopkeeper"),
          fetch(`/api/ledger?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
        ]);

        const bizData = await bizRes.json();
        const ledgerData = await ledgerRes.json();

        if (bizData.success) setCustomers(bizData.businesses);
        if (ledgerData.success) setTransactions(ledgerData.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, [business, refreshKey]);

  // Compute balance per customer
  const customerLedgerMap: Record<string, { balance: number; billed: number; paid: number }> = {};
  transactions.forEach((t) => {
    if (!customerLedgerMap[t.shopkeeperId]) {
      customerLedgerMap[t.shopkeeperId] = { balance: 0, billed: 0, paid: 0 };
    }
    customerLedgerMap[t.shopkeeperId].billed += t.debit;
    customerLedgerMap[t.shopkeeperId].paid += t.credit;
    customerLedgerMap[t.shopkeeperId].balance += t.debit - t.credit;
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWhatsAppMessage = (custName: string, shopName: string, balance: number) => {
    if (langPreference === "hindi") {
      return `नमस्ते ${custName} जी, ${business?.name || "गुप्ता होलसेल"} से आपका कुल बकाया उधारी ${formatINR(balance)} है। कृपया समय पर भुगतान करें ताकि आपकी सप्लाई सुचारू रूप से चलती रहे। धन्यवाद!`;
    }
    return `Dear ${custName} (${shopName}), gentle reminder from ${business?.name || "Gupta Wholesale Mega Mart"} regarding pending balance of ${formatINR(balance)}. Please arrange payment at your earliest convenience. Thank you!`;
  };

  const handleOpenWhatsApp = (cust: any) => {
    const balance = Math.max(0, customerLedgerMap[cust.id]?.balance || 0);
    const msg = getWhatsAppMessage(cust.ownerName, cust.name, balance);
    const url = formatWhatsAppUrl(cust.phone, msg);
    window.open(url, "_blank");
    showToast(`WhatsApp reminder opened for ${cust.ownerName}`);
    setWhatsappModalCust(null);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Customer Network & Udhaar
              </span>
              <span className="text-xs text-slate-400">• Retail Kirana Partnerships</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Retail Customer Directory & Credit Limits
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage sanctioned credit limits, track outstanding dues, and dispatch payment reminders via WhatsApp.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search retail stores by shop name, owner, or locality (e.g. Chandni Chowk, Suresh)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((cust) => {
            const data = customerLedgerMap[cust.id] || { balance: 0, billed: 0, paid: 0 };
            const creditLimit = cust.creditLimit || 100000;
            const balance = Math.max(0, data.balance);
            const utilizationPct = Math.min(100, Math.round((balance / creditLimit) * 100));

            return (
              <div
                key={cust.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{cust.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Prop: <strong className="text-slate-700">{cust.ownerName}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">{cust.city}, {cust.state}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        cust.verificationStatus === "VERIFIED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {cust.verificationStatus}
                    </span>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Sanctioned Credit Limit:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatINR(creditLimit)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Outstanding Udhaar:</span>
                      <span className="font-mono font-bold text-amber-600 text-sm">
                        {formatINR(balance)}
                      </span>
                    </div>

                    {/* Progress bar of limit used */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Limit Utilized</span>
                        <span className="font-semibold">{utilizationPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            utilizationPct > 80
                              ? "bg-red-500"
                              : utilizationPct > 50
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${utilizationPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      setPaymentTarget({
                        id: cust.id,
                        name: cust.name,
                        balance,
                      })
                    }
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs text-center transition-colors"
                  >
                    Record Payment
                  </button>

                  <button
                    onClick={() =>
                      setWhatsappModalCust({
                        name: cust.ownerName,
                        shopName: cust.name,
                        phone: cust.phone,
                        balance,
                      })
                    }
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/wholesaler/ledger?shopkeeperId=${cust.id}`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                    title="View Ledger"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Modal */}
        {paymentTarget && (
          <PaymentModal
            wholesalerId={business?.id || "biz_wholesaler_1"}
            wholesalerName={business?.name || "Gupta Wholesale Mega Mart"}
            shopkeeperId={paymentTarget.id}
            shopkeeperName={paymentTarget.name}
            outstandingBalance={paymentTarget.balance}
            onClose={() => setPaymentTarget(null)}
            onSuccess={triggerRefresh}
          />
        )}

        {/* WhatsApp Reminder Preview Modal */}
        {whatsappModalCust && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                  <h3 className="font-bold text-sm">Send WhatsApp Payment Reminder</h3>
                </div>
                <button
                  onClick={() => setWhatsappModalCust(null)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div>
                  <span className="text-slate-500">To Customer:</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {whatsappModalCust.name} ({whatsappModalCust.shopName})
                  </p>
                  <p className="font-mono text-slate-500">{whatsappModalCust.phone}</p>
                </div>

                {/* Language Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Language Template:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLangPreference("hindi")}
                      className={`p-2 rounded-xl border font-bold ${
                        langPreference === "hindi"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      हिंदी (Hindi)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLangPreference("english")}
                      className={`p-2 rounded-xl border font-bold ${
                        langPreference === "english"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Message Box */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message Preview:</label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-sans text-xs">
                    {getWhatsAppMessage(
                      whatsappModalCust.name,
                      whatsappModalCust.shopName,
                      whatsappModalCust.balance
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWhatsappModalCust(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(whatsappModalCust)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
