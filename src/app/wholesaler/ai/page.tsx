"use client";

import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/formatters";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bot,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Send,
  Boxes,
} from "lucide-react";

export default function WholesalerAIPage() {
  const { business, setIsAIChatOpen, showToast } = useApp();

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (qText?: string) => {
    const text = qText || query;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          businessId: business?.id || "biz_wholesaler_1",
          role: "wholesaler",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data);
      }
    } catch (err) {
      console.error(err);
      showToast("Error processing AI request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Predictive B2B Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              VyaparAI Wholesale Intelligence & Forecasting
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Analyzes historical dispatch velocity, connected Kirana purchase frequency, and credit records to forecast cash flows and stock run-outs with explainable confidence.
            </p>
          </div>

          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg transition-all shrink-0"
          >
            <Bot className="w-4 h-4" />
            <span>Open Floating Assistant</span>
          </button>
        </div>

        {/* Interactive Query Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            Ask Business Questions in English or Hindi / Hinglish:
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Which shopkeepers have overdue payments? or Agle hafte kitna stock khatam hoga?"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Analyzing..." : "Ask AI"}</span>
            </button>
          </form>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              "Which shopkeepers have overdue payments?",
              "Mera kaunsa product jaldi khatam hone wala hai?",
              "Show my best-selling products this month.",
              "Forecast expected cash inflow for this week.",
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(chip);
                  handleAsk(chip);
                }}
                className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors border border-slate-200"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Response Container if any */}
          {response && (
            <div className="mt-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs animate-scale-up">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Business Analysis</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {response.confidenceScore}% Confidence Level
                </span>
              </div>

              <p className="text-slate-800 text-xs leading-relaxed font-medium whitespace-pre-line">
                {response.answer}
              </p>

              {response.keyDataPoints && response.keyDataPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {response.keyDataPoints.map((dp: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-slate-500 block">{dp.label}</span>
                      <span className="font-bold text-slate-900 text-xs">{dp.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Structured Forecast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Festival Demand Surge */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Demand Surge Forecast (+28%)
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                High Confidence
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on historical retail ordering frequencies from 18 connected Kirana stores over the last 6 months, high festival demand for staples begins in 10 days.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Aashirvaad Chakki Atta (10kg)</span>
                <span className="font-mono font-bold text-emerald-600">+150 Bags recommended</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Fortune Sunflower Oil (1L)</span>
                <span className="font-mono font-bold text-emerald-600">+80 Cartons recommended</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Depot turnaround: 48 hours</span>
              <span className="font-semibold text-emerald-700">Reason: Pre-Festival Stocking</span>
            </div>
          </div>

          {/* Card 2: Cash Inflow Forecast */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Expected Cash Inflows This Week
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Forecasted Inflow
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Calculated using due dates from active credit purchases and individual shopkeeper repayment scores:
            </p>

            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Forecasted Inflows by 26-Oct
              </span>
              <p className="text-3xl font-black font-mono text-emerald-400">
                ₹38,500.00
              </p>
              <p className="text-[11px] text-slate-300">
                Includes ₹8,923 overdue from Aapki Apni Kirana (92% probability)
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Risk status: Minimal Default Risk</span>
              <span className="font-semibold text-slate-700">Verified Retail Partners</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
