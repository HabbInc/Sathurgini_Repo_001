import connectDB from "@/lib/db";
import Category from "@/models/Category"; // ✅ Correct model
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  // Fetch all categories
  const categories = await Category.find().select("name description createdAt");

  return NextResponse.json(categories);
}
