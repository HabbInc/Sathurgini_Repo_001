import connectDB from "@/lib/db";
import Comment from "@/models/Comment";
import { verifyToken } from "@/lib/auth";

/* =========================
   GET — fetch comments by productId
========================= */
export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) return new Response(JSON.stringify([]), { status: 200 });

    const comments = await Comment.find({ productId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

/* =========================
   POST — add comment
========================= */
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const { productId, comment, rating } = data;

    let userName = "Anonymous";

    // optional: get user from token
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
      if (decoded) userName = decoded.name || "User";
    }

    const newComment = await Comment.create({
      productId,
      comment,
      rating: rating || 5,
      userName,
    });

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to add comment" }), { status: 500 });
  }
}
