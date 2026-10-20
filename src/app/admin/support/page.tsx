"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { SupportTicket, SupportTicketStatus, SupportTicketPriority } from "@/types";
import { formatDateIN, formatWhatsAppUrl } from "@/lib/formatters";
import {
  LifeBuoy,
  Phone,
  Mail,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Building2,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function AdminSupportPage() {
  const { showToast, refreshKey, triggerRefresh } = useApp();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch("/api/support");
        const data = await res.json();
        if (data.success && data.tickets) {
          setTickets(data.tickets);
        }
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, [refreshKey]);

  const handleUpdateTicket = async (
    id: string,
    updates: { status?: SupportTicketStatus; priority?: SupportTicketPriority; internalNotes?: string }
  ) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Ticket updated successfully");
        setEditingId(null);
        triggerRefresh();
      } else {
        showToast("Error updating ticket");
      }
    } catch (err) {
      showToast("Network error updating ticket");
    } finally {
      setUpdating(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "ALL" || ticket.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length,
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <LifeBuoy className="w-4 h-4" />
              <span>Customer Helpdesk Central</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Support Tickets &amp; Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Respond to customer issues, manage escalation status, and contact merchants directly via WhatsApp or Phone.
            </p>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tickets</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Open (Pending)</p>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{stats.open}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Resolved / Closed</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.resolved}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket ID, name, phone, or issue..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading support tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500 space-y-2">
            <LifeBuoy className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No tickets found</p>
            <p>All customer inquiries have been addressed or match zero filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const isEditing = editingId === ticket.id;
              const statusColors = {
                OPEN: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
                IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                RESOLVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
                CLOSED: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
              }[ticket.status] || "bg-slate-100 text-slate-800";

              const priorityColors = {
                LOW: "text-slate-500",
                MEDIUM: "text-blue-600 dark:text-blue-400 font-semibold",
                HIGH: "text-amber-600 dark:text-amber-400 font-bold",
                URGENT: "text-red-600 dark:text-red-400 font-bold animate-pulse",
              }[ticket.priority] || "text-slate-500";

              const whatsappUrl = ticket.phone
                ? formatWhatsAppUrl(
                    ticket.phone,
                    `Namaste ${ticket.name}! This is VyaparAI Support regarding your ticket #${ticket.id}: "${ticket.subject}".`
                  )
                : null;

              return (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors"
                >
                  {/* Top row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        #{ticket.id}
                      </span>
                      <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityColors}`}>
                        {ticket.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {formatDateIN(ticket.createdAt)}
                      </span>
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleUpdateTicket(ticket.id, {
                            status: e.target.value as SupportTicketStatus,
                          })
                        }
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${statusColors}`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject & Message */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                      {ticket.message}
                    </p>
                  </div>

                  {/* Merchant & Direct Contact Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {ticket.name} {ticket.businessName ? `(${ticket.businessName})` : ""}
                      </span>

                      {ticket.phone && (
                        <a
                          href={`tel:${ticket.phone}`}
                          className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{ticket.phone}</span>
                        </a>
                      )}

                      {ticket.email && (
                        <a
                          href={`mailto:${ticket.email}`}
                          className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 text-[11px]"
                        >
                          <Mail className="w-3 h-3 text-teal-600" />
                          <span>{ticket.email}</span>
                        </a>
                      )}
                    </div>

                    {/* Direct Quick Action Buttons */}
                    <div className="flex items-center gap-2">
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Reply</span>
                        </a>
                      )}

                      {ticket.phone && (
                        <a
                          href={`tel:${ticket.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Internal Notes Section */}
                  <div className="pt-2 text-xs">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Resolution details or internal notes..."
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 flex-1"
                        />
                        <button
                          onClick={() => handleUpdateTicket(ticket.id, { internalNotes: editNotes })}
                          disabled={updating}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        {ticket.internalNotes ? (
                          <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md italic truncate max-w-md">
                            Internal Note: {ticket.internalNotes}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">No notes recorded yet</span>
                        )}
                        <button
                          onClick={() => {
                            setEditingId(ticket.id);
                            setEditNotes(ticket.internalNotes || "");
                          }}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          {ticket.internalNotes ? "Edit Note" : "+ Add Note"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
