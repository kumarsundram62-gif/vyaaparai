import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { FeedbackItem, FeedbackCategory, FeedbackStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let items = db.feedbackItems || [];
    if (category) {
      items = items.filter((f) => f.category === category);
    }
    if (status) {
      items = items.filter((f) => f.status === status);
    }

    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { screenshotUrl, honeypot } = body;

    // Spam prevention honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, referenceNumber: "VYP-FB-SPAM" });
    }

    let category = body.category || "GENERAL";
    if (category === "Feature Request") category = "FEATURE_REQUEST";
    else if (category === "Bug Report") category = "BUG_REPORT";
    else if (category === "Design / UI") category = "UI_UX";
    else if (category === "General Feedback") category = "GENERAL";

    const description = (body.description || body.feedback || "").trim();
    const title = (body.title || (description ? description.slice(0, 45) + "..." : "Feedback")).trim();
    const email = (body.email || body.contactEmail || "").trim().toLowerCase() || undefined;

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Please provide feedback details." },
        { status: 400 }
      );
    }

    const validCategories: FeedbackCategory[] = [
      "FEATURE_REQUEST",
      "BUG_REPORT",
      "UI_UX",
      "AI_ASSISTANT",
      "GENERAL",
    ];

    const safeCategory = validCategories.includes(category as FeedbackCategory)
      ? (category as FeedbackCategory)
      : "GENERAL";

    const db = getDB();
    const count = (db.feedbackItems ? db.feedbackItems.length : 0) + 1;
    const refNum = `VYP-FB-${1040 + count}`;
    const id = `fb_${Date.now()}`;

    const newFeedback: FeedbackItem = {
      id,
      referenceNumber: refNum,
      category,
      title: title.trim(),
      description: description.trim(),
      email: email?.trim().toLowerCase() || undefined,
      screenshotUrl: screenshotUrl?.trim() || undefined,
      status: "NEW",
      priority: category === "BUG_REPORT" ? "HIGH" : "MEDIUM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.feedbackItems) {
      db.feedbackItems = [];
    }
    db.feedbackItems.unshift(newFeedback);

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: email ? email : "Anonymous User",
      action: "FEEDBACK_SUBMITTED",
      details: `Submitted feedback ${refNum}: [${category}] ${title}`,
      entityId: id,
    });

    saveDB(db);

    return NextResponse.json({
      success: true,
      message: "Thank you for your valuable feedback!",
      referenceNumber: refNum,
      feedback: newFeedback,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, priority, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Feedback ID is required." }, { status: 400 });
    }

    const db = getDB();
    const itemIndex = db.feedbackItems.findIndex((f) => f.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: "Feedback not found." }, { status: 404 });
    }

    const item = db.feedbackItems[itemIndex];
    if (status) item.status = status as FeedbackStatus;
    if (priority) item.priority = priority;
    if (internalNotes !== undefined) item.internalNotes = internalNotes;
    item.updatedAt = new Date().toISOString();

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Admin",
      action: "FEEDBACK_UPDATED",
      details: `Updated feedback ${item.referenceNumber} status to ${status || item.status}`,
      entityId: id,
    });

    saveDB(db);

    return NextResponse.json({
      success: true,
      message: "Feedback status updated.",
      feedback: item,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
