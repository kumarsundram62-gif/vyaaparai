"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  MessageCircle,
  MessageSquareQuote,
  Headphones,
  X,
  Phone,
} from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { SUPPORT_PHONE, SUPPORT_WHATSAPP_NUMBER } from "@/lib/constants";

export default function FloatingSupportWidget() {
  const { setIsAIChatOpen, isAIChatOpen } = useApp();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // If AI chat modal is open, we can hide or keep the launcher minimal
  if (isAIChatOpen) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Expanded mini-menu */}
        {isExpanded && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 space-y-1.5 animate-in slide-in-from-bottom-2 duration-200 mb-1 w-56">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span>Quick Support Hub</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct WhatsApp */}
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Namaste Shivam / VyaparAI Support! I have a question about the platform."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 truncate">
                <p className="truncate">WhatsApp Support</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  +91 7562817736
                </p>
              </div>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 truncate">
                <p className="truncate">Call Helpline</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  {SUPPORT_PHONE}
                </p>
              </div>
            </a>

            {/* Give Feedback */}
            <button
              onClick={() => {
                setIsExpanded(false);
                setFeedbackOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 truncate">
                <p className="truncate">Give Feedback</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  Shape upcoming features
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex items-center gap-2">
          {/* Quick WhatsApp Pill */}
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Namaste Shivam / VyaparAI Support! I have a question about the platform."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp (+91 7562817736)"
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-700/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Direct WhatsApp Support"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Quick Menu / Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Support Options"
            className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle Support Menu"
          >
            <Headphones className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </button>

          {/* Primary AI Assistant Launcher Button */}
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-teal-700/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Open VyaparAI Assistant"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300"></span>
            </span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span className="hidden sm:inline">VyaparAI Assistant</span>
            <span className="sm:hidden font-mono">AI</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
