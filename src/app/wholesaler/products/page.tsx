"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Product } from "@/types";
import { PRODUCT_CATEGORIES, UNITS_OF_MEASUREMENT } from "@/lib/constants";
import { formatINR } from "@/lib/formatters";
import {
  Package,
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

export default function WholesalerProductsPage() {
  const { business, showToast, refreshKey, triggerRefresh } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Grains, Atta & Pulses");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uom, setUom] = useState("pack");
  const [purchasePrice, setPurchasePrice] = useState(100);
  const [wholesalePrice, setWholesalePrice] = useState(120);
  const [retailMrp, setRetailMrp] = useState(150);
  const [moq, setMoq] = useState(5);
  const [stockQuantity, setStockQuantity] = useState(100);
  const [lowStockThreshold, setLowStockThreshold] = useState(20);
  const [batchNumber, setBatchNumber] = useState("B-2026-01");
  const [expiryDate, setExpiryDate] = useState("2027-12-31");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`/api/products?wholesalerId=${business?.id || "biz_wholesaler_1"}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [business, refreshKey]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategory("Grains, Atta & Pulses");
    setBrand("");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80");
    setUom("pack");
    setPurchasePrice(100);
    setWholesalePrice(120);
    setRetailMrp(150);
    setMoq(5);
    setStockQuantity(50);
    setLowStockThreshold(15);
    setBatchNumber("B-2026-X1");
    setExpiryDate("2027-12-31");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setBrand(p.brand);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setUom(p.uom);
    setPurchasePrice(p.purchasePrice);
    setWholesalePrice(p.wholesalePrice);
    setRetailMrp(p.retailMrp);
    setMoq(p.moq);
    setStockQuantity(p.stockQuantity);
    setLowStockThreshold(p.lowStockThreshold);
    setBatchNumber(p.batchNumber || "");
    setExpiryDate(p.expiryDate || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // PUT
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            name,
            sku,
            category,
            brand,
            description,
            imageUrl,
            uom,
            purchasePrice,
            wholesalePrice,
            retailMrp,
            moq,
            stockQuantity,
            lowStockThreshold,
            batchNumber,
            expiryDate,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Updated product: ${name}`);
          setIsModalOpen(false);
          triggerRefresh();
        }
      } else {
        // POST
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wholesalerId: business?.id || "biz_wholesaler_1",
            wholesalerName: business?.name || "Gupta Wholesale Mega Mart",
            name,
            sku,
            category,
            brand,
            description,
            imageUrl,
            uom,
            purchasePrice,
            wholesalePrice,
            retailMrp,
            moq,
            stockQuantity,
            lowStockThreshold,
            batchNumber,
            expiryDate,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Added product: ${name}`);
          setIsModalOpen(false);
          triggerRefresh();
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving product");
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to delete ${prodName}?`)) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Product deleted`);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Template download
  const handleDownloadSampleCSV = () => {
    const csvContent =
      "name,sku,category,brand,uom,purchasePrice,wholesalePrice,retailMrp,moq,stockQuantity,lowStockThreshold\n" +
      "Tata Sampann Toor Dal (1kg),DAL-TAT-1KG,Grains Atta & Pulses,Tata Sampann,bag,140,165,195,10,120,20\n" +
      "Brooke Bond Red Label Tea (1kg),TEA-RED-1KG,Tea Coffee & Beverages,HUL,box,420,470,550,5,80,15\n" +
      "Haldiram Bhujia Sev Master Peti,SNK-HAL-PETI,Packaged Foods & Snacks,Haldirams,carton,850,960,1150,4,45,10";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vyaparai_bulk_products_sample.csv";
    link.click();
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Product Catalog
              </span>
              <span className="text-xs text-slate-400">• Wholesale Price List & MOQs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Products & Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure wholesale tier pricing, minimum order quantities (MOQ), and stock safety levels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSampleCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Sample CSV</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Tabs */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by brand, name, or SKU (e.g. Atta, Fortune, Parle-G)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Categories ({products.length})
            </button>
            {PRODUCT_CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category.toLowerCase().includes(cat.name.toLowerCase().split(",")[0])).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name.split(",")[0])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory.toLowerCase() === cat.name.split(",")[0].toLowerCase()
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category & Brand</th>
                  <th className="py-3 px-4 text-right">Purchase Cost</th>
                  <th className="py-3 px-4 text-right">Wholesale Price</th>
                  <th className="py-3 px-4 text-right">Retail MRP</th>
                  <th className="py-3 px-4 text-center">MOQ</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stockQuantity <= p.lowStockThreshold;
                  const marginPct = Math.round(((p.wholesalePrice - p.purchasePrice) / p.wholesalePrice) * 100);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                            <p className="font-mono text-[10px] text-slate-400">
                              SKU: {p.sku} • UOM: {p.uom}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{p.brand}</p>
                        <p className="text-[11px] text-slate-500">{p.category}</p>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {formatINR(p.purchasePrice)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatINR(p.wholesalePrice)}
                        <span className="block text-[10px] text-emerald-600 font-semibold">
                          +{marginPct}% margin
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-500 line-through">
                        {formatINR(p.retailMrp)}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold">
                        {p.moq} {p.uom}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-[11px] border ${
                              isLowStock
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {p.stockQuantity} {p.uom}
                          </span>
                          {isLowStock && (
                            <span className="text-[10px] text-amber-600 font-bold mt-0.5">
                              Low Stock!
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">
                  {editingProduct ? "Edit Product" : "Add Wholesale Product"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aashirvaad Shudh Chakki Atta (10kg)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. ITC Aashirvaad"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit of Measurement (UOM)</label>
                    <select
                      value={uom}
                      onChange={(e) => setUom(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {UNITS_OF_MEASUREMENT.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Purchase Cost (₹)</label>
                    <input
                      type="number"
                      required
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-800 mb-1">
                      Wholesale Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={wholesalePrice}
                      onChange={(e) => setWholesalePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Retail MRP (₹)</label>
                    <input
                      type="number"
                      required
                      value={retailMrp}
                      onChange={(e) => setRetailMrp(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* Inventory & MOQ Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Min Order Qty (MOQ)</label>
                    <input
                      type="number"
                      min="1"
                      value={moq}
                      onChange={(e) => setMoq(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Warehouse Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Low-Stock Alert Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/20"
                  >
                    {editingProduct ? "Update Product" : "Save Product"}
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
