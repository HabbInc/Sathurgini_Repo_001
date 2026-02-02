import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const products = await Product.find()
    .populate("adminId", "name email")
    .select("name description price category adminId"); // ✅ ADD price

  const grouped = {};

  products.forEach((product) => {
    const category = product.category || "Others";

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(product);
  });

  return NextResponse.json(grouped);
}
