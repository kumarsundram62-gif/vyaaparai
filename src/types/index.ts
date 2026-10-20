export type UserRole = "wholesaler" | "shopkeeper" | "admin";

export type VerificationStatus = "VERIFIED" | "PENDING_REVIEW" | "UNVERIFIED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  businessId: string;
  businessName: string;
  avatar?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  type: string; // e.g., "FMCG Wholesaler", "Kirana Store", "General Store"
  ownerName: string;
  phone: string;
  email: string;
  role: UserRole;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  verificationStatus: VerificationStatus;
  creditLimit?: number; // Maximum udhaar allowed (for shopkeepers)
  defaultPaymentTerms?: string; // e.g. "7 Days Credit", "15 Days Credit", "Cash on Delivery"
  rating?: number;
  ordersCount?: number;
  joinedDate: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  hsnCode: string;
  gstRate: number; // e.g. 5, 12, 18
  description: string;
}

export interface Product {
  id: string;
  wholesalerId: string;
  wholesalerName: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  imageUrl: string;
  uom: string; // "kg", "pack", "carton", "box", "litre", "pcs"
  purchasePrice: number; // Cost to wholesaler in ₹
  wholesalePrice: number; // Selling price to shopkeeper in ₹
  retailMrp: number; // Recommended retail MRP in ₹
  moq: number; // Minimum Order Quantity
  stockQuantity: number;
  lowStockThreshold: number;
  batchNumber?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PACKED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  uom: string;
  quantity: number;
  fulfilledQuantity?: number;
  unitPrice: number;
  totalPrice: number;
  gstRate: number;
  gstAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  wholesalerId: string;
  wholesalerName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  shopkeeperPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  rejectionReason?: string;
  dispatchDetails?: {
    transporterName?: string;
    vehicleNumber?: string;
    trackingContact?: string;
    dispatchTime?: string;
  };
  paymentMethod: "CREDIT" | "COD" | "UPI" | "BANK_TRANSFER";
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  paidAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export type StockMovementType =
  | "INWARD"
  | "ORDER_FULFILLMENT"
  | "RETAIL_SALE"
  | "DAMAGE"
  | "RETURN"
  | "ADJUSTMENT";

export interface StockMovement {
  id: string;
  businessId: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantityChanged: number; // positive for inward/returns, negative for sales/damages
  quantityAfter: number;
  referenceId?: string; // orderId or invoiceId
  reason: string;
  date: string;
  createdBy: string;
}

export interface RetailInventoryItem {
  id: string;
  shopkeeperId: string;
  productId?: string; // linked to wholesaler product if reordered
  name: string;
  category: string;
  uom: string;
  currentStock: number;
  purchasePrice: number;
  retailSellingPrice: number;
  lowStockThreshold: number;
  preferredWholesalerId?: string;
  preferredWholesalerName?: string;
  lastRestockedDate?: string;
  dailyAvgSales: number;
}

export type LedgerTransactionType =
  | "OPENING_BALANCE"
  | "CREDIT_PURCHASE"
  | "PAYMENT"
  | "CREDIT_NOTE"
  | "ADJUSTMENT"
  | "REFUND";

export type DisputeStatus = "NONE" | "OPEN" | "RESOLVED" | "REJECTED";

export interface LedgerTransaction {
  id: string;
  transactionNumber: string;
  wholesalerId: string;
  wholesalerName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  orderId?: string;
  invoiceNumber?: string;
  type: LedgerTransactionType;
  debit: number; // Amount added to debt (e.g. credit purchase)
  credit: number; // Amount subtracted from debt (e.g. payment)
  runningBalance: number; // Balance after this transaction
  dueDate?: string;
  paymentMethod?: "CASH" | "UPI" | "CHEQUE" | "BANK_TRANSFER" | "CREDIT";
  referenceNotes?: string;
  receiptNumber?: string;
  disputeStatus: DisputeStatus;
  disputeReason?: string;
  disputeRaisedBy?: string;
  disputeResolutionNotes?: string;
  date: string;
  createdAt: string;
  createdBy: string;
}

export interface AIRecommendation {
  id: string;
  businessId: string;
  category: "RESTOCK" | "DEMAND_FORECAST" | "CREDIT_RISK" | "SLOW_MOVING" | "SALES_TREND";
  title: string;
  recommendation: string;
  reasoning: string;
  dataPointsUsed: string[];
  confidenceScore: number; // 0 - 100
  urgency: "HIGH" | "MEDIUM" | "LOW";
  suggestedActionLabel?: string;
  suggestedActionPayload?: any;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientId: string; // businessId
  title: string;
  message: string;
  type: "ORDER" | "INVENTORY" | "PAYMENT" | "SYSTEM" | "AI_ALERT";
  read: boolean;
  linkUrl?: string;
  whatsappMessageTemplate?: {
    english: string;
    hindi: string;
    phone: string;
  };
  createdAt: string;
}

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface SupportTicket {
  id: string;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assignedTo?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type FeedbackCategory = "FEATURE_REQUEST" | "BUG_REPORT" | "UI_UX" | "AI_ASSISTANT" | "GENERAL";
export type FeedbackStatus = "NEW" | "UNDER_REVIEW" | "PLANNED" | "IN_PROGRESS" | "RESOLVED";

export interface FeedbackItem {
  id: string;
  referenceNumber: string; // e.g., VYP-FB-1042
  category: FeedbackCategory;
  title: string;
  description: string;
  email?: string;
  screenshotUrl?: string;
  status: FeedbackStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
