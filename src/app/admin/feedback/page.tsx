"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { FeedbackItem, FeedbackCategory, FeedbackStatus } from "@/types";
import { formatDateIN } from "@/lib/formatters";
import {
  MessageSquareQuote,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Search,
  Save,
  Tag,
  Star,
  ExternalLink,
} from "lucide-react";

export default function AdminFeedbackPage() {
  const { showToast, refreshKey, triggerRefresh } = useApp();

  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadFeedback() {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        if (data.success && data.items) {
          setFeedbackList(data.items);
        }
      } catch (err) {
        console.error("Failed to load feedback", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeedback();
  }, [refreshKey]);

  const handleUpdateStatus = async (id: string, newStatus: FeedbackStatus) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Feedback status updated to ${newStatus}`);
        triggerRefresh();
      } else {
        showToast("Error updating feedback status");
      }
    } catch (err) {
      showToast("Network error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, internalNotes: editNotes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Internal notes saved");
        setEditingId(null);
        triggerRefresh();
      }
    } catch (err) {
      showToast("Network error saving notes");
    } finally {
      setUpdating(false);
    }
  };

  const filteredItems = feedbackList.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: feedbackList.length,
    new: feedbackList.filter((f) => f.status === "NEW").length,
    inProgress: feedbackList.filter((f) => f.status === "IN_PROGRESS" || f.status === "PLANNED").length,
    resolved: feedbackList.filter((f) => f.status === "RESOLVED").length,
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <MessageSquareQuote className="w-4 h-4" />
              <span>Voice of Customer Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              User Feedback &amp; Suggestions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track customer pain points, feature requests, and usability reviews from wholesalers and shopkeepers.
            </p>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">New &amp; Unreviewed</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.new}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Planned / In Progress</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Resolved / Shipped</p>
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
              placeholder="Search reference, keywords, or email..."
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
              <option value="NEW">New</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="ALL">All Categories</option>
              <option value="FEATURE_REQUEST">Feature Request</option>
              <option value="BUG_REPORT">Bug Report</option>
              <option value="UI_UX">UI / UX</option>
              <option value="AI_ASSISTANT">AI Assistant</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading feedback entries...</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500 space-y-2">
            <MessageSquareQuote className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No feedback matches your criteria</p>
            <p>Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isEditing = editingId === item.id;
              const statusColors = {
                NEW: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                UNDER_REVIEW: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
                PLANNED: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
                IN_PROGRESS: "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
                RESOLVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
              }[item.status] || "bg-slate-100 text-slate-800 border-slate-200";

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors"
                >
                  {/* Top row: Reference, Category, Date, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        {item.referenceNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.category.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {formatDateIN(item.createdAt)}
                      </span>
                      {/* Status Dropdown */}
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value as FeedbackStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${statusColors}`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="UNDER_REVIEW">UNDER REVIEW</option>
                        <option value="PLANNED">PLANNED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Submitter Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      {item.email ? (
                        <span>User: <strong className="text-slate-700 dark:text-slate-300">{item.email}</strong></span>
                      ) : (
                        <span>Anonymous Merchant</span>
                      )}
                    </div>

                    {/* Internal Notes Trigger */}
                    <div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add internal roadmap note..."
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 w-64"
                          />
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            disabled={updating}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            title="Save note"
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
                        <div className="flex items-center gap-2">
                          {item.internalNotes && (
                            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md italic max-w-xs truncate">
                              Note: {item.internalNotes}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditNotes(item.internalNotes || "");
                            }}
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                          >
                            {item.internalNotes ? "Edit Note" : "+ Add Internal Note"}
                          </button>
                        </div>
                      )}
                    </div>
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
