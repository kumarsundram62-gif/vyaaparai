import { User, UserRole, Business } from "@/types";
import { getDB, saveDB } from "./db";
import { DEMO_ACCOUNTS } from "./constants";

export interface SessionData {
  user: User;
  business: Business;
}

// In-memory active session fallback for fast client/server sync
let currentActiveUserId: string = "usr_wholesaler_1"; // Default to Wholesaler Ramesh Gupta

export function getActiveSession(): SessionData {
  const db = getDB();
  let user = db.users.find((u) => u.id === currentActiveUserId);
  if (!user) {
    user = db.users[0];
    currentActiveUserId = user.id;
  }

  let business = db.businesses.find((b) => b.id === user.businessId);
  if (!business) {
    business = db.businesses[0];
  }

  return { user, business };
}

export function setActiveSession(userId: string): SessionData {
  const db = getDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  currentActiveUserId = userId;
  const business = db.businesses.find((b) => b.id === user.businessId)!;
  return { user, business };
}

export function switchRole(role: UserRole): SessionData {
  const db = getDB();
  const user = db.users.find((u) => u.role === role);
  if (!user) throw new Error(`No user found with role ${role}`);
  return setActiveSession(user.id);
}

export function loginUser(identifier: string, role?: UserRole): SessionData {
  const db = getDB();
  const clean = identifier.toLowerCase().trim();

  // Find user by email or phone
  let user = db.users.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      u.phone.replace(/\s+/g, "") === clean.replace(/\s+/g, "")
  );

  if (!user && role) {
    user = db.users.find((u) => u.role === role);
  }

  if (!user) {
    // If not found, match with demo accounts
    const demo = DEMO_ACCOUNTS.find(
      (d) =>
        d.email.toLowerCase() === clean ||
        d.phone.replace(/\s+/g, "") === clean.replace(/\s+/g, "")
    );
    if (demo) {
      user = db.users.find((u) => u.email.toLowerCase() === demo.email.toLowerCase());
    }
  }

  if (!user) {
    throw new Error("Invalid credentials. Try a demo account!");
  }

  return setActiveSession(user.id);
}

export function registerBusiness(params: {
  ownerName: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
}): SessionData {
  const db = getDB();

  const bizId = `biz_${Date.now()}`;
  const userId = `usr_${Date.now()}`;

  const newBiz: Business = {
    id: bizId,
    name: params.businessName,
    type: params.businessType,
    ownerName: params.ownerName,
    phone: params.phone,
    email: params.email,
    role: params.role,
    address: params.address,
    city: params.city,
    state: params.state,
    pincode: params.pincode,
    gstin: params.gstin || "",
    verificationStatus: params.gstin ? "VERIFIED" : "PENDING_REVIEW",
    creditLimit: params.role === "shopkeeper" ? 100000 : undefined,
    defaultPaymentTerms: params.role === "shopkeeper" ? "7 Days Credit" : undefined,
    rating: 5.0,
    ordersCount: 0,
    joinedDate: new Date().toISOString().split("T")[0],
  };

  const newUser: User = {
    id: userId,
    name: params.ownerName,
    email: params.email,
    phone: params.phone,
    role: params.role,
    businessId: bizId,
    businessName: params.businessName,
    createdAt: new Date().toISOString(),
  };

  db.businesses.push(newBiz);
  db.users.push(newUser);
  saveDB(db);

  return setActiveSession(userId);
}
