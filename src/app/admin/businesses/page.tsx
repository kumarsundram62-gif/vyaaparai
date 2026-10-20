"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Business } from "@/types";
import { formatINR, formatDateIN } from "@/lib/formatters";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Building2,
  Store,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";

export default function AdminBusinessesPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const res = await fetch("/api/businesses");
        const data = await res.json();
        if (data.success) {
          setBusinesses(data.businesses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBusinesses();
  }, [business, refreshKey]);

  const handleUpdateStatus = async (
    businessId: string,
    verificationStatus: "VERIFIED" | "PENDING_REVIEW" | "UNVERIFIED"
  ) => {
    try {
      const res = await fetch("/api/businesses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          verificationStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Business verification updated to ${verificationStatus}`);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status");
    }
  };

  const filtered = businesses.filter((b) => {
    const matchesRole = roleFilter === "all" || b.role === roleFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                KYC & Trust Registry
              </span>
              <span className="text-xs text-slate-400">• Business Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Verified Business Accounts & GSTINs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review government GSTIN registrations, business proof documents, and sanctioned credit ceilings.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, proprietor, or city..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-xs"
            />
          </div>

          <div className="flex gap-2">
            {["all", "wholesaler", "shopkeeper"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                  roleFilter === r
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {r === "all" ? "All Roles" : `${r}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Business & Owner</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">GSTIN Details</th>
                  <th className="py-3 px-4 text-right">Credit Limit</th>
                  <th className="py-3 px-4 text-center">KYC Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{b.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.ownerName} • {b.phone}
                      </p>
                      <p className="text-[10px] text-slate-400">{b.type}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          b.role === "wholesaler"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : b.role === "shopkeeper"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-purple-50 text-purple-800 border-purple-200"
                        }`}
                      >
                        {b.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{b.city}, {b.state}</p>
                      <p className="text-[10px] text-slate-400">{b.pincode}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {b.gstin ? (
                        <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {b.gstin}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not Provided (Unregistered)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {b.creditLimit ? formatINR(b.creditLimit) : "N/A"}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          b.verificationStatus === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : b.verificationStatus === "PENDING_REVIEW"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}
                      >
                        {b.verificationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {b.verificationStatus !== "VERIFIED" ? (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "VERIFIED")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            Approve KYC
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "UNVERIFIED")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
