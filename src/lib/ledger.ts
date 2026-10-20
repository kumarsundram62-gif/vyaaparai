import { LedgerTransaction, DisputeStatus } from "@/types";
import { getDB, saveDB } from "./db";

/**
 * Deterministic Ledger Balance Formula:
 * Outstanding Balance = Opening Balance + Credit Purchases + Approved Charges - Payments - Credit Notes
 */
export function calculateBalance(transactions: LedgerTransaction[]): number {
  let balance = 0;
  // Sort chronologically
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const txn of sorted) {
    if (txn.type === "OPENING_BALANCE" || txn.type === "CREDIT_PURCHASE") {
      balance += txn.debit;
    } else if (txn.type === "PAYMENT" || txn.type === "CREDIT_NOTE" || txn.type === "REFUND") {
      balance -= txn.credit;
    } else if (txn.type === "ADJUSTMENT") {
      balance = balance + txn.debit - txn.credit;
    }
  }

  // Round to 2 decimal places to avoid floating point inaccuracies
  return Math.round(balance * 100) / 100;
}

/**
 * Fetch all ledger transactions between a specific wholesaler and shopkeeper,
 * recalculating the running balance deterministically.
 */
export function getCustomerLedger(wholesalerId: string, shopkeeperId: string) {
  const db = getDB();
  const txns = db.ledgerTransactions
    .filter(
      (t) => t.wholesalerId === wholesalerId && t.shopkeeperId === shopkeeperId
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let running = 0;
  const computedTxns = txns.map((t) => {
    if (t.type === "OPENING_BALANCE" || t.type === "CREDIT_PURCHASE") {
      running += t.debit;
    } else if (t.type === "PAYMENT" || t.type === "CREDIT_NOTE" || t.type === "REFUND") {
      running -= t.credit;
    } else if (t.type === "ADJUSTMENT") {
      running = running + t.debit - t.credit;
    }
    running = Math.round(running * 100) / 100;
    return {
      ...t,
      runningBalance: running,
    };
  });

  return {
    transactions: computedTxns,
    currentBalance: Math.max(0, running),
    totalBilled: txns.reduce((sum, t) => sum + t.debit, 0),
    totalPaid: txns
      .filter((t) => t.type === "PAYMENT")
      .reduce((sum, t) => sum + t.credit, 0),
  };
}

/**
 * Record a new credit purchase in the shared ledger when order is accepted/delivered
 */
export function recordCreditPurchase(params: {
  wholesalerId: string;
  wholesalerName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  orderId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  createdBy: string;
  notes?: string;
}): LedgerTransaction {
  const db = getDB();
  const { currentBalance } = getCustomerLedger(
    params.wholesalerId,
    params.shopkeeperId
  );

  const newBalance = Math.round((currentBalance + params.amount) * 100) / 100;
  const txnId = `txn_${Date.now()}`;
  const txnNumber = `TXN-${new Date().getFullYear()}-${Math.floor(
    10000 + Math.random() * 90000
  )}`;

  const newTxn: LedgerTransaction = {
    id: txnId,
    transactionNumber: txnNumber,
    wholesalerId: params.wholesalerId,
    wholesalerName: params.wholesalerName,
    shopkeeperId: params.shopkeeperId,
    shopkeeperName: params.shopkeeperName,
    orderId: params.orderId,
    invoiceNumber: params.invoiceNumber,
    type: "CREDIT_PURCHASE",
    debit: params.amount,
    credit: 0,
    runningBalance: newBalance,
    dueDate: params.dueDate,
    paymentMethod: "CREDIT",
    referenceNotes: params.notes || `Credit purchase for Order #${params.orderId}`,
    disputeStatus: "NONE",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
  };

  db.ledgerTransactions.push(newTxn);
  db.auditLogs.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: params.createdBy,
    action: "LEDGER_CREDIT_PURCHASE",
    details: `Recorded credit invoice ${params.invoiceNumber} of ₹${params.amount} for ${params.shopkeeperName}`,
    entityId: newTxn.id,
  });

  saveDB(db);
  return newTxn;
}

/**
 * Record payment received against ledger/invoice
 */
