"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { DEMO_ACCOUNTS, BRAND_TAGLINE } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sparkles,
  ShoppingCart,
  ChevronDown,
  Building2,
  Store,
  ShieldCheck,
  Menu,
  HelpCircle,
} from "lucide-react";
import { formatINR } from "@/lib/formatters";

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const {
    user,
    business,
    role,
    switchDemoUser,
    setIsAIChatOpen,
    cartCount,
    cartTotal,
  } = useApp();

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchUser = async (userId: string, targetRole: string) => {
    setIsDemoMenuOpen(false);
    await switchDemoUser(userId);
    if (targetRole === "wholesaler") router.push("/wholesaler");
    else if (targetRole === "shopkeeper") router.push("/shopkeeper");
    else if (targetRole === "admin") router.push("/admin");
  };

  const roleBadgeConfig = {
    wholesaler: {
      label: "Wholesaler",
      bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      icon: Building2,
    },
    shopkeeper: {
      label: "Retail Shopkeeper",
      bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      icon: Store,
    },
    admin: {
      label: "Platform Admin",
      bg: "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      icon: ShieldCheck,
    },
  }[role] || {
    label: "User",
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: Building2,
  };

  const RoleIcon = roleBadgeConfig.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tight">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Vyapar<span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  B2B
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-[220px]">
                {BRAND_TAGLINE}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Business Context & Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <div className={`p-1.5 rounded-lg border ${roleBadgeConfig.bg}`}>
                <RoleIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>{business?.name || "Business Account"}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${roleBadgeConfig.bg}`}>
                    {roleBadgeConfig.label}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {user?.name} • {business?.city || "India"}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {/* Demo Accounts Dropdown */}
            {isDemoMenuOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2.5 z-50">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Switch Demo Persona</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant 1-Click Role Switch</p>
                  </div>
                  <span className="text-[10px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Live Demo
                  </span>
                </div>

                <div className="p-1 space-y-1 max-h-80 overflow-y-auto">
                  {DEMO_ACCOUNTS.map((d) => {
                    const isCurrent = user?.name === d.name;
                    return (
                      <button
                        key={d.email}
                        onClick={() =>
                          handleSwitchUser(
                            d.role === "wholesaler"
                              ? "usr_wholesaler_1"
                              : d.role === "shopkeeper" && d.businessId === "biz_shopkeeper_1"
                              ? "usr_shopkeeper_1"
                              : d.role === "shopkeeper"
                              ? "usr_shopkeeper_2"
                              : "usr_admin_1",
                            d.role
                          )
                        }
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                          isCurrent
                            ? "bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            d.role === "wholesaler"
                              ? "bg-emerald-600 text-white"
                              : d.role === "shopkeeper"
                              ? "bg-blue-600 text-white"
                              : "bg-purple-600 text-white"
                          }`}
                        >
                          {d.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {d.name}
                            </p>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              {d.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                            {d.businessName}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {d.city}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: AI Co-Pilot, Support, Cart, Theme Toggle, Dashboard */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-102 active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span className="hidden sm:inline">व्यापार AI Co-Pilot</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Contact / Support Quick Link */}
          <Link
            href="/contact"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Customer Support & Help Desk"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Support</span>
          </Link>

          {/* Cart (Only for Shopkeepers) */}
          {role === "shopkeeper" && (
            <Link
              href="/shopkeeper/cart"
              className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              title="View Cart"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="hidden sm:inline text-xs font-bold text-slate-900 dark:text-white">
                  {formatINR(cartTotal)}
                </span>
              )}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Quick Dashboard Links */}
          <Link
            href={
              role === "wholesaler"
                ? "/wholesaler"
                : role === "shopkeeper"
                ? "/shopkeeper"
                : "/admin"
            }
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              pathname.startsWith(`/${role}`)
                ? "bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
