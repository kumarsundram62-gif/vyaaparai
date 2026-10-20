import { NextResponse } from "next/server";
import { getCustomerLedger, recordPayment, raiseDispute, resolveDispute } from "@/lib/ledger";
import { getDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wholesalerId = searchParams.get("wholesalerId");
    const shopkeeperId = searchParams.get("shopkeeperId");

    const db = getDB();

    // If both specified, return detailed shared ledger
    if (wholesalerId && shopkeeperId) {
      const ledger = getCustomerLedger(wholesalerId, shopkeeperId);
      return NextResponse.json({ success: true, ledger });
    }

    // If only shopkeeperId specified, return all transactions involving that shopkeeper
    if (shopkeeperId) {
      const txns = db.ledgerTransactions
        .filter((t) => t.shopkeeperId === shopkeeperId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const totalBalance = txns.reduce((acc, t) => acc + (t.debit - t.credit), 0);

      return NextResponse.json({
        success: true,
        transactions: txns,
        totalBalance: Math.max(0, Math.round(totalBalance * 100) / 100),
      });
    }

    // If only wholesalerId specified, return all customer balances
    if (wholesalerId) {
      const txns = db.ledgerTransactions
        .filter((t) => t.wholesalerId === wholesalerId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Aggregate balance per shopkeeper
      const shopkeepersMap: Record<string, { id: string; name: string; balance: number; lastTxnDate: string }> = {};
      txns.forEach((t) => {
        if (!shopkeepersMap[t.shopkeeperId]) {
          shopkeepersMap[t.shopkeeperId] = {
            id: t.shopkeeperId,
            name: t.shopkeeperName,
            balance: 0,
            lastTxnDate: t.date,
          };
        }
        shopkeepersMap[t.shopkeeperId].balance += t.debit - t.credit;
      });

      const totalReceivable = Object.values(shopkeepersMap).reduce(
        (sum, item) => sum + Math.max(0, item.balance),
        0
      );

      return NextResponse.json({
        success: true,
        transactions: txns,
        customerBalances: Object.values(shopkeepersMap),
        totalReceivable: Math.round(totalReceivable * 100) / 100,
      });
    }

    // Admin view: return all transactions
    return NextResponse.json({
      success: true,
      transactions: db.ledgerTransactions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "RECORD_PAYMENT") {
      const newTxn = recordPayment({
        wholesalerId: body.wholesalerId,
        wholesalerName: body.wholesalerName,
        shopkeeperId: body.shopkeeperId,
        shopkeeperName: body.shopkeeperName,
        orderId: body.orderId,
        invoiceNumber: body.invoiceNumber,
        amount: Number(body.amount),
        paymentMethod: body.paymentMethod || "UPI",
        referenceNotes: body.referenceNotes || "Payment received",
        receiptNumber: body.receiptNumber,
        createdBy: body.actorName || "Wholesaler",
      });
      return NextResponse.json({ success: true, transaction: newTxn });
    }

    if (action === "RAISE_DISPUTE") {
      const txn = raiseDispute(body.transactionId, body.reason, body.raisedBy);
      return NextResponse.json({ success: true, transaction: txn });
    }

    if (action === "RESOLVE_DISPUTE") {
      const txn = resolveDispute(
        body.transactionId,
        body.status, // "RESOLVED" or "REJECTED"
        body.resolutionNotes,
        Number(body.creditNoteAmount || 0),
        body.resolvedBy
      );
      return NextResponse.json({ success: true, transaction: txn });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