export function recordPayment(params: {
  wholesalerId: string;
  wholesalerName: string;
  shopkeeperId: string;
  shopkeeperName: string;
  orderId?: string;
  invoiceNumber?: string;
  amount: number;
  paymentMethod: "CASH" | "UPI" | "CHEQUE" | "BANK_TRANSFER";
  referenceNotes: string;
  receiptNumber?: string;
  createdBy: string;
}): LedgerTransaction {
  const db = getDB();
  const { currentBalance } = getCustomerLedger(
    params.wholesalerId,
    params.shopkeeperId
  );

  const newBalance = Math.max(
    0,
    Math.round((currentBalance - params.amount) * 100) / 100
  );
  const txnId = `txn_${Date.now()}`;
  const txnNumber = `TXN-${new Date().getFullYear()}-${Math.floor(
    10000 + Math.random() * 90000
  )}`;

  const newTxn: LedgerTransaction = {
    id: txnId,
    transactionNumber: txnNumber,
    wholesalerId: params.wholesalerId,
    wholesalerName: params.wholesalerName,
    shopkeeperId: params.shopkeeperId,
    shopkeeperName: params.shopkeeperName,
    orderId: params.orderId,
    invoiceNumber: params.invoiceNumber,
    type: "PAYMENT",
    debit: 0,
    credit: params.amount,
    runningBalance: newBalance,
    paymentMethod: params.paymentMethod,
    referenceNotes: params.referenceNotes,
    receiptNumber:
      params.receiptNumber ||
      `REC-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
    disputeStatus: "NONE",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
  };

  db.ledgerTransactions.push(newTxn);

  // If orderId is provided, update order paid amount
  if (params.orderId) {
    const order = db.orders.find((o) => o.id === params.orderId);
    if (order) {
      order.paidAmount = (order.paidAmount || 0) + params.amount;
      if (order.paidAmount >= order.totalAmount) {
        order.paymentStatus = "PAID";
      } else if (order.paidAmount > 0) {
        order.paymentStatus = "PARTIAL";
      }
    }
  }

  db.auditLogs.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: params.createdBy,
    action: "LEDGER_PAYMENT_RECORDED",
    details: `Recorded ${params.paymentMethod} payment of ₹${params.amount} from ${params.shopkeeperName}`,
    entityId: newTxn.id,
  });

  saveDB(db);
  return newTxn;
}

/**
 * Raise a dispute on a transaction (auditable, does not silently modify ledger)
 */
export function raiseDispute(
  transactionId: string,
  reason: string,
  raisedBy: string
) {
  const db = getDB();
  const txn = db.ledgerTransactions.find((t) => t.id === transactionId);
  if (!txn) throw new Error("Transaction not found");

  txn.disputeStatus = "OPEN";
  txn.disputeReason = reason;
  txn.disputeRaisedBy = raisedBy;

  db.auditLogs.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: raisedBy,
    action: "DISPUTE_RAISED",
    details: `Dispute raised on transaction ${txn.transactionNumber}: "${reason}"`,
    entityId: txn.id,
  });

  saveDB(db);
  return txn;
}

/**
 * Resolve a dispute with resolution notes, optionally issuing a credit note
 */
export function resolveDispute(
  transactionId: string,
  status: "RESOLVED" | "REJECTED",
  resolutionNotes: string,
  creditNoteAmount: number = 0,
  resolvedBy: string
) {
  const db = getDB();
  const txn = db.ledgerTransactions.find((t) => t.id === transactionId);
  if (!txn) throw new Error("Transaction not found");

  txn.disputeStatus = status;
  txn.disputeResolutionNotes = resolutionNotes;

  // If a credit note is granted, add an auditable CREDIT_NOTE transaction
  if (status === "RESOLVED" && creditNoteAmount > 0) {
    const { currentBalance } = getCustomerLedger(
      txn.wholesalerId,
      txn.shopkeeperId
    );
    const newTxn: LedgerTransaction = {
      id: `txn_${Date.now()}`,
      transactionNumber: `CN-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      wholesalerId: txn.wholesalerId,
      wholesalerName: txn.wholesalerName,
      shopkeeperId: txn.shopkeeperId,
      shopkeeperName: txn.shopkeeperName,
      invoiceNumber: txn.invoiceNumber,
      type: "CREDIT_NOTE",
      debit: 0,
      credit: creditNoteAmount,
      runningBalance: Math.max(0, currentBalance - creditNoteAmount),
      referenceNotes: `Dispute Resolution Credit Note for ${txn.transactionNumber}: ${resolutionNotes}`,
      disputeStatus: "RESOLVED",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      createdBy: resolvedBy,
    };
    db.ledgerTransactions.push(newTxn);
  }

  db.auditLogs.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: resolvedBy,
    action: "DISPUTE_RESOLVED",
    details: `Dispute on ${txn.transactionNumber} ${status}. Credit Note: ₹${creditNoteAmount}. Notes: ${resolutionNotes}`,
    entityId: txn.id,
  });

  saveDB(db);
  return txn;
}
