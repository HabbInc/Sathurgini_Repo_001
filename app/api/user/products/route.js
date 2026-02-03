import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // ✅ users see ALL products from ALL admins
    const products = await Product.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    console.error("USER GET PRODUCTS ERROR:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
