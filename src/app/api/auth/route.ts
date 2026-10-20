import { NextResponse } from "next/server";
import { getActiveSession, setActiveSession, switchRole, loginUser, registerBusiness } from "@/lib/auth";

export async function GET() {
  try {
    const session = getActiveSession();
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "switch") {
      const session = setActiveSession(body.userId);
      return NextResponse.json({ success: true, session });
    }

    if (body.action === "switch_role") {
      const session = switchRole(body.role);
      return NextResponse.json({ success: true, session });
    }

    if (body.action === "login") {
      const session = loginUser(body.identifier, body.role);
      return NextResponse.json({ success: true, session });
    }

    if (body.action === "register") {
      const session = registerBusiness(body);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
