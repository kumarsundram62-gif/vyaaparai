import { NextResponse } from "next/server";
import { processAIQuery } from "@/lib/ai-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, businessId, role } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const aiResult = processAIQuery({
      query,
      businessId: businessId || "biz_wholesaler_1",
      role: role || "wholesaler",
    });

    return NextResponse.json({ success: true, ...aiResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
