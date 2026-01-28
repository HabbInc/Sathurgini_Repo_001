import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();

    // 1️⃣ verify token
    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ find admin from DB
    const admin = await User.findById(decoded.id).select("name email");

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    // 3️⃣ return admin data
    return NextResponse.json({
      name: admin.name,
      email: admin.email,
      image: admin.image  || "/profile.png"
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
