import { NextResponse } from "next/server";
import { resetDB } from "@/lib/db";

export async function POST() {
  try {
    const freshSeed = resetDB();
    return NextResponse.json({
      success: true,
      message: "Database successfully reset to initial realistic Indian FMCG demo state.",
      productsCount: freshSeed.products.length,
      ordersCount: freshSeed.orders.length,
      businessesCount: freshSeed.businesses.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
