import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  await connectDB();

  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).select("name email image");

  return NextResponse.json(user);
}
