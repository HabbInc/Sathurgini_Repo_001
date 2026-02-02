import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  // Fetch all users
  const users = await User.find().select("name email role createdAt");

  return NextResponse.json(users);
}
