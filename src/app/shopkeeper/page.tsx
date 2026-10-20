"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { formatINR, formatDateIN } from "@/lib/formatters";
import {
  Store,
  ShoppingCart,
  Truck,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Order, RetailInventoryItem } from "@/types";

export default function ShopkeeperHomePage() {
  const { business, refreshKey, triggerRefresh, showToast, setIsAIChatOpen, addToCart } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [retailItems, setRetailItems] = useState<RetailInventoryItem[]>([]);
  const [totalUdhaar, setTotalUdhaar] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShopkeeperData() {
      try {
        const [ordersRes, invRes, ledgerRes] = await Promise.all([
          fetch(`/api/orders?shopkeeperId=${business?.id || "biz_shopkeeper_1"}`),
          fetch(`/api/inventory?role=shopkeeper&businessId=${business?.id || "biz_shopkeeper_1"}`),
          fetch(`/api/ledger?shopkeeperId=${business?.id || "biz_shopkeeper_1"}`),
        ]);

        const ordersData = await ordersRes.json();
        const invData = await invRes.json();
        const ledgerData = await ledgerRes.json();

        if (ordersData.success) setOrders(ordersData.orders);
        if (invData.success) setRetailItems(invData.items || []);
        if (ledgerData.success) setTotalUdhaar(ledgerData.totalBalance || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadShopkeeperData();
  }, [business, refreshKey]);

  const pendingDeliveryOrder = orders.find(
    (o) => o.status === "DISPATCHED" || o.status === "ACCEPTED" || o.status === "PACKED"
  );
  const lowStockItems = retailItems.filter((i) => i.currentStock <= i.lowStockThreshold);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Kirana Retailer Portal
              </span>
              <span className="text-xs text-slate-400">• Chandni Chowk, Delhi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              नमस्ते, {business?.ownerName || "Suresh Kumar"}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {business?.name || "Aapki Apni Kirana Store"} • Sanctioned Credit Limit: {formatINR(business?.creditLimit || 150000)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-700/20 hover:scale-102 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>व्यापार AI Kirana Advisor</span>
            </button>
            <Link
              href="/shopkeeper/marketplace"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Order Stock</span>
            </Link>
          </div>
        </div>

        {/* Live Delivery Banner if in transit */}
        {pendingDeliveryOrder && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Order #{pendingDeliveryOrder.orderNumber} is on the way!
                  </span>
                  <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.2 rounded-full">
                    {pendingDeliveryOrder.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Driver: {pendingDeliveryOrder.dispatchDetails?.trackingContact || "Local tempo dispatch"} • Vehicle: {pendingDeliveryOrder.dispatchDetails?.vehicleNumber || "DL-1LE-4982"}
                </p>
              </div>
            </div>
            <Link
              href="/shopkeeper/orders"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Track Tempo Live
            </Link>
          </div>
        )}

        {/* Kirana Key Health Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Outstanding Udhaar */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Udhaar Balance
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 tracking-tight font-mono">
              {formatINR(totalUdhaar)}
            </p>
            <div className="text-[11px] text-slate-500">
              Limit: {formatINR(business?.creditLimit || 150000)} (6% used)
            </div>
          </div>

          {/* Metric 2: Low Stock Alerts */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Low-Stock Items
              </span>
              <div className="p-2 rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-red-600 tracking-tight">
              {lowStockItems.length} Products
            </p>
            <div className="text-[11px] text-red-600 font-semibold">
              Risk of walk-in stockout
            </div>
          </div>

          {/* Metric 3: Total Orders */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Wholesale Purchases
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {orders.length} Orders
            </p>
            <div className="text-[11px] text-emerald-600 font-semibold">
              Gupta Wholesale & Agarwal Spices
            </div>
          </div>

          {/* Metric 4: Daily Counter Sales */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kirana Stock Managed
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {retailItems.length} SKUs
            </p>
            <div className="text-[11px] text-slate-500">
              Live counter stock tracking
            </div>
          </div>
        </div>

        {/* AI Restock Suggestion Card */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Smart Reorder Recommendation</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">
              Tata Tea Gold (2 boxes remaining) & Aashirvaad Atta
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your shop&apos;s daily counter sales velocity of 1.5 tea boxes/day, you will run out of stock by Friday morning. Recommended reorder: 12 boxes.
            </p>
          </div>

          <Link
            href="/shopkeeper/marketplace"
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Reorder from Gupta Wholesale
          </Link>
        </div>

        {/* Two Columns: Low-Stock Kirana Items & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Low-Stock Products in Kirana */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Kirana Low-Stock Alerts
                </h3>
                <p className="text-[11px] text-slate-500">
                  Items below safety stock threshold
                </p>
              </div>
              <Link
                href="/shopkeeper/inventory"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Manage Shop Stock
              </Link>
            </div>

            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Remaining: <strong className="text-amber-800">{item.currentStock} {item.uom}</strong> (Min: {item.lowStockThreshold})
                    </p>
                  </div>
                  <Link
                    href="/shopkeeper/marketplace"
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Reorder Stock
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Recent Wholesale Orders */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Recent Wholesale Orders
                </h3>
                <p className="text-[11px] text-slate-500">
                  Status & Delivery Tracking
                </p>
              </div>
              <Link
                href="/shopkeeper/orders"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-800">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {o.wholesalerName} • {formatDateIN(o.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900">
                      {formatINR(o.totalAmount)}
                    </p>
                    <Link
                      href="/shopkeeper/orders"
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
