# VyaparAI (व्यापार AI)
### *"Smart Wholesale. Smarter Retail. One Connected Business Network."*

![VyaparAI B2B Platform](https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80)

VyaparAI is a modern, responsive, full-stack B2B wholesale and retail commerce management platform designed specifically for the Indian supply chain ecosystem. It connects wholesalers, FMCG distributors, millers, and Kirana shopkeepers in one unified digital network.

---

## 🌟 Key Capabilities & Core Value Pillars

### 1. 🏢 Wholesaler Command Center (`/wholesaler`)
* **KPI Metrics**: Real-time tracking of Gross Sales, Today's Sales, Active Retail Customers, Outstanding Market Udhaar, and Low-Stock Warnings.
* **Product Catalog Management**: SKU, Brand, Category, Purchase Cost, Wholesale Price, Recommended Retail MRP, MOQ (Minimum Order Quantity), UOM, and Safety Stock Thresholds.
* **Warehouse Inventory & Audit Trail**: Real-time stock inward procurement logging, damaged goods tracking, and auto-stock deduction upon order confirmation.
* **Order Pipeline Workflow**: Real-time status stepper: `Pending` → `Accepted` → `Packed` → `Dispatched (with Tempo details)` → `Delivered`.
* **Instant GST-Compliant Tax Invoices**: Formatted with supplier & buyer GSTINs, HSN codes, SGST/CGST tax splits, and digital signature stamps.
* **Retail Customer Management**: Sanctioned credit limits, payment terms, and 1-click WhatsApp payment reminders in English and Hindi.

### 2. 🏪 Small Retailer & Kirana Experience (`/shopkeeper`)
* **Simple, Mobile-Friendly UI**: Designed specifically for small Indian retail shop owners.
* **B2B Wholesale Marketplace**: Search verified distributors across Delhi-NCR, browse products by category, compare wholesale margins, and order with MOQ steppers.
* **Multi-Payment Terms**: Order under approved **7-Day Udhaar (Credit)**, Cash on Delivery (COD), or Instant UPI QR.
* **Live Order & Tempo Tracking**: Real-time stepper with driver Bablu's tempo contact number (`DL-1LE-4982`).
* **My Kirana Inventory**: Retail shelf stock management that automatically replenishes when wholesale orders are delivered. Log daily counter sales to track run-out dates.

### 3. 📒 Shared Digital Udhaar & Transparent Passbook (`/wholesaler/ledger` & `/shopkeeper/ledger`)
* **Single Source of Truth**: Wholesalers and Kirana retailers view the **exact same underlying ledger records and running balance**.
* **Deterministic Mathematical Balance Formula**:
  $$\text{Outstanding Balance} = \text{Opening Balance} + \text{Credit Purchases} + \text{Approved Charges} - \text{Payments} - \text{Credit Notes}$$
* **Immutable Audit Trail**: Unique Transaction IDs (`TXN-...`), Order/Invoice references, due dates, payment methods, and receipt numbers.
* **Dispute & Arbitration Workflow**: Transactions can be disputed with reasons (damaged sacks, quantity shortage). Prevents silent or unauthorized balance alterations.

### 4. 🤖 Integrated AI Business Assistant ("व्यापार AI Co-Pilot")
* **Bilingual English & Hindi / Hinglish NLP**:
  * *"Mera kaunsa product jaldi khatam hone wala hai?"* → Calculates daily consumption velocity and predicts run-out days.
  * *"Which shopkeepers have overdue payments?"* → Scans due dates, evaluates debtor reliability scores (e.g. 92%), and drafts WhatsApp reminders.
  * *"Which products should I reorder this week?"* → Recommends reorder quantities based on supplier lead times, MOQs, and safety buffers.
  * *"Show my best-selling products this month."* → Summarizes top revenue drivers and profit margins.
* **Explainable Recommendations**: Every insight details **What**, **Why**, **Data Points Used**, **Confidence Level (%)**, and **1-Click Actions**.

### 5. 🛡️ Platform Administration & KYC Verification (`/admin`)
* **Verified Business Registry**: Review GSTIN compliance, verify shopkeeper and distributor KYC documents, and adjust platform credit ceilings.
* **Dispute Arbitration Center**: Mediate billing and shipment disputes between retailers and distributors with credit note issuance.
* **Tax Classification**: Manage Indian GST slabs (0%, 5%, 12%, 18%, 28%) and HSN codes.
* **Cryptographic Event Audit Log**: Chronological records of orders, dispatches, payments, and system events.

---

## 👥 Pre-Configured Demo Personas (1-Click Switcher)

| Persona Name | Business Name | Role | City / Mandi | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| **Ramesh Gupta** | Gupta Wholesale Mega Mart | `wholesaler` | Azadpur Mandi, Delhi | Full catalog, tempo dispatch, credit ledger |
| **Suresh Kumar** | Aapki Apni Kirana Store | `shopkeeper` | Chandni Chowk, Delhi | Mobile cart, 7-day udhaar, shelf stock |
| **Priya Sharma** | Sharma Supermarket & Grocers | `shopkeeper` | Sector 18, Noida | Bulk FMCG buyer, 15-day credit |
| **Vikram Patel** | VyaparAI Operations HQ | `admin` | Bengaluru | KYC approvals, arbitration, platform GMV |

*Switch between any of these personas instantly using the persona selector in the top navigation bar or the 1-click demo buttons on `/login`.*

---

## 🏗️ Technical Stack & Architecture

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend**: Next.js Server Components, Route Handlers (`/api/orders`, `/api/products`, `/api/ledger`, `/api/inventory`, `/api/ai`, `/api/businesses`, `/api/notifications`).
* **Persistence Layer**: Atomic JSON-backed relational database store (`data/vyaparai_store.json`) with seeded Indian FMCG products, orders, stock movements, and audit logs.
* **AI Engine**: Deterministic statistical run-rate predictor + semantic Hinglish query parser with optional LLM API connectivity.
* **Testing**: Automated end-to-end business workflow test suite (`scripts/test-workflows.mjs`).

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18 or higher (tested with Node.js v24 LTS)
* npm v9 or higher

### Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd gg
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the automated test suite**:
   ```bash
   node scripts/test-workflows.mjs
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   *Or for production performance:*
   ```bash
   npm run build
   npm run start
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (optional, demo mode works 100% out of the box with zero external keys required):

```env
# Optional external LLM key for enhanced AI chat responses
GEMINI_API_KEY="your-gemini-api-key"

# Port (default 3000)
PORT=3000
```

---

## 🧪 Automated Test Verification

The application includes automated test suites covering:
1. Deterministic calculation of outstanding balances with partial payments and credit notes.
2. Warehouse inventory deduction and movement logging on wholesale order acceptance.
3. Retailer data isolation and role-based security access guards.
4. AI inventory run-out and optimal reorder quantity formulas.

Run tests anytime with:
```bash
node scripts/test-workflows.mjs
```
Output:
```
=================================================
  VYAPARAI AUTOMATED BUSINESS LOGIC TEST SUITE   
=================================================

[PASS] 1. Shared Digital Udhaar: Deterministic balance calculation formula
[PASS] 2. Order Workflow: Stock deduction and movement logging on acceptance
[PASS] 3. Payment Recording: Partial payment leaves accurate remaining balance
[PASS] 4. Security Guard: Shopkeeper cannot view other retailers' private transactions
[PASS] 5. AI Business Engine: Reorder quantity and run-out date calculation

=================================================
  TEST RESULTS: 5 / 5 PASSED (100% Success)
=================================================
```

---

## 📄 License
VyaparAI is crafted for Indian wholesale and retail commerce networks.
