import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function POST(req, context) {
  try {
    // 1️⃣ Unwrap params
    const resolvedParams = await context.params;
    const productId = resolvedParams.id;
    console.log("Product ID:", productId);

    // 2️⃣ Check authorization header
    const auth = req.headers.get("authorization");
    console.log("Authorization header:", auth);
    if (!auth) return new Response("Unauthorized", { status: 401 });

    // 🔑 extract & verify token
    const token = auth.split(" ")[1];
    const user = verifyToken(token);

    // 3️⃣ Connect to DB
    await connectDB();
    console.log("Database connected");

    // 4️⃣ Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    const { text, rating } = body;
    if (!text || rating === undefined) {
      return new Response("Comment and rating are required", { status: 400 });
    }

    // 5️⃣ Find product
    const product = await Product.findById(productId);
    if (!product) return new Response("Product not found", { status: 404 });

    // 6️⃣ Ensure comments array exists
    if (!Array.isArray(product.comments)) {
      product.comments = [];
    }

    // 7️⃣ Push comment (✅ FIXED FIELD NAMES)
    product.comments.push({
      userId: user.id,
      userName: user.name,
      text: text,
      rating: rating
    });

    console.log(
      "Comment to be saved:",
      product.comments[product.comments.length - 1]
    );

    // 8️⃣ Save product
    await product.save();
    console.log("Comment saved successfully");

    return new Response(
      JSON.stringify({ message: "Comment added successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in POST /comment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
