"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SUPPORT_PHONE } from "@/lib/constants";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  Users,
  BookOpen,
  BarChart3,
  Bot,
  Store,
  ShoppingCart,
  Receipt,
  FileCheck2,
  AlertTriangle,
  History,
  LifeBuoy,
  MessageSquareQuote,
  Headphones,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  isAi?: boolean;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, business } = useApp();

  const wholesalerNav: NavItem[] = [
    { label: "Overview", href: "/wholesaler", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/wholesaler/products", icon: Package },
    { label: "Inventory & Inward", href: "/wholesaler/inventory", icon: Boxes },
    { label: "Incoming Orders", href: "/wholesaler/orders", icon: Truck },
    { label: "Retail Customers", href: "/wholesaler/customers", icon: Users },
    { label: "Shared Digital Udhaar", href: "/wholesaler/ledger", icon: BookOpen },
    { label: "Analytics & Reports", href: "/wholesaler/reports", icon: BarChart3 },
    { label: "AI Business Intelligence", href: "/wholesaler/ai", icon: Bot, isAi: true },
  ];

  const shopkeeperNav: NavItem[] = [
    { label: "Store Home", href: "/shopkeeper", icon: LayoutDashboard },
    { label: "Find Wholesalers", href: "/shopkeeper/marketplace", icon: Store },
    { label: "My Cart", href: "/shopkeeper/cart", icon: ShoppingCart },
    { label: "Order Tracking", href: "/shopkeeper/orders", icon: Truck },
    { label: "My Kirana Stock", href: "/shopkeeper/inventory", icon: Boxes },
    { label: "My Accounts & Udhaar", href: "/shopkeeper/ledger", icon: Receipt },
    { label: "AI Kirana Advisor", href: "/shopkeeper/ai", icon: Bot, isAi: true },
  ];

  const adminNav: NavItem[] = [
    { label: "Platform Overview", href: "/admin", icon: LayoutDashboard },
    { label: "KYC & Verification", href: "/admin/businesses", icon: FileCheck2 },
    { label: "Dispute Resolutions", href: "/admin/disputes", icon: AlertTriangle },
    { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
    { label: "User Feedback", href: "/admin/feedback", icon: MessageSquareQuote },
    { label: "Categories & Tax (HSN)", href: "/admin/categories", icon: Package },
    { label: "Audit & Security Logs", href: "/admin/audit", icon: History },
  ];

  const navItems =
    role === "wholesaler"
      ? wholesalerNav
      : role === "shopkeeper"
      ? shopkeeperNav
      : adminNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="min-h-full flex flex-col justify-between p-4">
          <div className="space-y-5">
            {/* Business Card info */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Active Business
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {business?.verificationStatus === "VERIFIED" ? "Verified GST" : "Registered"}
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                {business?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {business?.type}
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                Main Menu
              </p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? item.isAi
                            ? "text-amber-300"
                            : "text-emerald-400 dark:text-white"
                          : item.isAi
                          ? "text-amber-500"
                          : "text-slate-400 dark:text-slate-400"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.isAi && (
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Support & Help card */}
          <div className="pt-4">
            <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold mb-1">
                <Headphones className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dedicated B2B Support</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed mb-2">
                Questions about GST invoices, orders or ledger? Our team is active.
              </p>
              <Link
                href="/contact"
                className="block text-center text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-700/80 border border-emerald-200 dark:border-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
              >
                Call: {SUPPORT_PHONE}
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
