"use client";

import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/formatters";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  CreditCard,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShopkeeperCartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    business,
    showToast,
    triggerRefresh,
  } = useApp();

  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState(
    business?.address ? `${business.address}, ${business.city} - ${business.pincode}` : "142/3, Main Bazaar, Nai Sarak, Chandni Chowk, Delhi - 110006"
  );
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT" | "COD" | "UPI">("CREDIT");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Group cart items by wholesaler (for real-world B2B orders)
  const primaryWholesalerId = cart.length > 0 ? cart[0].product.wholesalerId : "biz_wholesaler_1";
  const primaryWholesalerName = cart.length > 0 ? cart[0].product.wholesalerName : "Gupta Wholesale Mega Mart";

  // Financial calculations
  const subtotal = cartTotal;
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100; // Estimated 5% average GST
  const deliveryCharge = subtotal > 5000 ? 0 : 250;
  const grandTotal = Math.round((subtotal + taxAmount + deliveryCharge) * 100) / 100;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        uom: item.product.uom,
        quantity: item.quantity,
        unitPrice: item.product.wholesalePrice,
        totalPrice: item.product.wholesalePrice * item.quantity,
        gstRate: 5,
        gstAmount: Math.round(item.product.wholesalePrice * item.quantity * 0.05 * 100) / 100,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wholesalerId: primaryWholesalerId,
          wholesalerName: primaryWholesalerName,
          shopkeeperId: business?.id || "biz_shopkeeper_1",
          shopkeeperName: business?.name || "Aapki Apni Kirana Store",
          shopkeeperPhone: business?.phone || "+91 98765 43210",
          deliveryAddress,
          items: orderItems,
          subtotal,
          taxAmount,
          deliveryCharge,
          totalAmount: grandTotal,
          paymentMethod,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.order);
        clearCart();
        triggerRefresh();
        showToast(`Order #${data.order.orderNumber} placed successfully!`);
      } else {
        showToast(data.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      showToast("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Order Review & Checkout
              </span>
              <span className="text-xs text-slate-400">• Wholesaler: {primaryWholesalerName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Wholesale Order Cart
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review quantities, delivery address, and credit terms before sending to distributor.
            </p>
          </div>

          <Link
            href="/shopkeeper/marketplace"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Success Confirmation Modal / Banner if placed */}
        {orderSuccess ? (
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500 shadow-xl text-center max-w-xl mx-auto space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Order Confirmed & Sent to Wholesaler!
            </h2>
            <p className="font-mono text-sm font-bold text-slate-700">
              Order Reference: {orderSuccess.orderNumber}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Gupta Wholesale Mega Mart has received your order for {formatINR(orderSuccess.totalAmount)}. You will receive live delivery updates as items are packed and dispatched.
            </p>

            <div className="pt-4 flex gap-3 justify-center">
              <Link
                href="/shopkeeper/orders"
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
              >
                Track Order Status
              </Link>
              <Link
                href="/shopkeeper/marketplace"
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Order More
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Your Cart is Currently Empty</h3>
            <p className="text-xs text-slate-500">
              Browse verified wholesale catalogs to add FMCG products, grains, and spices to your order.
            </p>
            <Link
              href="/shopkeeper/marketplace"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md transition-all hover:bg-emerald-700"
            >
              Browse Catalogues
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items List (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Items in Cart ({cart.length})
                  </h3>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 p-4 space-y-3">
                  {cart.map((item) => {
                    const isBelowMoq = item.quantity < item.product.moq;

                    return (
                      <div
                        key={item.product.id}
                        className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.product.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              SKU: {item.product.sku} • Rate: {formatINR(item.product.wholesalePrice)}/{item.product.uom}
                            </p>
                            {isBelowMoq && (
                              <p className="text-[10px] text-amber-600 font-bold">
                                Minimum Order Qty is {item.product.moq} {item.product.uom}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.product.id, item.quantity - 1)
                              }
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 font-mono font-bold text-xs text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.product.id, item.quantity + 1)
                              }
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className="font-mono font-bold text-slate-900 text-sm">
                              {formatINR(item.product.wholesalePrice * item.quantity)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Notes */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Delivery Address *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Special Dispatch Notes / Delivery Timing
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please deliver between 2 PM - 5 PM to back counter"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary & Payment Mode (1 Col) */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4 text-xs">
                <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                  Select Payment Method
                </h3>

                <div className="space-y-2">
                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === "CREDIT"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CREDIT"
                      checked={paymentMethod === "CREDIT"}
                      onChange={() => setPaymentMethod("CREDIT")}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-bold">7-Day Wholesale Udhaar (Credit)</p>
                      <p className="text-[11px] text-slate-500">
                        Payable within 7 days of delivery. Added to shared ledger.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === "COD"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-bold">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500">
                        Pay cash to the tempo delivery agent with printed receipt.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === "UPI"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-bold">Instant UPI / QR Code</p>
                      <p className="text-[11px] text-slate-500">
                        Pay instantly via GPay / PhonePe upon delivery.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Taxable Value:</span>
                    <span className="font-mono font-semibold">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (5%):</span>
                    <span className="font-mono font-semibold">{formatINR(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo Delivery:</span>
                    <span className="font-mono font-semibold">
                      {deliveryCharge === 0 ? "FREE" : formatINR(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                    <span>Order Total:</span>
                    <span className="font-mono text-emerald-700">{formatINR(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 disabled:opacity-50 transition-all hover:scale-102"
                >
                  {loading ? "Placing Order..." : `Confirm & Submit Wholesale Order`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
