"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Product, Order } from "@/types";
import { formatINR, formatDateIN } from "@/lib/formatters";
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Package,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function WholesalerReportsPage() {
  const { business, refreshKey } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`/api/orders?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
          fetch(`/api/products?wholesalerId=${business?.id || "biz_wholesaler_1"}`),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (ordersData.success) setOrders(ordersData.orders);
        if (productsData.success) setProducts(productsData.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [business, refreshKey]);

  // Aggregate product sales
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; cost: number; uom: string }> = {};

  orders.forEach((o) => {
    if (o.status === "CANCELLED") return;
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const unitCost = prod ? prod.purchasePrice : item.unitPrice * 0.85;

      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
          cost: 0,
          uom: item.uom,
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;
      productSalesMap[item.productId].cost += unitCost * item.quantity;
    });
  });

  const bestSelling = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);
  const totalGrossRevenue = bestSelling.reduce((sum, p) => sum + p.revenue, 0);
  const totalCostOfGoods = bestSelling.reduce((sum, p) => sum + p.cost, 0);
  const totalGrossProfit = Math.max(0, totalGrossRevenue - totalCostOfGoods);
  const avgProfitMargin = totalGrossRevenue > 0 ? Math.round((totalGrossProfit / totalGrossRevenue) * 100) : 0;

  // Slow moving products (in catalog but zero or very low sales)
  const slowMoving = products
    .filter((p) => !productSalesMap[p.id] || productSalesMap[p.id].qty < 10)
    .slice(0, 5);

  const handleExportCSV = () => {
    let csv = "Product Name,Units Sold,Gross Revenue (INR),Estimated Cost (INR),Gross Margin (INR)\n";
    bestSelling.forEach((p) => {
      csv += `"${p.name.replace(/"/g, '""')}",${p.qty} ${p.uom},${p.revenue.toFixed(2)},${p.cost.toFixed(2)},${(p.revenue - p.cost).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `vyaparai_sales_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                P&L & Analytics
              </span>
              <span className="text-xs text-slate-400">• Financial Reports & Turnover</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Business Performance & Profit Margins
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review best-moving items, gross profit estimates, and exportable statements for GST filing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download CSV Report</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Gross B2B Turnover
            </span>
            <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatINR(totalGrossRevenue)}
            </p>
            <p className="text-[11px] text-slate-500">Total fulfilled order value</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Estimated Cost of Goods (COGS)
            </span>
            <p className="text-2xl font-black text-slate-600 tracking-tight font-mono">
              {formatINR(totalCostOfGoods)}
            </p>
            <p className="text-[11px] text-slate-500">Based on recorded purchase prices</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Estimated Gross Profit
            </span>
            <p className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              {formatINR(totalGrossProfit)}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">Net wholesale markup</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Average Margin
            </span>
            <p className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              {avgProfitMargin}%
            </p>
            <p className="text-[11px] text-slate-500">Healthy wholesale FMCG spread</p>
          </div>
        </div>

        {/* Two Columns: Best-Selling Products & Slow-Moving Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Best Selling Items (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Top-Selling Products by Revenue
                </h3>
              </div>
              <span className="text-xs text-slate-400">High Turnover</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4 text-center">Volume Sold</th>
                    <th className="py-3 px-4 text-right">Revenue (₹)</th>
                    <th className="py-3 px-4 text-right">Gross Profit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bestSelling.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {p.qty} {p.uom}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatINR(p.revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                        {formatINR(p.revenue - p.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Slow-Moving Stock (1 Col) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Slow-Moving Inventory</h3>
                <p className="text-[11px] text-slate-500">Low turnover past 30 days</p>
              </div>
            </div>

            <div className="space-y-3">
              {slowMoving.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5"
                >
                  <p className="font-bold text-xs text-slate-900">{p.name}</p>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Warehouse Stock:</span>
                    <span className="font-bold font-mono">{p.stockQuantity} {p.uom}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-amber-800 font-semibold pt-1 border-t border-amber-200/50">
                    <span>AI Action:</span>
                    <span>Offer 3% bundle discount to Kiranas</span>
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
