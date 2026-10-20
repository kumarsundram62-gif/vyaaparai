"use client";

import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/formatters";
import {
  Sparkles,
  Bot,
  Send,
  ShoppingCart,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShopkeeperAIPage() {
  const { business, setIsAIChatOpen, showToast } = useApp();
  const router = useRouter();

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
          businessId: business?.id || "biz_shopkeeper_1",
          role: "shopkeeper",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data);
      }
    } catch (err) {
      console.error(err);
      showToast("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>व्यापार AI Kirana Advisor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Smart Restock & Business Advisor
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Ask questions in simple Hindi or English to predict inventory run-outs, find which wholesaler offers best margins, and calculate optimal reorder packages.
            </p>
          </div>

          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg transition-all shrink-0"
          >
            <Bot className="w-4 h-4" />
            <span>Open Floating Co-Pilot</span>
          </button>
        </div>

        {/* Chat Query Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            Ask Anything About Your Kirana Shop (हिंदी / English):
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
              placeholder="e.g. Mera kaunsa product jaldi khatam hone wala hai? or What should I reorder?"
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
              "Mera kaunsa product jaldi khatam hone wala hai?",
              "Which products should I reorder this week?",
              "Mera udhaar kitna baki hai?",
              "Mere kis wholesaler se sabse zyada purchase hoti hai?",
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

          {/* Response Box */}
          {response && (
            <div className="mt-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs animate-scale-up">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Kirana Analysis</span>
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

              {response.suggestedAction && (
                <div className="pt-2">
                  <Link
                    href={response.suggestedAction.payload || "/shopkeeper/marketplace"}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <span>{response.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
