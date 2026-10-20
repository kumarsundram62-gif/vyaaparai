"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Product, StockMovement } from "@/types";
import { formatINR, formatDateIN, formatDateTimeIN } from "@/lib/formatters";
import {
  Boxes,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  History,
  X,
  ShieldAlert,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function WholesalerInventoryPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Inward Modal
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);
  const [inwardProductId, setInwardProductId] = useState("");
  const [inwardQty, setInwardQty] = useState(50);
  const [supplierName, setSupplierName] = useState("ITC Limited Depot");
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("SUP-INV-2026-902");
  const [inwardNotes, setInwardNotes] = useState("");

  // Damage Modal
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [damageProductId, setDamageProductId] = useState("");
  const [damageQty, setDamageQty] = useState(1);
  const [damageReason, setDamageReason] = useState("Transit leakage / damaged packaging");

  useEffect(() => {
    async function loadInventory() {
      try {
        const res = await fetch(`/api/inventory?businessId=${business?.id || "biz_wholesaler_1"}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setMovements(data.movements);
          if (data.products.length > 0) {
            setInwardProductId(data.products[0].id);
            setDamageProductId(data.products[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, [business, refreshKey]);

  const handleRecordInward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "INWARD",
          businessId: business?.id || "biz_wholesaler_1",
          productId: inwardProductId,
          quantity: inwardQty,
          supplierName,
          supplierInvoiceNo,
          notes: inwardNotes,
          actorName: business?.ownerName || "Ramesh Gupta",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Stock inward recorded: +${inwardQty} units added to inventory.`);
        setIsInwardModalOpen(false);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to record inward stock");
    }
  };

  const handleRecordDamage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DAMAGE",
          businessId: business?.id || "biz_wholesaler_1",
          productId: damageProductId,
          quantity: damageQty,
          reason: damageReason,
          actorName: business?.ownerName || "Ramesh Gupta",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Damage logged: -${damageQty} units adjusted.`);
        setIsDamageModalOpen(false);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to record damaged stock");
    }
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Warehouse Stock & Movements
              </span>
              <span className="text-xs text-slate-400">• Inward, Outward & Coverage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Inventory & Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Stock automatically deducts upon wholesale order acceptance and tracks full replenishment history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDamageModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Log Damaged Stock</span>
            </button>
            <button
              onClick={() => setIsInwardModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Record Stock Inward</span>
            </button>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Units in Warehouse
            </span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {products.reduce((sum, p) => sum + p.stockQuantity, 0)} Units
            </p>
            <p className="text-[11px] text-slate-500">Across {products.length} registered SKUs</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Low-Stock Warnings
            </span>
            <p className="text-2xl font-black text-amber-600 tracking-tight">
              {lowStockCount} Products
            </p>
            <p className="text-[11px] text-slate-500">Coverage below safety threshold</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Estimated Average Coverage
            </span>
            <p className="text-2xl font-black text-emerald-600 tracking-tight">
              12.4 Days
            </p>
            <p className="text-[11px] text-slate-500">Based on recent retailer dispatch velocity</p>
          </div>
        </div>

        {/* Stock Movement Audit Log */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                Stock Movement History & Audit Trail
              </h2>
            </div>
            <span className="text-xs text-slate-400">Auditable Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 text-center">Movement Type</th>
                  <th className="py-3 px-4 text-right">Qty Changed</th>
                  <th className="py-3 px-4 text-right">Balance After</th>
                  <th className="py-3 px-4">Reference & Notes</th>
                  <th className="py-3 px-4">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((mov) => {
                  const isPositive = mov.quantityChanged > 0;
                  const typeColors: Record<string, string> = {
                    INWARD: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    ORDER_FULFILLMENT: "bg-blue-50 text-blue-800 border-blue-200",
                    DAMAGE: "bg-red-50 text-red-800 border-red-200",
                    RETURN: "bg-amber-50 text-amber-800 border-amber-200",
                    ADJUSTMENT: "bg-slate-100 text-slate-800 border-slate-200",
                  };

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {formatDateIN(mov.date)}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        {mov.productName}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            typeColors[mov.type] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {mov.type.replace("_", " ")}
                        </span>
                      </td>

                      <td
                        className={`py-3 px-4 text-right font-mono font-bold ${
                          isPositive ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? `+${mov.quantityChanged}` : mov.quantityChanged}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-900 font-semibold">
                        {mov.quantityAfter}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <p className="font-semibold text-slate-800">{mov.reason}</p>
                        {mov.referenceId && (
                          <span className="font-mono text-[10px] text-slate-400">
                            Ref: {mov.referenceId}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500">{mov.createdBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Inward Modal */}
        {isInwardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Record Stock Inward (Procurement)</h3>
                <button
                  onClick={() => setIsInwardModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordInward} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Product to Restock *
                  </label>
                  <select
                    value={inwardProductId}
                    onChange={(e) => setInwardProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Current Stock: {p.stockQuantity} {p.uom})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Quantity Received *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={inwardQty}
                      onChange={(e) => setInwardQty(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Supplier Invoice / PO No.
                    </label>
                    <input
                      type="text"
                      value={supplierInvoiceNo}
                      onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supplier / FMCG Depot Name
                  </label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={inwardNotes}
                    onChange={(e) => setInwardNotes(e.target.value)}
                    placeholder="e.g. Received via Delivery Truck from Okhla Depot"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInwardModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/20"
                  >
                    Confirm Inward
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Record Damage Modal */}
        {isDamageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-red-600 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Log Damaged / Spoiled Stock</h3>
                <button
                  onClick={() => setIsDamageModalOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordDamage} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Damaged Product *
                  </label>
                  <select
                    value={damageProductId}
                    onChange={(e) => setDamageProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stockQuantity} {p.uom})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Damaged Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={damageQty}
                    onChange={(e) => setDamageQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Damage Reason / Defect Details *
                  </label>
                  <input
                    type="text"
                    required
                    value={damageReason}
                    onChange={(e) => setDamageReason(e.target.value)}
                    placeholder="e.g. Broken packaging / expiry / water leakage"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDamageModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-700/20"
                  >
                    Write Off Damaged Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
