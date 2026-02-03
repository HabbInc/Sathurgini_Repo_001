// app/api/user/products/[id]/comment/delete/route.js
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req, context) {
  await connectDB();

  const { params } = context;
  const id = params.id;

  const auth = req.headers.get("authorization");
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const token = auth.split(" ")[1];
  const user = verifyToken(token);

  const product = await Product.findById(id);
  if (!product)
    return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });

  product.comments = product.comments.filter(c => c.userId.toString() !== user.id);
  await product.save();

  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}
