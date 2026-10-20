import { NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { Order, OrderStatus } from "@/types";
import { recordCreditPurchase } from "@/lib/ledger";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wholesalerId = searchParams.get("wholesalerId");
    const shopkeeperId = searchParams.get("shopkeeperId");
    const status = searchParams.get("status");

    const db = getDB();
    let orders = db.orders;

    if (wholesalerId) {
      orders = orders.filter((o) => o.wholesalerId === wholesalerId);
    }

    if (shopkeeperId) {
      orders = orders.filter((o) => o.shopkeeperId === shopkeeperId);
    }

    if (status && status !== "ALL") {
      orders = orders.filter((o) => o.status === status);
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDB();

    const orderId = `ord_${Date.now()}`;
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      wholesalerId: body.wholesalerId,
      wholesalerName: body.wholesalerName,
      shopkeeperId: body.shopkeeperId,
      shopkeeperName: body.shopkeeperName,
      shopkeeperPhone: body.shopkeeperPhone || "+91 98765 43210",
      deliveryAddress: body.deliveryAddress,
      items: body.items,
      subtotal: Number(body.subtotal),
      taxAmount: Number(body.taxAmount),
      deliveryCharge: Number(body.deliveryCharge || 0),
      totalAmount: Number(body.totalAmount),
      status: "PENDING",
      paymentMethod: body.paymentMethod || "CREDIT",
      paymentStatus: "UNPAID",
      paidAmount: 0,
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);

    // Create notification for wholesaler
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      recipientId: body.wholesalerId,
      title: "New Wholesale Order!",
      message: `${body.shopkeeperName} placed order #${orderNumber} for ₹${body.totalAmount}.`,
      type: "ORDER",
      read: false,
      linkUrl: "/wholesaler/orders",
      createdAt: new Date().toISOString(),
    });

    // Add audit log
    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: body.shopkeeperName,
      action: "ORDER_CREATED",
      details: `Created order #${orderNumber} for ₹${body.totalAmount}`,
      entityId: orderId,
    });

    saveDB(db);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, action, rejectionReason, dispatchDetails, actorName } = body;

    const db = getDB();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;

    if (action === "ACCEPT") {
      order.status = "ACCEPTED";
      order.updatedAt = new Date().toISOString();

      // Deduct stock from wholesaler inventory
      order.items.forEach((item) => {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          // Log stock movement
          db.stockMovements.unshift({
            id: `mov_${Date.now()}_${prod.id}`,
            businessId: order.wholesalerId,
            productId: prod.id,
            productName: prod.name,
            type: "ORDER_FULFILLMENT",
            quantityChanged: -item.quantity,
            quantityAfter: prod.stockQuantity,
            referenceId: order.id,
            reason: `Order #${order.orderNumber} accepted for ${order.shopkeeperName}`,
            date: new Date().toISOString().split("T")[0],
            createdBy: actorName || "Wholesaler",
          });
        }
      });

      // Notification for shopkeeper
      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        recipientId: order.shopkeeperId,
        title: "Order Accepted!",
        message: `Your order #${order.orderNumber} has been confirmed by ${order.wholesalerName}.`,
        type: "ORDER",
        read: false,
        linkUrl: "/shopkeeper/orders",
        createdAt: new Date().toISOString(),
      });
    } else if (action === "REJECT") {
      order.status = "CANCELLED";
      order.rejectionReason = rejectionReason || "Out of stock / logistics constraint";
      order.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        recipientId: order.shopkeeperId,
        title: "Order Could Not Be Fulfilled",
        message: `Order #${order.orderNumber} was rejected: ${order.rejectionReason}`,
        type: "ORDER",
        read: false,
        linkUrl: "/shopkeeper/orders",
        createdAt: new Date().toISOString(),
      });
    } else if (action === "PACK") {
      order.status = "PACKED";
      order.updatedAt = new Date().toISOString();
    } else if (action === "DISPATCH") {
      order.status = "DISPATCHED";
      order.dispatchDetails = dispatchDetails || {
        transporterName: "Local Tempo Service",
        vehicleNumber: "DL-1LE-1234",
        trackingContact: "+91 98110 00000",
        dispatchTime: new Date().toISOString(),
      };
      order.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        recipientId: order.shopkeeperId,
        title: "Order Dispatched!",
        message: `Order #${order.orderNumber} is on the way via ${order.dispatchDetails?.transporterName || "Transporter"}.`,
        type: "ORDER",
        read: false,
        linkUrl: "/shopkeeper/orders",
        createdAt: new Date().toISOString(),
      });
    } else if (action === "DELIVER") {
      order.status = "DELIVERED";
      order.deliveredAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();

      // 1. If payment method is CREDIT, record in the shared ledger
      if (order.paymentMethod === "CREDIT") {
        const invoiceNumber = `INV-GW-${new Date().getFullYear()}-${order.orderNumber.replace(/[^0-9]/g, "").slice(-4)}`;
        // Calculate due date (default 7 days)
        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

        recordCreditPurchase({
          wholesalerId: order.wholesalerId,
          wholesalerName: order.wholesalerName,
          shopkeeperId: order.shopkeeperId,
          shopkeeperName: order.shopkeeperName,
          orderId: order.id,
          invoiceNumber,
          amount: order.totalAmount,
          dueDate,
          createdBy: actorName || "System",
          notes: `Credit billed upon delivery of Order #${order.orderNumber}`,
        });
      }

      // 2. Automatically update shopkeeper's retail inventory
      order.items.forEach((item) => {
        const existing = db.retailInventory.find(
          (r) => r.shopkeeperId === order.shopkeeperId && r.name.toLowerCase() === item.productName.toLowerCase()
        );

        if (existing) {
          existing.currentStock += item.quantity;
          existing.lastRestockedDate = new Date().toISOString().split("T")[0];
        } else {
          db.retailInventory.push({
            id: `ret_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            shopkeeperId: order.shopkeeperId,
            productId: item.productId,
            name: item.productName,
            category: "General Grocery",
            uom: item.uom,
            currentStock: item.quantity,
            purchasePrice: item.unitPrice,
            retailSellingPrice: Math.round(item.unitPrice * 1.15),
            lowStockThreshold: Math.max(5, Math.ceil(item.quantity * 0.2)),
            preferredWholesalerId: order.wholesalerId,
            preferredWholesalerName: order.wholesalerName,
            lastRestockedDate: new Date().toISOString().split("T")[0],
            dailyAvgSales: 2.0,
          });
        }
      });

      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        recipientId: order.shopkeeperId,
        title: "Order Delivered!",
        message: `Order #${order.orderNumber} marked as delivered. Items added to your shop inventory.`,
        type: "ORDER",
        read: false,
        linkUrl: "/shopkeeper/inventory",
        createdAt: new Date().toISOString(),
      });
    }

    // Audit log
    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: actorName || "Wholesaler",
      action: `ORDER_STATUS_${order.status}`,
      details: `Changed order #${order.orderNumber} status from ${previousStatus} to ${order.status}`,
      entityId: order.id,
    });

    saveDB(db);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
