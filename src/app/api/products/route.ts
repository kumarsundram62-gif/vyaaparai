import { NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { Product } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wholesalerId = searchParams.get("wholesalerId");
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const db = getDB();
    let products = db.products;

    if (wholesalerId) {
      products = products.filter((p) => p.wholesalerId === wholesalerId);
    }

    if (category && category !== "all") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDB();

    // Check if bulk upload
    if (Array.isArray(body.products)) {
      const newItems: Product[] = body.products.map((p: any) => ({
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        wholesalerId: body.wholesalerId || "biz_wholesaler_1",
        wholesalerName: body.wholesalerName || "Gupta Wholesale Mega Mart",
        sku: p.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: p.name,
        category: p.category || "Packaged Foods & Snacks",
        brand: p.brand || "General",
        description: p.description || "",
        imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
        uom: p.uom || "pack",
        purchasePrice: Number(p.purchasePrice) || 100,
        wholesalePrice: Number(p.wholesalePrice) || 120,
        retailMrp: Number(p.retailMrp) || 150,
        moq: Number(p.moq) || 5,
        stockQuantity: Number(p.stockQuantity) || 50,
        lowStockThreshold: Number(p.lowStockThreshold) || 10,
        batchNumber: p.batchNumber || "B-NEW",
        expiryDate: p.expiryDate || "2027-12-31",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      db.products.push(...newItems);
      saveDB(db);
      return NextResponse.json({ success: true, count: newItems.length });
    }

    // Single item creation
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      wholesalerId: body.wholesalerId,
      wholesalerName: body.wholesalerName,
      sku: body.sku || `SKU-${Date.now().toString().slice(-4)}`,
      name: body.name,
      category: body.category,
      brand: body.brand,
      description: body.description || "",
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
      uom: body.uom || "pack",
      purchasePrice: Number(body.purchasePrice),
      wholesalePrice: Number(body.wholesalePrice),
      retailMrp: Number(body.retailMrp),
      moq: Number(body.moq) || 1,
      stockQuantity: Number(body.stockQuantity) || 0,
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      batchNumber: body.batchNumber,
      expiryDate: body.expiryDate,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDB(db);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const db = getDB();

    const index = db.products.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    db.products[index] = {
      ...db.products[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    saveDB(db);
    return NextResponse.json({ success: true, product: db.products[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });

    const db = getDB();
    db.products = db.products.filter((p) => p.id !== id);
    saveDB(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
