import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req, context) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { id, commentId } = await context.params;

    const { text, rating } = await req.json();
    if (!text || rating === undefined) {
      return new Response("Text and rating are required", { status: 400 });
    }

    const auth = req.headers.get("authorization");
    if (!auth) return new Response("Unauthorized", { status: 401 });

    const token = auth.split(" ")[1];
    const user = verifyToken(token);

    const product = await Product.findById(id);
    if (!product) return new Response("Product not found", { status: 404 });

    const comment = product.comments.id(commentId);
    if (!comment || comment.userId.toString() !== user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    comment.text = text;
    comment.rating = rating;

    await product.save();

    return new Response(JSON.stringify({ message: "Comment updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error editing comment:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
