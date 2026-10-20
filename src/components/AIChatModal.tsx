"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Languages,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SUPPORT_PHONE } from "@/lib/constants";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  confidenceScore?: number;
  dataPoints?: { label: string; value: string }[];
  recommendations?: any[];
  suggestedAction?: {
    label: string;
    actionType: string;
    payload?: any;
  };
}

export default function AIChatModal() {
  const { isAIChatOpen, setIsAIChatOpen, business, role, showToast } = useApp();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preferredLang, setPreferredLang] = useState<"en" | "hi">("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text:
        role === "shopkeeper"
          ? "नमस्ते! मैं आपका व्यापारAI किराना एवं सपोर्ट सहायक हूँ। आप मुझसे स्टॉक की स्थिति, रीऑर्डर, उधारी खाता, या लॉगिन/सपोर्ट से जुड़े सवाल हिंदी या इंग्लिश में पूछ सकते हैं।"
          : "Hello! I am your VyaparAI Intelligence & Support Assistant. I analyze your sales trends, warehouse inventory, customer credit ledgers, and can assist with account troubleshooting or platform navigation. How may I help you today?",
    },
  ]);

  const supportChips = [
    "🔐 Login or account recovery help",
    "📞 How do I contact Shivam / Support?",
    "📦 Which products are low on stock?",
    "📖 Mera udhaar khata kitna baki hai?",
    "🏢 What is VyaparAI and how does it work?",
    "🛒 Where is my cart?",
  ];

  if (!isAIChatOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          businessId: business?.id,
          role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: data.answer,
          confidenceScore: data.confidenceScore,
          dataPoints: data.keyDataPoints,
          recommendations: data.recommendations,
          suggestedAction: data.suggestedAction,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            sender: "ai",
            text: "Sorry, I encountered an issue analyzing your records. Please try again or contact human support at " + SUPPORT_PHONE,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "ai",
          text: "Network error while processing AI analysis. For immediate assistance, please call " + SUPPORT_PHONE,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === "NAVIGATE" && action.payload) {
      setIsAIChatOpen(false);
      router.push(action.payload);
    } else if (action.actionType === "SEND_WHATSAPP" && action.payload) {
      window.open(action.payload, "_blank");
    } else if (action.actionType === "CALL_SUPPORT") {
      window.location.href = action.payload || "tel:+917562817736";
    } else {
      showToast(`Action: ${action.label}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">VyaparAI Assistant</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-[240px]">
                {business?.name || "VyaparAI B2B"} • English & हिंदी
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const nextLang = preferredLang === "en" ? "hi" : "en";
                setPreferredLang(nextLang);
                handleSend(
                  nextLang === "hi"
                    ? "नमस्ते, मुझे हिंदी में जानकारी दें"
                    : "Please assist me in English"
                );
              }}
              title="Toggle Language (EN / हिंदी)"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-[11px] flex items-center gap-1 border border-slate-700"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{preferredLang === "en" ? "हिंदी" : "EN"}</span>
            </button>
            <button
              onClick={() => setIsAIChatOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-slate-950/70">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold"
                      : "bg-emerald-600 dark:bg-teal-600 text-white text-xs"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2.5 ${
                    isUser
                      ? "bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 shadow-xs rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Confidence Badge */}
                  {m.confidenceScore && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {m.confidenceScore}% Accurate
                      </span>
                      <span>• Verified Logic</span>
                    </div>
                  )}

                  {/* Key Data Points */}
                  {m.dataPoints && m.dataPoints.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700/70 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Information Snapshot:
                      </p>
                      {m.dataPoints.map((dp, i) => (
                        <div key={i} className="flex justify-between text-[11px] gap-2">
                          <span className="text-slate-600 dark:text-slate-400">{dp.label}:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-200 text-right">{dp.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explainable Recommendation card */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{m.recommendations[0].title}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300">
                        {m.recommendations[0].recommendation}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                        Why: {m.recommendations[0].reasoning}
                      </p>
                    </div>
                  )}

                  {/* Suggested Action */}
                  {m.suggestedAction && (
                    <button
                      onClick={() => handleActionClick(m.suggestedAction)}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition-colors shadow-xs"
                    >
                      <span>{m.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Processing business intelligence & answers...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Quick Assistance Topics:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {supportChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-700 text-left truncate max-w-full"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Human Escalation Quick Bar */}
        <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Zero-credential logging
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/917562817736"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp Us
            </a>
            <span>•</span>
            <a
              href="tel:+917562817736"
              className="text-slate-700 dark:text-slate-300 font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              Call
            </a>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English or Hindi (e.g. Stock khatam hone wala hai?)..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-1.5">
            Never share passwords or OTPs. VyaparAI support will never request them.
          </p>
        </div>
      </div>
    </div>
  );
}
