import connectDB from "@/lib/db"; // MongoDB connection helper
import Product from "@/models/Product"; // Product model

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

    // 7️⃣ Push comment
    product.comments.push({
      comment: text,      // text from frontend
      points: rating,     // rating from frontend
      user: auth,         // currently storing token; you can decode JWT for user ID
      date: new Date(),
    });
    console.log("Comment to be saved:", product.comments[product.comments.length - 1]);

    // 8️⃣ Save product
    await product.save();
    console.log("Comment saved successfully");

    return new Response(JSON.stringify({ message: "Comment added successfully" }), { status: 200 });

  } catch (error) {
    console.error("Error in POST /comment:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
