import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const product = await Product.findById(id).populate(
      "adminId",
      "name email"
    );

    if (!product) {
      return new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
