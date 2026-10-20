"use client";

import React from "react";
import { Order } from "@/types";
import { formatINR, formatDateIN } from "@/lib/formatters";
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from "lucide-react";

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const invoiceNumber = `INV-GW-2026-${order.orderNumber.replace(/[^0-9]/g, "").slice(-4) || "081"}`;
  const invoiceDate = formatDateIN(order.createdAt);
  const dueDate = formatDateIN(new Date(new Date(order.createdAt).getTime() + 7 * 86400000).toISOString());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Tax Invoice Preview</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              GST Compliant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 text-slate-900 text-xs bg-white print-card" id="printable-invoice">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {order.wholesalerName}
              </h1>
              <p className="text-slate-600 text-xs mt-0.5">
                Warehouse Block C-14, Azadpur Mandi, Delhi - 110033
              </p>
              <p className="font-mono text-xs font-bold text-slate-800 mt-1">
                GSTIN: 07AAAAA1234A1Z5 | State: Delhi (07)
              </p>
              <p className="text-slate-500 text-[11px]">
                Email: billing@guptawholesale.in | Phone: +91 98110 23456
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-300">
                TAX INVOICE
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm mt-2">
                {invoiceNumber}
              </p>
              <p className="text-slate-600 mt-0.5">Date: {invoiceDate}</p>
              <p className="text-amber-700 font-semibold mt-0.5">Due Date: {dueDate}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Order Ref: {order.orderNumber}</p>
            </div>
          </div>

          {/* Bill To & Ship To Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Billed To (Buyer):
              </p>
              <p className="font-bold text-sm text-slate-900">{order.shopkeeperName}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{order.deliveryAddress}</p>
              <p className="text-slate-700 text-[11px] font-mono mt-1">
                Phone: {order.shopkeeperPhone}
              </p>
              <p className="text-slate-700 text-[11px] font-mono">
                GSTIN: 07CCCCCC9876C1Z3 (Registered Person)
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Dispatch & Payment Terms:
              </p>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-slate-900">{order.paymentMethod} (Udhaar)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transporter:</span>
                  <span className="font-medium text-slate-800">
                    {order.dispatchDetails?.transporterName || "Direct Tempo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle No:</span>
                  <span className="font-mono text-slate-800">
                    {order.dispatchDetails?.vehicleNumber || "DL-1LE-4982"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Place of Supply:</span>
                  <span className="font-medium text-slate-800">Delhi (07)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold border-y border-slate-300">
                <th className="py-2 px-2 text-left">#</th>
                <th className="py-2 px-2 text-left">Description of Goods</th>
                <th className="py-2 px-2 text-center">HSN</th>
                <th className="py-2 px-2 text-center">Qty</th>
                <th className="py-2 px-2 text-right">Rate (₹)</th>
                <th className="py-2 px-2 text-right">Taxable (₹)</th>
                <th className="py-2 px-2 text-right">GST %</th>
                <th className="py-2 px-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-2 text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900">
                    {item.productName}
                    <span className="block text-[10px] text-slate-400 font-mono font-normal">
                      SKU: {item.sku}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-600">1006</td>
                  <td className="py-2.5 px-2 text-center font-bold">
                    {item.quantity} {item.uom}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-600">
                    {item.gstRate}%
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold font-mono">
                    {((item.unitPrice * item.quantity) + item.gstAmount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Summary */}
          <div className="flex justify-between items-start gap-6 border-t border-slate-300 pt-4 mb-6">
            <div className="w-1/2 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Bank Details for RTGS / NEFT / IMPS:
              </p>
              <div className="text-[11px] text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono space-y-0.5">
                <p>Bank: HDFC Bank Ltd, Azadpur Branch</p>
                <p>A/C Name: Gupta Wholesale Mega Mart</p>
                <p>A/C No: 50200088991122</p>
                <p>IFSC: HDFC0001234</p>
                <p>UPI ID: guptawholesale@hdfcbank</p>
              </div>

              <div className="text-[10px] text-slate-500 leading-tight">
                * Payment due within 7 days of invoice date. Overdue interest @ 1.5% per month applicable.
              </div>
            </div>

            <div className="w-1/2 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Total Taxable Subtotal:</span>
                <span className="font-mono font-semibold">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>CGST (Central Tax):</span>
                <span className="font-mono">
                  {formatINR(Math.round((order.taxAmount / 2) * 100) / 100)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>SGST (State Tax):</span>
                <span className="font-mono">
                  {formatINR(Math.round((order.taxAmount / 2) * 100) / 100)}
                </span>
              </div>
              {order.deliveryCharge > 0 && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-mono">{formatINR(order.deliveryCharge)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono text-emerald-700">
                  {formatINR(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Certification */}
          <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-[11px]">
            <div className="text-slate-500 max-w-sm">
              <p className="font-bold text-slate-700">Declaration:</p>
              <p>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 border-b border-slate-400 pb-8 mb-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DIGITALLY VERIFIED
                </span>
              </div>
              <p className="font-bold text-slate-800">For {order.wholesalerName}</p>
              <p className="text-[10px] text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
