import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - token missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // ✅ Pass token string to verifyToken
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // ✅ Find admin from DB
    const admin = await User.findById(decoded.id).select("name email image");

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    // ✅ Return admin data
    return NextResponse.json({
      name: admin.name,
      email: admin.email,
      image: admin.image || "/profile.png",
    });

  } catch (error) {
    console.error("ADMIN ME API ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
