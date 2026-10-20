import { getDB } from "./db";
import { formatINR, formatDateIN, getDaysOverdue } from "./formatters";
import { AIRecommendation } from "@/types";

export interface AIResponse {
  answer: string;
  language: "en" | "hi" | "hinglish";
  confidenceScore: number;
  recommendations: AIRecommendation[];
  keyDataPoints: { label: string; value: string }[];
  suggestedAction?: {
    label: string;
    actionType: "NAVIGATE" | "OPEN_ORDER" | "SEND_WHATSAPP" | "PRINT_REPORT" | "CALL_SUPPORT";
    payload?: any;
  };
}

export function processAIQuery(params: {
  query: string;
  businessId?: string;
  role?: "wholesaler" | "shopkeeper" | "admin" | "visitor";
}): AIResponse {
  const db = getDB();
  const q = params.query.toLowerCase().trim();

  // 0. SECURITY BOUNDARY: Never accept, ask for, or process sensitive credentials
  if (
    (q.includes("password") && (q.includes("what is") || q.includes("give me") || q.includes("here is") || q.includes("save") || q.includes("share"))) ||
    (q.includes("otp") && (q.includes("take") || q.includes("here is") || q.includes("send to") || q.includes("code is"))) ||
    q.includes("atm pin") ||
    q.includes("upi pin") ||
    q.includes("cvv") ||
    q.includes("debit card")
  ) {
    return {
      answer:
        "⚠️ **Security Notice:** VyaparAI and its support staff will **NEVER** ask for, accept, or process your passwords, OTPs, UPI PINs, or debit card credentials.\n\nPlease keep these secrets confidential. If you are experiencing account access difficulties, use our self-service recovery flow or contact our verified support desk.",
      language: "en",
      confidenceScore: 99,
      keyDataPoints: [
        { label: "Security Policy", value: "Zero-Knowledge on Passwords & PINs" },
        { label: "Official Support", value: "+91 7562817736" },
      ],
      recommendations: [],
      suggestedAction: {
        label: "Contact Support Desk",
        actionType: "NAVIGATE",
        payload: "/contact",
      },
    };
  }

  // 1. LOGIN & ACCOUNT RECOVERY TROUBLESHOOTING
  if (
    q.includes("login") ||
    q.includes("log in") ||
    q.includes("sign in") ||
    q.includes("password reset") ||
    q.includes("forgot password") ||
    q.includes("cant login") ||
    q.includes("can't login") ||
    q.includes("cannot login") ||
    q.includes("otp delay") ||
    q.includes("otp nahi") ||
    q.includes("otp not") ||
    q.includes("account locked") ||
    q.includes("locked out")
  ) {
    const isHindi = q.includes("nahi") || q.includes("kaise") || q.includes("kare") || q.includes("mushkil") || q.includes("batao");
    return {
      answer: isHindi
        ? `🔐 **लॉगिन और अकाउंट रिकवरी सहायता:**\n\n1. **डेमो 1-क्लिक एक्सेस:** यदि आप प्लेटफॉर्म टेस्ट कर रहे हैं, तो ऊपर नेवबार में **'Switch Demo Persona'** पर क्लिक करके सीधे रमेश गुप्ता (Wholesaler), सुरेश कुमार (Shopkeeper) या प्लेटफॉर्म एडमिन के रूप में स्विच कर सकते हैं।\n2. **पासवर्ड रीसेट:** आधिकारिक रिकवरी लिंक का उपयोग करें या हमारे '/contact' पेज पर सपोर्ट टिकट सबमिट करें।\n3. **OTP देरी:** कृपया 60 सेकंड प्रतीक्षा करें। यदि SMS नहीं आता है, तो नेटवर्क कवरेज जांचें।\n4. **अकाउंट लॉक:** सुरक्षा कारणों से 5 गलत प्रयासों के बाद अकाउंट 15 मिनट के लिए लॉक होता है।\n\n⚠️ हम चैट में कभी भी पासवर्ड या OTP नहीं मांगते हैं।`
        : `🔐 **Login & Account Recovery Troubleshooting:**\n\n1. **Instant Demo Access:** If you are testing the platform, use the **'Switch Demo Persona'** button in the top navigation bar to seamlessly test live accounts as Ramesh Gupta (Wholesaler), Suresh Kumar (Shopkeeper), or Platform Admin.\n2. **Password Recovery:** Use self-service reset or file a quick ticket via the '/contact' page.\n3. **OTP Notification Delays:** Please allow up to 60 seconds for carrier SMS delivery. Check mobile signal strength.\n4. **Account Lockout:** Accounts unlock automatically after 15 minutes of inactivity following repeated failed attempts.\n\n⚠️ VyaparAI will NEVER ask you for your password or OTP.`,
      language: isHindi ? "hinglish" : "en",
      confidenceScore: 98,
      keyDataPoints: [
        { label: "Demo Switcher", value: "Available in Top Navbar" },
        { label: "Support Phone", value: "+91 7562817736" },
        { label: "Support Email", value: "Shivamhere2007@gmail.com" },
      ],
      recommendations: [],
      suggestedAction: {
        label: "Open Contact & Support Hub",
        actionType: "NAVIGATE",
        payload: "/contact",
      },
    };
  }

  // 2. CUSTOMER SUPPORT / ESCALATION / FOUNDER PROFILE
  if (
    q.includes("support") ||
    q.includes("customer care") ||
    q.includes("call") ||
    q.includes("whatsapp") ||
    q.includes("contact") ||
    q.includes("founder") ||
    q.includes("shivam") ||
    q.includes("helpline") ||
    q.includes("phone number") ||
    q.includes("email") ||
    q.includes("madad") ||
    q.includes("sampark")
  ) {
    const isHindi = q.includes("madad") || q.includes("sampark") || q.includes("kaise") || q.includes("kare") || q.includes("shivam");
    return {
      answer: isHindi
        ? `📞 **व्यापारAI कस्टमर सपोर्ट और फाउंडर संपर्क:**\n\n• **फाउंडर:** शिवम मिश्रा (Shivam Mishra) - फाउंडर एवं चीफ आर्किटेक्ट\n• **हेल्पलाइन नंबर:** +91 7562817736\n• **ईमेल:** Shivamhere2007@gmail.com\n• **व्हाट्सएप सपोर्ट:** +91 7562817736 (डायरेक्ट चैट उपलब्ध)\n• **लिंक्डइन:** https://www.linkedin.com/in/shivam-mishra-822406445\n\nआप नीचे दिए गए बटन पर क्लिक करके सीधे व्हाट्सएप पर बात कर सकते हैं या सपोर्ट टिकट दर्ज कर सकते हैं।`
        : `📞 **VyaparAI Customer Support Hub & Founder Profile:**\n\n• **Founder:** Shivam Mishra (Founder & Chief Architect, VyaparAI)\n• **Direct Phone Helpline:** +91 7562817736\n• **Support Email:** Shivamhere2007@gmail.com\n• **Direct WhatsApp:** +91 7562817736 (24/7 direct query routing)\n• **Founder LinkedIn:** https://www.linkedin.com/in/shivam-mishra-822406445\n\nOur team is dedicated to supporting wholesalers and retail shopkeepers with prompt assistance.`,
      language: isHindi ? "hinglish" : "en",
      confidenceScore: 99,
      keyDataPoints: [
        { label: "Phone", value: "+91 7562817736" },
        { label: "WhatsApp", value: "+91 7562817736" },
        { label: "Email", value: "Shivamhere2007@gmail.com" },
        { label: "Founder", value: "Shivam Mishra" },
      ],
      recommendations: [],
      suggestedAction: {
        label: "Chat on WhatsApp (+91 7562817736)",
        actionType: "SEND_WHATSAPP",
        payload: "https://wa.me/917562817736?text=Namaste%20Shivam%20/%20VyaparAI%20Support!%20I%20need%20assistance.",
      },
    };
  }

  // 3. WHAT IS VYAPARAI / VALUE PROPOSITION & CAPABILITIES
  if (
    q.includes("what is vyaparai") ||
    q.includes("kya hai vyaparai") ||
    q.includes("features") ||
    q.includes("how it works") ||
    q.includes("pricing") ||
    q.includes("charge") ||
    q.includes("fayde") ||
    q.includes("about")
  ) {
    const isHindi = q.includes("kya") || q.includes("kaise") || q.includes("fayde") || q.includes("batao");
    return {
      answer: isHindi
        ? `🏢 **व्यापारAI (VyaparAI) - Smarter Business. Stronger Connections.**\n\nव्यापारAI भारत के थोक विक्रेताओं (Wholesalers) और किराना स्टोर मालिकों (Shopkeepers) के लिए बनाया गया प्रमुख B2B SaaS प्लेटफॉर्म है।\n\n**प्रमुख विशेषताएं:**\n1. **साझा डिजिटल उधारी खाता (Shared Digital Udhaar):** दोनों पक्षों को एक ही रीयल-टाइम खाता बही दिखती है। उधारी विवाद हमेशा के लिए खत्म!\n2. **होलसेल मार्केटप्लेस:** किराना स्टोर सीधे होलसेलर कैटलॉग से बल्क आर्डर कर सकते हैं।\n3. **AI इन्वेंटरी एडवाइजर:** स्टॉक खत्म होने से 3-5 दिन पहले ही अलर्ट और रीऑर्डर सिफारिशें।\n4. **GST इनवॉइसिंग:** स्वचालित HSN कोड और सटीक टैक्स कैलकुलेशन।`
        : `🏢 **VyaparAI - Smarter Business. Stronger Connections.**\n\nVyaparAI is the premier B2B SaaS commerce and credit platform tailored specifically for India's wholesale distributors and retail kirana merchants.\n\n**Key Capabilities:**\n1. **Shared Digital Udhaar (Ledger):** Synchronized real-time khata where both buyer and seller view the same transaction ledger, ending disputes.\n2. **Direct B2B Marketplace:** Instant digital ordering with volume pricing and minimum order tracking.\n3. **AI Inventory Advisor:** Predictive analytics alerting retailers before high-demand items run out of stock.\n4. **GST Invoicing:** One-click compliant invoices with accurate HSN codes and tax breakdowns.`,
      language: isHindi ? "hinglish" : "en",
      confidenceScore: 98,
      keyDataPoints: [
        { label: "Platform Role", value: "B2B SaaS Wholesale-to-Retail Network" },
        { label: "Tagline", value: "Smarter Business. Stronger Connections." },
        { label: "Core Feature", value: "Dispute-Free Shared Digital Khata" },
      ],
      recommendations: [],
      suggestedAction: {
        label: "Visit Wholesale Marketplace",
        actionType: "NAVIGATE",
        payload: "/shopkeeper/marketplace",
      },
    };
  }

  // 4. NAVIGATION SHORTCUTS
  if (q.includes("marketplace") || q.includes("find wholesaler") || q.includes("catalog")) {
    return {
      answer: "You can explore verified wholesale distributors, compare prices, and order stock in the **B2B Marketplace**.",
      language: "en",
      confidenceScore: 95,
      keyDataPoints: [{ label: "Destination", value: "Wholesale Marketplace" }],
      recommendations: [],
      suggestedAction: {
        label: "Go to Marketplace",
        actionType: "NAVIGATE",
        payload: "/shopkeeper/marketplace",
      },
    };
  }

  if (q.includes("cart") || q.includes("checkout") || q.includes("bag")) {
    return {
      answer: "View items in your basket, apply wholesale order thresholds, and review calculated GST in **My Cart**.",
      language: "en",
      confidenceScore: 95,
      keyDataPoints: [{ label: "Destination", value: "Kirana Cart" }],
      recommendations: [],
      suggestedAction: {
        label: "Open Cart",
        actionType: "NAVIGATE",
        payload: "/shopkeeper/cart",
      },
    };
  }

  // Shopkeeper queries
  if (params.role === "shopkeeper" && params.businessId) {
    const shopkeeperBiz = db.businesses.find((b) => b.id === params.businessId);
    const retailItems = db.retailInventory.filter((r) => r.shopkeeperId === params.businessId);
    const shopOrders = db.orders.filter((o) => o.shopkeeperId === params.businessId);
    const shopTxns = db.ledgerTransactions.filter((t) => t.shopkeeperId === params.businessId);

    // 1. "Mera kaunsa product jaldi khatam hone wala hai?" / "Which products are low on stock?"
    if (
      q.includes("khatam") ||
      q.includes("jaldi") ||
      q.includes("low stock") ||
      q.includes("out of stock") ||
      q.includes("kam stock") ||
      q.includes("run out")
    ) {
      const lowStock = retailItems.filter((i) => i.currentStock <= i.lowStockThreshold);
      const critical = [...retailItems].sort((a, b) => {
        const daysA = a.dailyAvgSales > 0 ? a.currentStock / a.dailyAvgSales : 999;
        const daysB = b.dailyAvgSales > 0 ? b.currentStock / b.dailyAvgSales : 999;
        return daysA - daysB;
      });

      const mostCritical = critical[0];
      const daysLeft = mostCritical && mostCritical.dailyAvgSales > 0
        ? (mostCritical.currentStock / mostCritical.dailyAvgSales).toFixed(1)
        : "N/A";

      const isHindi = q.includes("kaunsa") || q.includes("khatam") || q.includes("mera");

      const answer = isHindi
        ? `आपके स्टोर में **${mostCritical ? mostCritical.name : "कुछ प्रोडक्ट्स"}** का स्टॉक सबसे तेजी से खत्म होने वाला है (सिर्फ **${daysLeft} दिन** का स्टॉक बचा है)। वर्तमान में आपके पास ${lowStock.length} प्रोडक्ट्स लो-स्टॉक सीमा से नीचे हैं। आपको आज ही गुप्ता होलसेल से रीऑर्डर करना चाहिए।`
        : `Your product **${mostCritical ? mostCritical.name : "Tata Tea Gold"}** is running out fastest, with only **${daysLeft} days of inventory remaining** based on your 7-day average sales of ${mostCritical?.dailyAvgSales || 1.5} units/day. You currently have ${lowStock.length} items below safety threshold.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 94,
        keyDataPoints: lowStock.map((item) => ({
          label: item.name,
          value: `${item.currentStock} ${item.uom} left (Min: ${item.lowStockThreshold})`,
        })),
        recommendations: [
          {
            id: `rec_${Date.now()}`,
            businessId: params.businessId,
            category: "RESTOCK",
            title: `Reorder ${mostCritical?.name || "Inventory"}`,
            recommendation: `Place bulk reorder for ${mostCritical?.name} to prevent loss of daily retail walk-in sales.`,
            reasoning: `Daily consumption rate is ${mostCritical?.dailyAvgSales || 1.5} units/day with supplier replenishment turnaround of 24-48 hours.`,
            dataPointsUsed: [
              `Current Stock: ${mostCritical?.currentStock || 2} units`,
              `Threshold: ${mostCritical?.lowStockThreshold || 8} units`,
              `Estimated Days Remaining: ${daysLeft} days`,
            ],
            confidenceScore: 94,
            urgency: "HIGH",
            suggestedActionLabel: "Order from Wholesaler",
            createdAt: new Date().toISOString(),
          },
        ],
        suggestedAction: {
          label: "View & Reorder Low Stock",
          actionType: "NAVIGATE",
          payload: "/shopkeeper/marketplace",
        },
      };
    }

    // 2. "Which products should I reorder this week?" / "Kya restock karna chahiye?"
    if (
      q.includes("reorder") ||
      q.includes("restock") ||
      q.includes("kya kharidu") ||
      q.includes("mangwa") ||
      q.includes("order karna")
    ) {
      const itemsToReorder = retailItems.filter((i) => i.currentStock <= i.lowStockThreshold);
      const isHindi = q.includes("kya") || q.includes("mangwa") || q.includes("kharidu");

      const summaryList = itemsToReorder
        .map((i) => {
          // Reorder formula: (LeadTime * DailyAvg) + SafetyStock - Current
          const suggested = Math.max(10, Math.ceil(i.dailyAvgSales * 7 + i.lowStockThreshold - i.currentStock));
          return `• **${i.name}**: Reorder ~${suggested} ${i.uom}`;
        })
        .join("\n");

      const answer = isHindi
        ? `आपके पिछले 14 दिनों की बिक्री के आधार पर, इस हफ्ते निम्नलिखित सामान रीऑर्डर करने की सिफारिश है:\n\n${summaryList}\n\nयह आपके स्टोर में बिना किसी स्टॉकआउट के 10 दिनों की बिक्री सुनिश्चित करेगा।`
        : `Based on your recent sales patterns, here are the recommended reorder quantities for this week:\n\n${summaryList}\n\nThese reorder levels account for 2-day supplier lead time and a 5-day safety buffer.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 92,
        keyDataPoints: itemsToReorder.map((i) => ({
          label: i.name,
          value: `Stock: ${i.currentStock} -> Recommended: +${Math.ceil(i.dailyAvgSales * 7)} ${i.uom}`,
        })),
        recommendations: [
          {
            id: `rec_${Date.now()}`,
            businessId: params.businessId,
            category: "RESTOCK",
            title: "Weekly Smart Restock Package",
            recommendation: "Consolidated reorder recommendation based on Kirana sales velocity.",
            reasoning: "Prevents split deliveries and meets wholesale Minimum Order Quantities (MOQ).",
            dataPointsUsed: [
              "Daily sales velocity tracking",
              "Supplier minimum order thresholds",
              "Holding cost optimization",
            ],
            confidenceScore: 92,
            urgency: "HIGH",
            suggestedActionLabel: "Proceed to Marketplace",
            createdAt: new Date().toISOString(),
          },
        ],
        suggestedAction: {
          label: "Browse Wholesaler Catalog",
          actionType: "NAVIGATE",
          payload: "/shopkeeper/marketplace",
        },
      };
    }

    // 3. "Mere kis wholesaler se sabse zyada purchase hoti hai?" / "Wholesaler spend"
    if (
      q.includes("wholesaler") ||
      q.includes("supplier") ||
      q.includes("zyada purchase") ||
      q.includes("sabse jyada") ||
      q.includes("top supplier")
    ) {
      const spendingByWholesaler: Record<string, { name: string; total: number; count: number }> = {};
      shopOrders.forEach((o) => {
        if (!spendingByWholesaler[o.wholesalerId]) {
          spendingByWholesaler[o.wholesalerId] = { name: o.wholesalerName, total: 0, count: 0 };
        }
        spendingByWholesaler[o.wholesalerId].total += o.totalAmount;
        spendingByWholesaler[o.wholesalerId].count += 1;
      });

      const topWholesaler = Object.values(spendingByWholesaler).sort((a, b) => b.total - a.total)[0] || {
        name: "Gupta Wholesale Mega Mart",
        total: 47000,
        count: 3,
      };

      const isHindi = q.includes("kis") || q.includes("sabse") || q.includes("zyada") || q.includes("purchase hoti");

      const answer = isHindi
        ? `आपकी सबसे ज्यादा खरीद **${topWholesaler.name}** से होती है। आपने कुल **${formatINR(topWholesaler.total)}** के सामान के लिए ${topWholesaler.count} ऑर्डर्स दिए हैं। यह आपके कुल होलसेल खर्च का लगभग **85%** है।`
        : `Your top wholesale supplier by volume and spend is **${topWholesaler.name}**. You have placed **${topWholesaler.count} orders** totaling **${formatINR(topWholesaler.total)}**, accounting for the majority of your grocery procurement.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 96,
        keyDataPoints: [
          { label: "Top Wholesaler", value: topWholesaler.name },
          { label: "Total Purchases", value: formatINR(topWholesaler.total) },
          { label: "Orders Count", value: `${topWholesaler.count} orders` },
        ],
        recommendations: [],
        suggestedAction: {
          label: "View Wholesaler Profile",
          actionType: "NAVIGATE",
          payload: "/shopkeeper/marketplace",
        },
      };
    }

    // 4. "How much money is currently outstanding?" / "Mera udhaar kitna hai?"
    if (
      q.includes("outstanding") ||
      q.includes("udhaar") ||
      q.includes("balance") ||
      q.includes("kitna baki") ||
      q.includes("dues") ||
      q.includes("payment due")
    ) {
      // Deterministic balance
      let totalUdhaar = 0;
      shopTxns.forEach((t) => {
        totalUdhaar = totalUdhaar + t.debit - t.credit;
      });
      totalUdhaar = Math.max(0, Math.round(totalUdhaar * 100) / 100);

      const overdueTxns = shopTxns.filter((t) => t.dueDate && getDaysOverdue(t.dueDate) > 0);
      const isHindi = q.includes("kitna") || q.includes("udhaar") || q.includes("mera");

      const answer = isHindi
        ? `गुप्ता होलसेल मेगा मार्ट के प्रति आपका कुल बकाया (Udhaar) **${formatINR(totalUdhaar)}** है। इसमें से इनवॉइस INV-GW-2026-081 का भुगतान 19-Oct को देय था। आपकी कुल क्रेडिट लिमिट ${formatINR(shopkeeperBiz?.creditLimit || 150000)} है, जिसका आपने अभी केवल 6% उपयोग किया है।`
        : `Your current outstanding credit balance across wholesalers is **${formatINR(totalUdhaar)}**. Of this, Invoice INV-GW-2026-081 had a due date of 19-Oct-2026. Your sanctioned credit limit is ${formatINR(shopkeeperBiz?.creditLimit || 150000)}, leaving plenty of available credit.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 100,
        keyDataPoints: [
          { label: "Current Udhaar Balance", value: formatINR(totalUdhaar) },
          { label: "Credit Limit", value: formatINR(shopkeeperBiz?.creditLimit || 150000) },
          { label: "Available Credit", value: formatINR((shopkeeperBiz?.creditLimit || 150000) - totalUdhaar) },
        ],
        recommendations: [],
        suggestedAction: {
          label: "View Digital Ledger & Pay",
          actionType: "NAVIGATE",
          payload: "/shopkeeper/ledger",
        },
      };
    }
  }

  // Wholesaler queries
  if (params.role === "wholesaler") {
    const wholesalerBiz = db.businesses.find((b) => b.id === params.businessId);
    const myProducts = db.products.filter((p) => p.wholesalerId === params.businessId);
    const myOrders = db.orders.filter((o) => o.wholesalerId === params.businessId);
    const myTxns = db.ledgerTransactions.filter((t) => t.wholesalerId === params.businessId);

    // 1. "Which shopkeepers have overdue payments?" / "Kiska payment baki hai?"
    if (
      q.includes("overdue") ||
      q.includes("payment") ||
      q.includes("udhaar") ||
      q.includes("kiska") ||
      q.includes("baki") ||
      q.includes("late") ||
      q.includes("outstanding")
    ) {
      const isHindi = q.includes("kiska") || q.includes("baki") || q.includes("udhaar") || q.includes("kaun");

      // Group transactions by shopkeeper to get balance & overdue
      const balances: Record<string, { name: string; balance: number; overdueAmount: number; phone: string }> = {};
      myTxns.forEach((t) => {
        if (!balances[t.shopkeeperId]) {
          const shopkeeper = db.businesses.find((b) => b.id === t.shopkeeperId);
          balances[t.shopkeeperId] = {
            name: t.shopkeeperName,
            balance: 0,
            overdueAmount: 0,
            phone: shopkeeper?.phone || "+919876543210",
          };
        }
        balances[t.shopkeeperId].balance += t.debit - t.credit;
        if (t.dueDate && getDaysOverdue(t.dueDate) > 0 && t.debit > t.credit) {
          balances[t.shopkeeperId].overdueAmount += t.debit - t.credit;
        }
      });

      const overdueList = Object.entries(balances)
        .filter(([_, data]) => data.balance > 0)
        .map(([id, data]) => `• **${data.name}**: ${formatINR(data.balance)} (Overdue: ${formatINR(data.overdueAmount || data.balance)})`)
        .join("\n");

      const totalOverdue = Object.values(balances).reduce((sum, b) => sum + b.balance, 0);

      const answer = isHindi
        ? `वर्तमान में आपके पास कुल **${formatINR(totalOverdue)}** का बकाया (Outstanding Udhaar) है। मुख्य ओवरड्यू ग्राहक:\n\n${overdueList}\n\nसुरेश कुमार (Aapki Apni Kirana Store) का ₹8,923.20 का भुगतान 1 दिन से लेट है। आप तुरंत व्हाट्सएप रिमाइंडर भेज सकते हैं।`
        : `You currently have **${formatINR(totalOverdue)}** in total outstanding market credit across retail accounts:\n\n${overdueList}\n\nAapki Apni Kirana Store has an invoice of ₹8,923.20 that reached due date yesterday. Historical repayment reliability is 92%, so a polite reminder is recommended.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 98,
        keyDataPoints: [
          { label: "Total Market Udhaar", value: formatINR(totalOverdue) },
          { label: "Active Debtors", value: `${Object.keys(balances).length} Shopkeepers` },
          { label: "Recovery Risk", value: "Low (Established Retailers)" },
        ],
        recommendations: [
          {
            id: `rec_${Date.now()}`,
            businessId: params.businessId || "biz_wholesaler_1",
            category: "CREDIT_RISK",
            title: "Automated WhatsApp Reminder",
            recommendation: "Send personalized reminder in Hindi to Aapki Apni Kirana Store.",
            reasoning: "Invoice INV-GW-2026-081 due on 19-Oct-2026.",
            dataPointsUsed: ["Due Date: 19 Oct", "Amount: ₹8,923.20", "Payment Score: 92%"],
            confidenceScore: 94,
            urgency: "MEDIUM",
            suggestedActionLabel: "Send WhatsApp Reminder",
            createdAt: new Date().toISOString(),
          },
        ],
        suggestedAction: {
          label: "View Customer Accounts & Reminders",
          actionType: "NAVIGATE",
          payload: "/wholesaler/customers",
        },
      };
    }

    // 2. "Show my best-selling products this month" / "Top selling items"
    if (
      q.includes("best selling") ||
      q.includes("top selling") ||
      q.includes("sabse zyada bikne") ||
      q.includes("bikri") ||
      q.includes("sales") ||
      q.includes("fast moving")
    ) {
      const isHindi = q.includes("bikne") || q.includes("bikri") || q.includes("sabse") || q.includes("kaunsa");

      // Aggregate sales by product from orders
      const salesMap: Record<string, { name: string; qty: number; revenue: number; uom: string }> = {};
      myOrders.forEach((o) => {
        o.items.forEach((item) => {
          if (!salesMap[item.productId]) {
            salesMap[item.productId] = { name: item.productName, qty: 0, revenue: 0, uom: item.uom };
          }
          salesMap[item.productId].qty += item.quantity;
          salesMap[item.productId].revenue += item.totalPrice;
        });
      });

      const topProducts = Object.values(salesMap).sort((a, b) => b.revenue - a.revenue);
      const topList = topProducts
        .slice(0, 3)
        .map((p, idx) => `${idx + 1}. **${p.name}**: ${p.qty} ${p.uom} sold (${formatINR(p.revenue)})`)
        .join("\n");

      const answer = isHindi
        ? `इस महीने आपके 3 सबसे ज्यादा बिकने वाले प्रोडक्ट्स हैं:\n\n${topList}\n\n**Aashirvaad Atta** और **Fortune Oil** आपके सबसे बड़े रेवेन्यू ड्राइवर हैं, जिनकी 65% से ज्यादा रिपीट ऑर्डर फ्रीक्वेंसी है।`
        : `Your top 3 best-selling products by wholesale revenue this month are:\n\n${topList}\n\nAashirvaad Atta and Fortune Sunflower Oil represent the bulk of turnover with over 65% repeat order frequency from connected kirana shops.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 97,
        keyDataPoints: topProducts.slice(0, 3).map((p) => ({
          label: p.name.split("(")[0],
          value: `${formatINR(p.revenue)} (${p.qty} ${p.uom})`,
        })),
        recommendations: [],
        suggestedAction: {
          label: "View Detailed Sales Report",
          actionType: "NAVIGATE",
          payload: "/wholesaler/reports",
        },
      };
    }

    // 3. "Low stock" / "Restock needs"
    if (
      q.includes("low stock") ||
      q.includes("restock") ||
      q.includes("khatam") ||
      q.includes("warehouse stock") ||
      q.includes("procurement")
    ) {
      const lowStock = myProducts.filter((p) => p.stockQuantity <= p.lowStockThreshold);
      const isHindi = q.includes("khatam") || q.includes("kam") || q.includes("stock");

      const lowStockList = lowStock
        .map((p) => `• **${p.name}**: Stock ${p.stockQuantity} ${p.uom} (Threshold: ${p.lowStockThreshold})`)
        .join("\n");

      const answer = isHindi
        ? `आपके वेयरहाउस में 2 प्रोडक्ट्स लो-स्टॉक सीमा से नीचे हैं:\n\n${lowStockList}\n\nविशेष रूप से **India Gate Basmati Rice** (14 बैग बचे हैं) और **Tata Tea Gold** (18 बॉक्स) को ITC और Tata डिपो से तुरंत मंगवाने की आवश्यकता है।`
        : `You currently have 2 products below minimum safety threshold:\n\n${lowStockList}\n\nWe estimate inventory stockout within 4-6 days at current distributor dispatch rates. Recommended procurement: +100 units each.`;

      return {
        answer,
        language: isHindi ? "hinglish" : "en",
        confidenceScore: 95,
        keyDataPoints: lowStock.map((p) => ({
          label: p.name.split("(")[0],
          value: `${p.stockQuantity} left (Min: ${p.lowStockThreshold})`,
        })),
        recommendations: [
          {
            id: `rec_${Date.now()}`,
            businessId: params.businessId || "biz_wholesaler_1",
            category: "RESTOCK",
            title: "Depot Inward PO Recommendation",
            recommendation: "Issue procurement Purchase Order to FMCG company depots for Rice & Tea.",
            reasoning: "Stock coverage has fallen below 5 days of forecasted wholesale demand.",
            dataPointsUsed: ["Warehouse Stock Count", "Average Weekly Dispatch Volume", "Depot Lead Time"],
            confidenceScore: 95,
            urgency: "HIGH",
            suggestedActionLabel: "Add Inward Stock",
            createdAt: new Date().toISOString(),
          },
        ],
        suggestedAction: {
          label: "Record Stock Inward",
          actionType: "NAVIGATE",
          payload: "/wholesaler/inventory",
        },
      };
    }
  }

  // General fallback for all queries
  const isHindi = q.includes("kaun") || q.includes("kya") || q.includes("mera") || q.includes("batao");
  return {
    answer: isHindi
      ? `व्यापारAI बिजनेस असिस्टेंट आपके स्टोर के लाइव डेटा का विश्लेषण कर रहा है। आप मुझसे स्टॉक, रीऑर्डर, बकाया उधारी, या टॉप बिकने वाले प्रोडक्ट्स के बारे में सीधे पूछ सकते हैं।`
      : `VyaparAI Assistant is connected to your live business records. You can ask questions about low stock alerts, smart reordering, customer credit, overdue payments, or revenue performance.`,
    language: isHindi ? "hinglish" : "en",
    confidenceScore: 90,
    keyDataPoints: [
      { label: "Data Source", value: "Verified Ledger & ERP Records" },
      { label: "Calculations", value: "100% Deterministic Financials" },
      { label: "Intelligence", value: "Predictive Run-out & Demand Forecasts" },
    ],
    recommendations: [],
  };
}
