import { NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get("recipientId");

    const db = getDB();
    let notifications = db.notifications;

    if (recipientId) {
      notifications = notifications.filter((n) => n.recipientId === recipientId);
    }

    return NextResponse.json({ success: true, notifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { notificationId, markAllRead, recipientId } = body;

    const db = getDB();

    if (markAllRead && recipientId) {
      db.notifications.forEach((n) => {
        if (n.recipientId === recipientId) n.read = true;
      });
      saveDB(db);
      return NextResponse.json({ success: true });
    }

    if (notificationId) {
      const n = db.notifications.find((notif) => notif.id === notificationId);
      if (n) {
        n.read = true;
        saveDB(db);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
