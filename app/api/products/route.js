import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

/* ======================
   GET — list all products
   ====================== */
export async function GET(req) {
  try {
    await connectDB();

    // ✅ Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify([]), { status: 200 }); // no token → return empty array
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return new Response(JSON.stringify([]), { status: 200 });

    const adminId = decoded.id;

    // ✅ Fetch only products created by this admin
    const products = await Product.find({ adminId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

/* ======================
   POST — add product
   ====================== */
export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Unauthorized - token missing" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }
    const adminId = decoded.id;

    // ✅ Read form data
    const data = await req.formData();
    const name = data.get("name");
    const price = data.get("price");
    const category = data.get("category");
    const description = data.get("description");

    // ✅ Handle image
    const image = data.get("image");
    let imageUrl = "";

    if (image && image.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    if (!name || !price) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

const product = await Product.create({
  name,
  price,
  category,
  description,
  image: imageUrl,
  adminId: adminId, // must match your schema
});


    return new Response(JSON.stringify(product), { status: 201 });

  } catch (err) {
    console.error("POST PRODUCT ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
