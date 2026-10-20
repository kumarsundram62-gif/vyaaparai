import { ProductCategory } from "@/types";

export const BRAND_NAME = "VyaparAI";
export const BRAND_TAGLINE = "Smarter Business. Stronger Connections.";
export const BRAND_POSITIONING =
  "VyaparAI is the intelligent B2B SaaS platform that bridges India's wholesale distributors and retail shopkeepers through real-time orders, transparent shared digital udhaar (khata), GST compliance, and bilingual AI assistance.";

export const FOUNDER_NAME = "Shivam Mishra";
export const FOUNDER_TITLE = "Founder & Chief Architect, VyaparAI";
export const FOUNDER_IMAGE = "/shivam.jpeg";
export const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/shivam-mishra-822406445";
export const FOUNDER_BIO =
  "Building next-generation digital infrastructure for Indian B2B commerce. Passionate about empowering local kirana owners and wholesale traders with accessible, AI-powered ERP tools, transparent credit ledgers, and seamless communication.";

export const SUPPORT_PHONE = "+91 7562817736";
export const SUPPORT_PHONE_RAW = "7562817736";
export const SUPPORT_PHONE_INTL = "917562817736";
export const SUPPORT_EMAIL = "Shivamhere2007@gmail.com";
export const SUPPORT_WHATSAPP_NUMBER = "917562817736";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "cat_grains",
    name: "Grains, Atta & Pulses",
    slug: "grains-atta-pulses",
    icon: "Wheat",
    hsnCode: "1006",
    gstRate: 5,
    description: "Flours, rice, dal, legumes, and basic edible grains.",
  },
  {
    id: "cat_oils",
    name: "Edible Oils & Ghee",
    slug: "oils-ghee",
    icon: "Droplets",
    hsnCode: "1515",
    gstRate: 5,
    description: "Mustard oil, refined oil, desi ghee, cooking fats.",
  },
  {
    id: "cat_packaged",
    name: "Packaged Foods & Snacks",
    slug: "packaged-foods",
    icon: "Package",
    hsnCode: "1905",
    gstRate: 12,
    description: "Biscuits, noodles, chips, namkeen, instant snacks.",
  },
  {
    id: "cat_beverages",
    name: "Tea, Coffee & Beverages",
    slug: "beverages",
    icon: "Coffee",
    hsnCode: "0902",
    gstRate: 5,
    description: "Tea leaves, coffee powder, juices, soft drink concentrates.",
  },
  {
    id: "cat_spices",
    name: "Spices & Condiments",
    slug: "spices",
    icon: "Sparkles",
    hsnCode: "0910",
    gstRate: 5,
    description: "Haldi, mirchi, dhania, garam masala, salt, sugar.",
  },
  {
    id: "cat_personal_care",
    name: "Personal & Home Care",
    slug: "personal-home-care",
    icon: "ShieldCheck",
    hsnCode: "3401",
    gstRate: 18,
    description: "Soaps, detergents, cleaners, toothpaste, shampoos.",
  },
];

export const UNITS_OF_MEASUREMENT = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "pack", label: "Packet (pack)" },
  { value: "carton", label: "Carton / Peti" },
  { value: "box", label: "Box (box)" },
  { value: "litre", label: "Litre (L)" },
  { value: "tin", label: "Tin / Drum" },
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "bag", label: "Bori / Bag (50kg)" },
];

export const DEMO_ACCOUNTS = [
  {
    role: "wholesaler",
    email: "ramesh@guptawholesale.in",
    password: "demo",
    name: "Ramesh Gupta",
    businessName: "Gupta Wholesale Mega Mart",
    businessId: "biz_wholesaler_1",
    type: "FMCG & Grains Distributor",
    city: "Delhi (Connaught Place)",
    phone: "+91 98110 23456",
    badge: "Verified Wholesaler",
    color: "emerald",
  },
  {
    role: "shopkeeper",
    email: "suresh@apnikirana.in",
    password: "demo",
    name: "Suresh Kumar",
    businessName: "Aapki Apni Kirana Store",
    businessId: "biz_shopkeeper_1",
    type: "Kirana & Provision Store",
    city: "Delhi (Chandni Chowk)",
    phone: "+91 98765 43210",
    badge: "Retail Shopkeeper",
    color: "blue",
  },
  {
    role: "shopkeeper",
    email: "priya@sharmamart.in",
    password: "demo",
    name: "Priya Sharma",
    businessName: "Sharma Supermarket & Grocers",
    businessId: "biz_shopkeeper_2",
    type: "Modern Retail Grocer",
    city: "Noida (Sector 18)",
    phone: "+91 98234 56789",
    badge: "Retail Shopkeeper",
    color: "indigo",
  },
  {
    role: "admin",
    email: "admin@vyaparai.in",
    password: "demo",
    name: "Vikram Patel",
    businessName: "VyaparAI Operations Headquarters",
    businessId: "biz_admin_1",
    type: "Platform Administration",
    city: "Bengaluru",
    phone: "+91 80234 56789",
    badge: "Master Admin",
    color: "purple",
  },
];
