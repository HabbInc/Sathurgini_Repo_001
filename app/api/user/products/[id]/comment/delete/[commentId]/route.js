import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req, context) {
  try {
    await connectDB();

    // unwrap params
    const { id, commentId } = await context.params;

    const auth = req.headers.get("authorization");
    if (!auth) return new Response("Unauthorized", { status: 401 });

    const token = auth.split(" ")[1];
    const user = verifyToken(token);

    const product = await Product.findById(id);
    if (!product) return new Response("Product not found", { status: 404 });

    const comment = product.comments.find(
      c => c._id.toString() === commentId
    );
    if (!comment || comment.userId.toString() !== user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // ✅ Filter out the comment instead of using .remove()
    product.comments = product.comments.filter(
      c => c._id.toString() !== commentId
    );

    await product.save();

    return new Response(JSON.stringify({ message: "Comment deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
