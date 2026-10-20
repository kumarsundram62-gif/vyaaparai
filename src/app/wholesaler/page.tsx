"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { formatINR, formatDateIN } from "@/lib/formatters";
import {
  TrendingUp,
  Package,
  Truck,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Order, Product } from "@/types";
import InvoiceModal from "@/components/InvoiceModal";

export default function WholesalerDashboard() {
  const { business, refreshKey, triggerRefresh, showToast, setIsAIChatOpen } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalReceivable, setTotalReceivable] = useState(0);
  const [customerBalances, setCustomerBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, productsRes, ledgerRes] = await Promise.all([
          fetch(`/api/orders?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
          fetch(`/api/products?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
          fetch(`/api/ledger?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        const ledgerData = await ledgerRes.json();

        if (ordersData.success) setOrders(ordersData.orders);
        if (productsData.success) setProducts(productsData.products);
        if (ledgerData.success) {
          setTotalReceivable(ledgerData.totalReceivable || 0);
          setCustomerBalances(ledgerData.customerBalances || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [business, refreshKey]);

  // Derived KPI metrics
  const totalSales = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const completedOrders = orders.filter((o) => o.status === "DELIVERED");
  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);

  const handleQuickAccept = async (orderId: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action: "ACCEPT",
          actorName: business?.ownerName || "Ramesh Gupta",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Order accepted! Stock deducted from warehouse inventory.");
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome & Live Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Wholesaler Command Center
              </span>
              <span className="text-xs text-slate-400">• Azadpur Mandi, Delhi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {business?.name || "Gupta Wholesale Mega Mart"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Proprietor: {business?.ownerName} • GSTIN: {business?.gstin || "07AAAAA1234A1Z5"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Co-Pilot</span>
            </button>
            <Link
              href="/wholesaler/products"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Low Stock Banner Alert if any */}
        {lowStockProducts.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {lowStockProducts.length} Products Below Safety Stock Threshold!
                </p>
                <p className="text-slate-600 text-[11px]">
                  {lowStockProducts.map((p) => p.name.split("(")[0]).join(", ")} are running low.
                </p>
              </div>
            </div>
            <Link
              href="/wholesaler/inventory"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 transition-colors"
            >
              Procure Depot Stock
            </Link>
          </div>
        )}

        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Sales */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total B2B Sales
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(totalSales)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </div>
          </div>

          {/* Card 2: Market Outstanding Udhaar */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Outstanding Udhaar
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 tracking-tight font-mono">
              {formatINR(totalReceivable)}
            </p>
            <div className="text-[11px] text-slate-500">
              Across {customerBalances.length} active Kirana stores
            </div>
          </div>

          {/* Card 3: Pending Orders */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Pending Orders
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {pendingOrders.length}
            </p>
            <div className="text-[11px] text-blue-600 font-semibold">
              Needs warehouse confirmation
            </div>
          </div>

          {/* Card 4: Active Products */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                FMCG Products
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {products.length} Items
            </p>
            <div className="text-[11px] text-slate-500">
              Across 6 product categories
            </div>
          </div>
        </div>

        {/* Section: Incoming Orders Requiring Action */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                Recent Orders & Dispatch Status
              </h2>
              <p className="text-xs text-slate-500">
                Live order stream from connected Kirana retailers
              </p>
            </div>
            <Link
              href="/wholesaler/orders"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Shopkeeper / Store</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4 text-right">Order Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => {
                  const statusColors: Record<string, string> = {
                    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
                    ACCEPTED: "bg-blue-50 text-blue-800 border-blue-200",
                    PACKED: "bg-indigo-50 text-indigo-800 border-indigo-200",
                    DISPATCHED: "bg-purple-50 text-purple-800 border-purple-200",
                    DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    CANCELLED: "bg-red-50 text-red-800 border-red-200",
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {formatDateIN(order.createdAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{order.shopkeeperName}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                          {order.deliveryAddress}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 font-medium">
                          {order.items.length} product(s)
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {order.items.map((i) => `${i.productName.split("(")[0]} (${i.quantity})`).join(", ")}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {formatINR(order.totalAmount)}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            statusColors[order.status] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() => handleQuickAccept(order.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors shadow-xs"
                            >
                              Accept
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] hover:bg-slate-200 transition-colors"
                          >
                            Tax Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two-Column Grid: Customer Credit Ageing & AI Intelligence Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Udhaar Balances */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Shopkeeper Credit Records (Udhaar)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Real-time shared ledger balances
                </p>
              </div>
              <Link
                href="/wholesaler/ledger"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Open Ledger
              </Link>
            </div>

            <div className="space-y-3">
              {customerBalances.map((cust) => (
                <div
                  key={cust.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{cust.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Last transaction: {formatDateIN(cust.lastTxnDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-amber-600 text-sm">
                      {formatINR(cust.balance)}
                    </p>
                    <Link
                      href="/wholesaler/customers"
                      className="text-[10px] font-bold text-emerald-600 hover:underline"
                    >
                      Remind on WhatsApp
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Restock & Intelligence Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Restock Intelligence</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight">
                Festival Season Demand Uptick Expected (+28%)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Analysis of 54 historical orders reveals a significant 28% demand spike for Aashirvaad Atta and Fortune Cooking Oil in the next 14 days. Depot inward replenishment PO recommended.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                94% Confidence • ERP Sales Velocity
              </span>
              <button
                onClick={() => setIsAIChatOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
              >
                View Full Forecast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </AppLayout>
  );
}
