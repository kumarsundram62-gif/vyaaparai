"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Order, OrderStatus } from "@/types";
import { formatINR, formatDateIN, formatDateTimeIN } from "@/lib/formatters";
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertTriangle,
  Printer,
  ChevronRight,
  Filter,
  X,
  Phone,
  MapPin,
} from "lucide-react";
import InvoiceModal from "@/components/InvoiceModal";

export default function WholesalerOrdersPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Dispatch Modal state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [transporterName, setTransporterName] = useState("Shree Krishna Logistics");
  const [vehicleNumber, setVehicleNumber] = useState("DL-1LE-4982");
  const [trackingContact, setTrackingContact] = useState("+91 98991 12233 (Driver Bablu)");

  // Reject Modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Item out of stock / logistics delay");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch(`/api/orders?wholesalerId=${business?.id || "biz_wholesaler_1"}&status=${statusFilter}`);
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
  }, [business, statusFilter, refreshKey]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    action: "ACCEPT" | "PACK" | "DISPATCH" | "DELIVER" | "REJECT",
    extraData?: any
  ) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action,
          actorName: business?.ownerName || "Ramesh Gupta",
          ...extraData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${action}`);
        triggerRefresh();
      } else {
        showToast(data.error || "Failed to update order");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating order status");
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderId) return;
    await handleUpdateOrderStatus(activeOrderId, "DISPATCH", {
      dispatchDetails: {
        transporterName,
        vehicleNumber,
        trackingContact,
        dispatchTime: new Date().toISOString(),
      },
    });
    setIsDispatchModalOpen(false);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderId) return;
    await handleUpdateOrderStatus(activeOrderId, "REJECT", {
      rejectionReason: rejectReason,
    });
    setIsRejectModalOpen(false);
  };

  const statuses = [
    { label: "All Orders", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Packed", value: "PACKED" },
    { label: "Dispatched", value: "DISPATCHED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Order Fulfillment
              </span>
              <span className="text-xs text-slate-400">• End-to-End Delivery Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Incoming Orders & Invoices
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm quantities, pack orders, dispatch tempo shipments, and print GST tax invoices.
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === s.value
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig: Record<string, { bg: string; label: string }> = {
              PENDING: { bg: "bg-amber-50 text-amber-800 border-amber-200", label: "Pending Confirmation" },
              ACCEPTED: { bg: "bg-blue-50 text-blue-800 border-blue-200", label: "Accepted (Stock Deducted)" },
              PACKED: { bg: "bg-indigo-50 text-indigo-800 border-indigo-200", label: "Packed & Ready" },
              DISPATCHED: { bg: "bg-purple-50 text-purple-800 border-purple-200", label: "In Transit (Dispatched)" },
              DELIVERED: { bg: "bg-emerald-50 text-emerald-800 border-emerald-200", label: "Delivered (Ledger Updated)" },
              CANCELLED: { bg: "bg-red-50 text-red-800 border-red-200", label: "Cancelled / Rejected" },
            };

            const currentStatus = statusConfig[order.status] || {
              bg: "bg-slate-100 text-slate-800",
              label: order.status,
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-base">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentStatus.bg}`}>
                      {currentStatus.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatDateIN(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      Terms: <strong className="text-slate-800">{order.paymentMethod}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>GST Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Customer & Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">{order.shopkeeperName}</p>
                    <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{order.deliveryAddress}</span>
                    </p>
                    <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{order.shopkeeperPhone}</span>
                    </p>
                  </div>

                  {order.dispatchDetails && (
                    <div className="space-y-0.5 text-[11px] border-t md:border-t-0 md:border-l border-slate-200 md:pl-4">
                      <p className="font-bold text-purple-900">Dispatch Tempo Details:</p>
                      <p className="text-slate-700">{order.dispatchDetails.transporterName}</p>
                      <p className="font-mono text-slate-600">
                        Vehicle: {order.dispatchDetails.vehicleNumber}
                      </p>
                      <p className="text-slate-600 font-mono">
                        Contact: {order.dispatchDetails.trackingContact}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="py-2">Item</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Unit Price</th>
                        <th className="py-2 text-right">GST</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-semibold text-slate-800">
                            {item.productName}
                          </td>
                          <td className="py-2 text-center font-bold">
                            {item.quantity} {item.uom}
                          </td>
                          <td className="py-2 text-right font-mono text-slate-600">
                            {formatINR(item.unitPrice)}
                          </td>
                          <td className="py-2 text-right font-mono text-slate-500">
                            {formatINR(item.gstAmount)} ({item.gstRate}%)
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900">
                            {formatINR(item.totalPrice + item.gstAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Bar: Amount & Action Workflow buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Subtotal: </span>
                      <span className="font-mono font-semibold">{formatINR(order.subtotal)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">GST: </span>
                      <span className="font-mono font-semibold">{formatINR(order.taxAmount)}</span>
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      <span>Total Billed: </span>
                      <span className="font-mono text-emerald-700">
                        {formatINR(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions according to current status */}
                  <div className="flex items-center gap-2">
                    {order.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => {
                            setActiveOrderId(order.id);
                            setIsRejectModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "ACCEPT")}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Accept Order & Deduct Stock
                        </button>
                      </>
                    )}

                    {order.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "PACK")}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                      >
                        Mark as Packed
                      </button>
                    )}

                    {order.status === "PACKED" && (
                      <button
                        onClick={() => {
                          setActiveOrderId(order.id);
                          setIsDispatchModalOpen(true);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Tempo</span>
                      </button>
                    )}

                    {order.status === "DISPATCHED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "DELIVER")}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}

                    {order.status === "DELIVERED" && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Fulfillment Complete</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispatch Modal */}
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Dispatch Tempo Details</h3>
                <button
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDispatchSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Transporter / Courier Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={transporterName}
                    onChange={(e) => setTransporterName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Vehicle Number (Tempo / Truck) *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Driver Name & Contact Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingContact}
                    onChange={(e) => setTrackingContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-700/20"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-red-600 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Reject Wholesale Order</h3>
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRejectSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Reason for Rejection *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
