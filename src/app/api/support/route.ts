import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { SupportTicket } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let tickets = db.supportTickets || [];
    if (email) {
      tickets = tickets.filter((t) => t.email.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({ success: true, tickets });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, businessName, email, phone, subject, message, honeypot } = body;

    // Basic anti-spam check (honeypot field)
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Ticket received." });
    }

    if (!name || (!email && !phone) || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide Name, Phone or Email, and Message." },
        { status: 400 }
      );
    }

    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : `${(phone || "user").replace(/[^0-9]/g, "")}@vyaparai.in`;

    const db = getDB();
    const count = (db.supportTickets ? db.supportTickets.length : 0) + 1;
    const ticketId = `tkt_${Date.now().toString().slice(-6)}`;
    const ticketNumber = `TKT-${1000 + count}`;
    const newTicket: SupportTicket & { ticketNumber?: string } = {
      id: ticketId,
      name: name.trim(),
      businessName: businessName?.trim() || undefined,
      email: cleanEmail,
      phone: phone?.trim() || undefined,
      subject: subject ? subject.trim() : `Support request from ${name.trim()}`,
      message: message.trim(),
      status: "OPEN",
      priority: body.priority || "MEDIUM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.supportTickets) {
      db.supportTickets = [];
    }
    db.supportTickets.unshift(newTicket);

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${name} (${cleanEmail})`,
      action: "SUPPORT_TICKET_CREATED",
      details: `Created support ticket #${ticketNumber}: "${newTicket.subject}"`,
      entityId: ticketId,
    });

    saveDB(db);

    return NextResponse.json({
      success: true,
      message: "Your support request has been submitted successfully.",
      ticket: {
        ...newTicket,
        ticketNumber,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, priority, internalNotes, assignedTo } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Ticket ID is required." }, { status: 400 });
    }

    const db = getDB();
    const itemIndex = db.supportTickets.findIndex((t) => t.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: "Ticket not found." }, { status: 404 });
    }

    const ticket = db.supportTickets[itemIndex];
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (internalNotes !== undefined) ticket.internalNotes = internalNotes;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    ticket.updatedAt = new Date().toISOString();

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Admin",
      action: "SUPPORT_TICKET_UPDATED",
      details: `Updated ticket ${ticket.id} status to ${status || ticket.status}`,
      entityId: id,
    });

    saveDB(db);

    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully.",
      ticket,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
