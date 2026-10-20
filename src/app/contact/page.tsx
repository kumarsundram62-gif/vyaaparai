"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import {
  BRAND_NAME,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_NUMBER,
  FOUNDER_NAME,
  FOUNDER_TITLE,
  FOUNDER_LINKEDIN,
  FOUNDER_IMAGE,
} from "@/lib/constants";
import {
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Building2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessRole: "shopkeeper",
    category: "General Inquiry",
    subject: "",
    message: "",
    priority: "MEDIUM",
    honeypot: "", // anti-spam
  });

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<{
    ticketNumber: string;
    id: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      // Spam honeypot tripped
      return;
    }

    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMsg("Please fill in your name, contact phone, and message.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          businessRole: formData.businessRole,
          category: formData.category,
          subject: formData.subject || `${formData.category} from ${formData.name}`,
          message: formData.message,
          priority: formData.priority,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setTicketResult({
          ticketNumber: data.ticket.ticketNumber,
          id: data.ticket.id,
        });
      } else {
        setErrorMsg(data.error || "Unable to submit support ticket. Please try calling us directly.");
      }
    } catch (err) {
      setErrorMsg("Network error occurred. Please contact us via WhatsApp or Phone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified B2B Helpdesk & Customer Support
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              We&apos;re Here to Help Your Business Grow
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have questions about your shared digital khata, wholesale order dispatch, GST
              invoicing, or need technical onboarding? Connect directly with our team.
            </p>
          </div>
        </section>

        {/* 4 Contact Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Direct Phone */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Direct Telephone
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Immediate assistance for urgent dispatch or payment queries.
                </p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-3 font-mono">
                  {SUPPORT_PHONE}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  Mon–Sat, 9:00 AM – 9:00 PM IST
                </p>
              </div>
              <div className="pt-4">
                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us Now</span>
                </a>
              </div>
            </div>

            {/* 2. Direct WhatsApp */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  WhatsApp Support
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fastest response for screenshots, invoice queries, or orders.
                </p>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 font-mono">
                  +{SUPPORT_WHATSAPP_NUMBER}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Usually replies within 15 minutes
                </p>
              </div>
              <div className="pt-4">
                <a
                  href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Namaste Shivam / VyaparAI Support! I need assistance with the platform."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-700/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 3. Official Email */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-100 dark:border-teal-800">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Official Email
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Formal business inquiries, GST invoicing records, partnerships.
                </p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-3 break-all font-mono">
                  {SUPPORT_EMAIL}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Detailed replies within 4 business hours
                </p>
              </div>
              <div className="pt-4">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* 4. Founder Profile Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0">
                    <Image
                      src={FOUNDER_IMAGE}
                      alt={FOUNDER_NAME}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{FOUNDER_NAME}</h3>
                    <p className="text-[10px] text-emerald-300 font-semibold">{FOUNDER_TITLE}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Passionate about empowering Indian MSMEs, local kiranas, and wholesale distributors.
                </p>
                <div className="mt-3 text-[11px] bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                  <span className="text-slate-400">Direct Founder Line: </span>
                  <span className="text-emerald-400 font-bold">{SUPPORT_PHONE}</span>
                </div>
              </div>
              <div className="pt-4">
                <a
                  href={FOUNDER_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Support Ticket Form & FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Submit a Support Request
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your request will be assigned to a dedicated support engineer and tracked with a unique reference number.
                  </p>
                </div>

                {ticketResult ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Support Ticket Created!
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        We have logged your query and our team will get in touch with you shortly.
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 inline-block max-w-sm">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Official Reference Ticket ID:
                      </p>
                      <p className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {ticketResult.ticketNumber}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Quote this number during phone or WhatsApp follow-up.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Namaste! I just logged ticket ${ticketResult.ticketNumber}. Can you please expedite?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Follow Up via WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setTicketResult(null);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            businessName: "",
                            businessRole: "shopkeeper",
                            category: "General Inquiry",
                            subject: "",
                            message: "",
                            priority: "MEDIUM",
                            honeypot: "",
                          });
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Submit Another Ticket
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Anti-spam honeypot */}
                    <input
                      type="text"
                      name="website"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {errorMsg && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Suresh Kumar"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@business.com"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Business Name / Firm Name
                        </label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({ ...formData, businessName: e.target.value })
                          }
                          placeholder="e.g. Aapki Apni Kirana Store"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Your Business Role
                        </label>
                        <select
                          value={formData.businessRole}
                          onChange={(e) =>
                            setFormData({ ...formData, businessRole: e.target.value })
                          }
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="shopkeeper">Retail Shopkeeper (Kirana / Store)</option>
                          <option value="wholesaler">Wholesale Distributor / Stockist</option>
                          <option value="fmcg_brand">FMCG Brand / Manufacturer</option>
                          <option value="other">Prospective User / Partner</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Issue Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Login / Account Access">Login / Account Access</option>
                          <option value="Shared Digital Udhaar">
                            Shared Digital Udhaar &amp; Ledger
                          </option>
                          <option value="Orders & Delivery">Orders &amp; Wholesale Delivery</option>
                          <option value="GST Invoicing">GST Invoicing &amp; HSN Codes</option>
                          <option value="AI Kirana Advisor">AI Kirana Advisor &amp; Restock</option>
                          <option value="General Inquiry">General Inquiry / Onboarding</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Detailed Description *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your question or issue in detail. If related to an order or invoice, mention the ID."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Priority:
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100"
                        >
                          <option value="LOW">Low (General)</option>
                          <option value="MEDIUM">Medium (Normal)</option>
                          <option value="HIGH">High (Urgent)</option>
                          <option value="CRITICAL">Critical (Blocking Ops)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-md shadow-emerald-700/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{loading ? "Submitting Ticket..." : "Submit Ticket"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* FAQs & Quick Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Frequently Asked Questions</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      How does the Shared Digital Udhaar (Khata) work?
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Both the wholesaler and retailer connect on VyaparAI. When an order is placed on credit, the transaction is automatically recorded in both accounts simultaneously, preventing dual bookkeeping discrepancies.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      What if I face login or OTP issues?
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      You can instantly switch demo roles using the navbar switcher or click the floating AI Assistant on the bottom right. The assistant guides you through recovery without ever asking for passwords or PINs.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      How can I speak directly with Founder Shivam Mishra?
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Shivam personally monitors enterprise and platform onboarding inquiries. You can connect via WhatsApp at <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">+91 7562817736</span> or message him on LinkedIn.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Are GST Invoices compliant with Indian tax rules?
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Yes. All generated invoices include standard 4-to-8 digit HSN codes, correct CGST/SGST/IGST tax rates (0%, 5%, 12%, 18%), and verified seller GSTINs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dedicated Enterprise Hotline Card */}
              <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-xl space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Priority Wholesale Support
                </span>
                <h3 className="text-lg font-bold">Need Bulk Onboarding for 50+ Kiranas?</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  We provide on-premise digital onboarding and ledger migration assistance for FMCG distributors across Tier 1, Tier 2, and Tier 3 Indian markets.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Hello Shivam! I am interested in Enterprise Distributor onboarding on VyaparAI."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Talk to Founder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingSupportWidget />
    </div>
  );
}
