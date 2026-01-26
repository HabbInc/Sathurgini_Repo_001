import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register API error:", error); // <-- ADD THIS
    return NextResponse.json({ message: "Register failed" }, { status: 500 });
  }
}
