import { NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const id = searchParams.get("id");

    const db = getDB();

    if (id) {
      const biz = db.businesses.find((b) => b.id === id);
      return NextResponse.json({ success: true, business: biz });
    }

    let businesses = db.businesses;
    if (role) {
      businesses = businesses.filter((b) => b.role === role);
    }

    return NextResponse.json({ success: true, businesses });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { businessId, verificationStatus, creditLimit, defaultPaymentTerms } = body;

    const db = getDB();
    const biz = db.businesses.find((b) => b.id === businessId);
    if (!biz) {
      return NextResponse.json({ success: false, error: "Business not found" }, { status: 404 });
    }

    if (verificationStatus) biz.verificationStatus = verificationStatus;
    if (creditLimit !== undefined) biz.creditLimit = Number(creditLimit);
    if (defaultPaymentTerms) biz.defaultPaymentTerms = defaultPaymentTerms;

    saveDB(db);
    return NextResponse.json({ success: true, business: biz });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
