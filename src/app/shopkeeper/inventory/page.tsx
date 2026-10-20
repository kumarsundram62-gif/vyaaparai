"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { RetailInventoryItem } from "@/types";
import { formatINR } from "@/lib/formatters";
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  ShoppingCart,
  Search,
  CheckCircle2,
  TrendingDown,
  X,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";

export default function ShopkeeperInventoryPage() {
  const { business, refreshKey, triggerRefresh, showToast } = useApp();

  const [items, setItems] = useState<RetailInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Counter Sale Modal
  const [saleModalItem, setSaleModalItem] = useState<RetailInventoryItem | null>(null);
  const [soldQty, setSoldQty] = useState(1);

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("General Grocery");
  const [itemUom, setItemUom] = useState("pack");
  const [itemStock, setItemStock] = useState(20);
  const [itemPurchasePrice, setItemPurchasePrice] = useState(50);
  const [itemSellingPrice, setItemSellingPrice] = useState(60);
  const [itemLowThreshold, setItemLowThreshold] = useState(5);

  useEffect(() => {
    async function loadRetailInventory() {
      try {
        const res = await fetch(`/api/inventory?role=shopkeeper&businessId=${business?.id || "biz_shopkeeper_1"}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRetailInventory();
  }, [business, refreshKey]);

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleModalItem) return;

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RETAIL_SALE",
          itemId: saleModalItem.id,
          quantitySold: Number(soldQty),
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Counter sale logged: ${soldQty} ${saleModalItem.uom} sold.`);
        setSaleModalItem(null);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast("Error recording sale");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_RETAIL_ITEM",
          shopkeeperId: business?.id || "biz_shopkeeper_1",
          name: itemName,
          category: itemCategory,
          uom: itemUom,
          currentStock: Number(itemStock),
          purchasePrice: Number(itemPurchasePrice),
          retailSellingPrice: Number(itemSellingPrice),
          lowStockThreshold: Number(itemLowThreshold),
          dailyAvgSales: 2.0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Added ${itemName} to Kirana stock`);
        setIsAddModalOpen(false);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast("Error adding item");
    }
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Kirana Shop Management
              </span>
              <span className="text-xs text-slate-400">• Retail Stock & Daily Sales</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Kirana Store Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Stock automatically increases when wholesale deliveries arrive. Log counter sales to track run-rates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Item</span>
            </button>
            <Link
              href="/shopkeeper/marketplace"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Reorder Wholesale Stock</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search retail stock (e.g. Atta, Fortune Oil, Biscuits, Tea)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        {/* Inventory Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isLowStock = item.currentStock <= item.lowStockThreshold;
            const daysRemaining = item.dailyAvgSales > 0 ? (item.currentStock / item.dailyAvgSales).toFixed(1) : "N/A";
            const suggestedReorder = Math.max(10, Math.ceil(item.dailyAvgSales * 7 + item.lowStockThreshold - item.currentStock));

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>
                    </div>

                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border ${
                        isLowStock
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {item.currentStock} {item.uom} left
                    </span>
                  </div>

                  {/* Stock Details & Rates */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Purchase Rate:</span>
                      <span className="font-mono font-semibold">{formatINR(item.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Counter Selling Price:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {formatINR(item.retailSellingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500">Run-Out Coverage:</span>
                      <span className={`font-bold ${isLowStock ? "text-red-600" : "text-slate-800"}`}>
                        ~{daysRemaining} days left ({item.dailyAvgSales} {item.uom}/day)
                      </span>
                    </div>
                  </div>

                  {isLowStock && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                      <span className="font-semibold">Suggested Reorder:</span>
                      <span className="font-bold font-mono">+{suggestedReorder} {item.uom}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setSaleModalItem(item);
                      setSoldQty(1);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log Counter Sale</span>
                  </button>

                  <Link
                    href="/shopkeeper/marketplace"
                    className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs transition-colors"
                    title="Reorder"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Log Counter Sale Modal */}
        {saleModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scale-up">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Log Retail Counter Sale</h3>
                <button
                  onClick={() => setSaleModalItem(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordSale} className="p-5 space-y-4 text-xs">
                <div>
                  <p className="text-slate-500">Product Sold:</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{saleModalItem.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Current Retail Stock: {saleModalItem.currentStock} {saleModalItem.uom}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Quantity Sold at Counter *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={saleModalItem.currentStock}
                    required
                    value={soldQty}
                    onChange={(e) => setSoldQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold font-mono text-base focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSoldQty(num)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold font-mono"
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950">
                  <span>Customer Amount:</span>
                  <span className="font-mono text-sm">
                    {formatINR(saleModalItem.retailSellingPrice * soldQty)}
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSaleModalItem(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                  >
                    Deduct Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Custom Item Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Add Kirana Stock Item</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Loose Sugar (1kg)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit (UOM)</label>
                    <input
                      type="text"
                      value={itemUom}
                      onChange={(e) => setItemUom(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={itemStock}
                      onChange={(e) => setItemStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Purchase Rate</label>
                    <input
                      type="number"
                      value={itemPurchasePrice}
                      onChange={(e) => setItemPurchasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Rate</label>
                    <input
                      type="number"
                      value={itemSellingPrice}
                      onChange={(e) => setItemSellingPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Save Item
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
