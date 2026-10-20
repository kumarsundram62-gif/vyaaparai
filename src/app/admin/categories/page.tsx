"use client";

import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ProductCategory } from "@/types";
import { Package, Plus, ShieldCheck, Tag, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminCategoriesPage() {
  const { showToast } = useApp();

  const [categories, setCategories] = useState<ProductCategory[]>(PRODUCT_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [gstRate, setGstRate] = useState(5);
  const [description, setDescription] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: ProductCategory = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      icon: "Package",
      hsnCode,
      gstRate: Number(gstRate),
      description,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Added category: ${name}`);
    setIsModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Tax & Classification
              </span>
              <span className="text-xs text-slate-400">• Indian GST Harmonized Codes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Product Categories & GST Rates (HSN)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized GST slab mappings and mandatory HSN classifications for B2B e-invoicing.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                  {c.gstRate}% GST Slab
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                <p className="font-mono text-xs text-slate-500 mt-0.5">HSN: {c.hsnCode}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{c.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Add Product Category & HSN</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dairy & Frozen Foods"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">HSN Code *</label>
                    <input
                      type="text"
                      required
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      placeholder="e.g. 0402"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">GST Tax Rate (%)</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                  >
                    Save Category
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
