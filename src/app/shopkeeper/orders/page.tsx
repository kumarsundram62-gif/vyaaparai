"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Order } from "@/types";
import { formatINR, formatDateIN, formatDateTimeIN } from "@/lib/formatters";
import {
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Phone,
  Package,
} from "lucide-react";
import Link from "next/link";
import InvoiceModal from "@/components/InvoiceModal";
import DisputeModal from "@/components/DisputeModal";

export default function ShopkeeperOrdersPage() {
  const { business, refreshKey, addToCart, showToast } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch(`/api/orders?shopkeeperId=${business?.id || "biz_shopkeeper_1"}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [business, refreshKey]);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Mock product reconstruction for cart
      addToCart(
        {
          id: item.productId,
          wholesalerId: order.wholesalerId,
          wholesalerName: order.wholesalerName,
          sku: item.sku,
          name: item.productName,
          category: "General",
          brand: "FMCG",
          description: "",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
          uom: item.uom,
          purchasePrice: item.unitPrice * 0.9,
          wholesalePrice: item.unitPrice,
          retailMrp: Math.round(item.unitPrice * 1.15),
          moq: 1,
          stockQuantity: 100,
          lowStockThreshold: 10,
          isActive: true,
          createdAt: "",
          updatedAt: "",
        },
        item.quantity
      );
    });
    showToast(`Items from order #${order.orderNumber} added to cart!`);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "ACCEPTED":
        return 2;
      case "PACKED":
        return 3;
      case "DISPATCHED":
        return 4;
      case "DELIVERED":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Live Order Pipeline
              </span>
              <span className="text-xs text-slate-400">• Real-Time Tempo Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Order Status & Deliveries
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track warehouse confirmation, tempo dispatch in transit, and download official GST invoices.
            </p>
          </div>

          <Link
            href="/shopkeeper/marketplace"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Browse Products</span>
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getStepIndex(order.status);
            const isDelivered = order.status === "DELIVERED";

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-base">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        {order.wholesalerName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Placed on {formatDateTimeIN(order.createdAt)} • Payment: {order.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tax Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Visual Stepper Timeline */}
                {order.status !== "CANCELLED" && (
                  <div className="py-2">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${((step - 1) / 4) * 100}%` }}
                      />

                      {[
                        { num: 1, label: "Order Placed" },
                        { num: 2, label: "Accepted" },
                        { num: 3, label: "Packed" },
                        { num: 4, label: "In Transit" },
                        { num: 5, label: "Delivered" },
                      ].map((s) => {
                        const isDone = step >= s.num;
                        const isCurrent = step === s.num;

                        return (
                          <div
                            key={s.num}
                            className="flex flex-col items-center gap-1.5 z-10 bg-white px-2"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                              } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                isDone ? "text-slate-900" : "text-slate-400"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Live Tempo Details if Dispatched */}
                {order.dispatchDetails && order.status === "DISPATCHED" && (
                  <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                        <Truck className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-purple-950">
                          Delivery Tempo Currently En Route
                        </p>
                        <p className="text-slate-700 text-[11px] mt-0.5">
                          {order.dispatchDetails.transporterName} • Vehicle:{" "}
                          <strong className="font-mono text-purple-900">
                            {order.dispatchDetails.vehicleNumber}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-900 text-xs">
                        {order.dispatchDetails.trackingContact}
                      </span>
                    </div>
                  </div>
                )}

                {/* Items Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="py-2">Item Description</th>
                        <th className="py-2 text-center">Quantity</th>
                        <th className="py-2 text-right">Wholesale Rate</th>
                        <th className="py-2 text-right">Total (Incl GST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-bold text-slate-900">
                            {item.productName}
                            <span className="block font-mono text-[10px] text-slate-400 font-normal">
                              SKU: {item.sku}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-bold">
                            {item.quantity} {item.uom}
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-600">
                            {formatINR(item.unitPrice)}
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                            {formatINR(item.totalPrice + item.gstAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Total Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Billed to: <strong>{order.deliveryAddress}</strong>
                  </span>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">
                      Grand Total Amount
                    </span>
                    <span className="font-mono font-black text-slate-900 text-base text-emerald-700">
                      {formatINR(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invoice Modal */}
        {selectedInvoiceOrder && (
          <InvoiceModal
            order={selectedInvoiceOrder}
            onClose={() => setSelectedInvoiceOrder(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
