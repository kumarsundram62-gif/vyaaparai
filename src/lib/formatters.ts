// Indian Currency and Date formatters for VyaparAI

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRWithDecimals(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumberIN(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDateIN(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTimeIN(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export function getDaysAgo(dateString: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "";
  }
}

export function getDaysOverdue(dueDateString?: string): number {
  if (!dueDateString) return 0;
  try {
    const due = new Date(dueDateString);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch {
    return 0;
  }
}

/**
 * Generates a valid international WhatsApp direct link (defaulting to Indian code 91)
 */
export function formatWhatsAppUrl(phone: string, text?: string): string {
  if (!phone) return "https://wa.me/917562817736";
  // Strip all non-digit characters
  const clean = phone.replace(/[^0-9]/g, "");
  // If 10 digits (standard Indian number), prefix 91
  let normalized = clean;
  if (clean.length === 10) {
    normalized = `91${clean}`;
  } else if (!clean.startsWith("91") && clean.length > 0) {
    normalized = `91${clean}`;
  }
  const params = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${normalized || "917562817736"}${params}`;
}

/**
 * Returns direct WhatsApp link to VyaparAI / Founder support line
 */
export function getSupportWhatsAppUrl(text?: string): string {
  return formatWhatsAppUrl(
    "917562817736",
    text || "Namaste Shivam / VyaparAI Support! I have a question about the platform."
  );
}
