"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Product, Business } from "@/types";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatINR } from "@/lib/formatters";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Building2,
  MapPin,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function ShopkeeperMarketplacePage() {
  const { addToCart, cartCount, cartTotal, showToast } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [wholesalers, setWholesalers] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWholesaler, setSelectedWholesaler] = useState("all");

  // Track quantities in input per product
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadMarketplace() {
      try {
        const [productsRes, bizRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/businesses?role=wholesaler"),
        ]);

        const prodData = await productsRes.json();
        const bizData = await bizRes.json();

        if (prodData.success) {
          setProducts(prodData.products);
          // Initialize quantities with MOQ
          const qMap: Record<string, number> = {};
          prodData.products.forEach((p: Product) => {
            qMap[p.id] = p.moq || 1;
          });
          setQuantities(qMap);
        }

        if (bizData.success) {
          setWholesalers(bizData.businesses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMarketplace();
  }, []);

  const handleQtyChange = (productId: string, delta: number, moq: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || moq;
      const next = Math.max(moq, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || product.moq || 1;
    addToCart(product, qty);
  };

  const filteredProducts = products.filter((p) => {
    const matchesWholesaler = selectedWholesaler === "all" || p.wholesalerId === selectedWholesaler;
    const matchesCategory =
      selectedCategory === "all" ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWholesaler && matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                B2B Wholesale Marketplace
              </span>
              <span className="text-xs text-slate-400">• Verified Suppliers & Depots</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Order Stock for Your Kirana
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse bulk FMCG pricing, compare distributor offers, and order under your approved 7-day Udhaar terms.
            </p>
          </div>

          <Link
            href="/shopkeeper/cart"
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition-all hover:scale-102"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Cart ({cartCount} items)</span>
            <span className="font-mono bg-emerald-800/80 px-2 py-0.5 rounded-lg">
              {formatINR(cartTotal)}
            </span>
          </Link>
        </div>

        {/* Participating Wholesalers Showcase */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Verified Participating Wholesalers:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wholesalers.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWholesaler(selectedWholesaler === w.id ? "all" : w.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  selectedWholesaler === w.id
                    ? "bg-emerald-50/80 border-emerald-500 shadow-sm"
                    : "bg-white border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  {w.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{w.name}</h3>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified GST
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{w.type}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{w.address}, {w.city}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {w.rating || 4.8}
                    </span>
                    <span>• {w.ordersCount || 400}+ Deliveries</span>
                    <span>• Tempo Coverage: Delhi-NCR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products (e.g. Atta, Fortune Oil, Maggi, Tea, Surf Excel)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Items ({products.length})
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
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
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const qty = quantities[p.id] || p.moq || 1;
            const retailMargin = Math.round(((p.retailMrp - p.wholesalePrice) / p.retailMrp) * 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {p.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {retailMargin}% Kirana Margin
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {p.brand} • Supplied by {p.wholesalerName}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">
                        {p.name}
                      </h3>
                    </div>

                    {/* Pricing Grid */}
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Wholesale Rate:</span>
                        <span className="font-mono font-bold text-emerald-700 text-base">
                          {formatINR(p.wholesalePrice)}
                        </span>
                        <span className="text-[10px] text-slate-500">/{p.uom}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Retail MRP:</span>
                        <span className="font-mono text-slate-500 line-through text-xs">
                          {formatINR(p.retailMrp)}
                        </span>
                        <span className="block text-[10px] font-semibold text-emerald-600">
                          Save {formatINR(p.retailMrp - p.wholesalePrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Min Order (MOQ): <strong className="text-slate-800">{p.moq} {p.uom}</strong></span>
                      <span className="font-mono font-semibold text-slate-700">Stock: {p.stockQuantity}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Stepper */}
                <div className="p-4 pt-0">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(p.id, -1, p.moq)}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-mono font-bold text-xs text-slate-900 min-w-[32px] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(p.id, 1, p.moq)}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Add to Cart ({formatINR(p.wholesalePrice * qty)})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
