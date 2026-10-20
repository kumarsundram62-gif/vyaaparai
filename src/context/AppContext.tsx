"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Business, UserRole, AppNotification, Product } from "@/types";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  user: User | null;
  business: Business | null;
  role: UserRole;
  loading: boolean;
  switchDemoUser: (userId: string) => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vyaparai-theme");
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
        if (stored === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setThemeState(initial);
        if (initial === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("vyaparai-theme", newTheme);
    } catch (e) {}
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Fetch active session and notifications
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.success && data.session) {
          setUser(data.session.user);
          setBusiness(data.session.business);
          fetchNotifications(data.session.business.id);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [refreshKey]);

  const fetchNotifications = async (bizId: string) => {
    try {
      const res = await fetch(`/api/notifications?recipientId=${bizId}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const switchDemoUser = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch", userId }),
      });
      const data = await res.json();
      if (data.success && data.session) {
        setUser(data.session.user);
        setBusiness(data.session.business);
        fetchNotifications(data.session.business.id);
        showToast(`Switched account to ${data.session.user.name} (${data.session.business.name})`);
        triggerRefresh();
      }
    } catch (err) {
      console.error("Error switching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const switchUserRole = async (targetRole: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((d) => d.role === targetRole);
    if (demo) {
      // Find matching user ID
      const resUsers = await fetch("/api/businesses");
      await switchDemoUser(demo.role === "wholesaler" ? "usr_wholesaler_1" : demo.role === "shopkeeper" ? "usr_shopkeeper_1" : "usr_admin_1");
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity?: number) => {
    const qtyToAdd = quantity || product.moq || 1;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd }];
    });
    showToast(`Added ${qtyToAdd} ${product.uom} of ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.wholesalePrice * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!business) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true, recipientId: business.id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        business,
        role: user?.role || "wholesaler",
        loading,
        switchDemoUser,
        switchUserRole,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        isAIChatOpen,
        setIsAIChatOpen,
        theme,
        toggleTheme,
        setTheme,
        toastMessage,
        showToast,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-slide-up text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
