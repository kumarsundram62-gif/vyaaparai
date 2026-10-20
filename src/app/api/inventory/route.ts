import { NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { StockMovement, RetailInventoryItem } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const role = searchParams.get("role");

    const db = getDB();

    if (role === "shopkeeper" && businessId) {
      const items = db.retailInventory.filter((r) => r.shopkeeperId === businessId);
      return NextResponse.json({ success: true, items });
    }

    // Wholesaler or general inventory
    const products = businessId
      ? db.products.filter((p) => p.wholesalerId === businessId)
      : db.products;

    const movements = businessId
      ? db.stockMovements.filter((m) => m.businessId === businessId)
      : db.stockMovements;

    return NextResponse.json({
      success: true,
      products,
      movements: movements.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = getDB();

    // Wholesaler: Stock Inward
    if (action === "INWARD") {
      const product = db.products.find((p) => p.id === body.productId);
      if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

      const qty = Number(body.quantity);
      product.stockQuantity += qty;
      product.updatedAt = new Date().toISOString();

      const movement: StockMovement = {
        id: `mov_${Date.now()}`,
        businessId: body.businessId,
        productId: product.id,
        productName: product.name,
        type: "INWARD",
        quantityChanged: qty,
        quantityAfter: product.stockQuantity,
        referenceId: body.supplierInvoiceNo || "INWARD-PO",
        reason: body.notes || `Stock inward from supplier: ${body.supplierName || "Direct Depot"}`,
        date: new Date().toISOString().split("T")[0],
        createdBy: body.actorName || "Wholesaler",
      };

      db.stockMovements.unshift(movement);
      saveDB(db);
      return NextResponse.json({ success: true, product, movement });
    }

    // Wholesaler: Log Damage or Return
    if (action === "DAMAGE" || action === "RETURN" || action === "ADJUSTMENT") {
      const product = db.products.find((p) => p.id === body.productId);
      if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

      const qty = Number(body.quantity);
      const isDeduction = action === "DAMAGE" || (action === "ADJUSTMENT" && qty < 0);
      product.stockQuantity = Math.max(0, product.stockQuantity + (isDeduction ? -Math.abs(qty) : Math.abs(qty)));
      product.updatedAt = new Date().toISOString();

      const movement: StockMovement = {
        id: `mov_${Date.now()}`,
        businessId: body.businessId,
        productId: product.id,
        productName: product.name,
        type: action,
        quantityChanged: isDeduction ? -Math.abs(qty) : Math.abs(qty),
        quantityAfter: product.stockQuantity,
        reason: body.reason || `${action} stock entry`,
        date: new Date().toISOString().split("T")[0],
        createdBy: body.actorName || "Wholesaler",
      };

      db.stockMovements.unshift(movement);
      saveDB(db);
      return NextResponse.json({ success: true, product, movement });
    }

    // Shopkeeper: Record Daily Counter Sales
    if (action === "RETAIL_SALE") {
      const item = db.retailInventory.find((r) => r.id === body.itemId);
      if (!item) return NextResponse.json({ success: false, error: "Retail item not found" }, { status: 404 });

      const soldQty = Number(body.quantitySold);
      item.currentStock = Math.max(0, item.currentStock - soldQty);

      saveDB(db);
      return NextResponse.json({ success: true, item });
    }

    // Shopkeeper: Add custom retail item
    if (action === "ADD_RETAIL_ITEM") {
      const newItem: RetailInventoryItem = {
        id: `ret_${Date.now()}`,
        shopkeeperId: body.shopkeeperId,
        name: body.name,
        category: body.category || "General Grocery",
        uom: body.uom || "pack",
        currentStock: Number(body.currentStock) || 0,
        purchasePrice: Number(body.purchasePrice) || 0,
        retailSellingPrice: Number(body.retailSellingPrice) || 0,
        lowStockThreshold: Number(body.lowStockThreshold) || 5,
        lastRestockedDate: new Date().toISOString().split("T")[0],
        dailyAvgSales: Number(body.dailyAvgSales) || 1.0,
      };

      db.retailInventory.push(newItem);
      saveDB(db);
      return NextResponse.json({ success: true, item: newItem });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
