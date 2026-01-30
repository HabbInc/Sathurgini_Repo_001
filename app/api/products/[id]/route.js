import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

/* ======================
   GET — product by ID
====================== */
export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const product = await Product.findById(id);

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(product), { status: 200 });

  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}

/* ======================
   PUT — update product
====================== */
export async function PUT(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    // 🔐 token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ message: "Unauthorized - token missing" }),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return new Response(
        JSON.stringify({ message: "Invalid token" }),
        { status: 401 }
      );
    }

    const adminId = decoded.id;

    const product = await Product.findById(id);

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // ✅ FIXED FIELD
    if (!product.adminId) {
      return new Response(
        JSON.stringify({ message: "Product owner not found" }),
        { status: 403 }
      );
    }

    // ✅ ownership check
    if (product.adminId.toString() !== adminId) {
      return new Response(
        JSON.stringify({
          message: "Forbidden: You cannot edit this product",
        }),
        { status: 403 }
      );
    }

    let data;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const name = formData.get("name");
      const price = formData.get("price");
      const category = formData.get("category");
      const description = formData.get("description");
      const image = formData.get("image");

      let newImageUrl = product.image;

      if (image && image.size > 0) {
        const uploadsDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}-${image.name}`;
        fs.writeFileSync(path.join(uploadsDir, fileName), buffer);

        newImageUrl = `/uploads/${fileName}`;
      }

      data = {
        name: name || product.name,
        price: price ? Number(price) : product.price,
        category: category || product.category,
        description: description || product.description,
        image: newImageUrl,
      };
    } else {
      data = await req.json();

      data.name = data.name || product.name;
      data.price = data.price || product.price;
      data.category = data.category || product.category;
      data.description = data.description || product.description;
      data.image = data.image || product.image;
    }

    product.name = data.name;
    product.price = data.price;
    product.category = data.category;
    product.description = data.description;
    product.image = data.image;

    await product.save();

    return new Response(JSON.stringify(product), { status: 200 });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}

/* ======================
   DELETE — delete product
====================== */
export async function DELETE(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return new Response(
        JSON.stringify({ message: "Invalid token" }),
        { status: 401 }
      );
    }

    const adminId = decoded.id;

    const product = await Product.findById(id);

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // ✅ FIXED FIELD
    if (!product.adminId) {
      return new Response(
        JSON.stringify({ message: "Product owner not found" }),
        { status: 403 }
      );
    }

    // ✅ ownership check
    if (product.adminId.toString() !== adminId) {
      return new Response(
        JSON.stringify({
          message: "Forbidden: You cannot delete this product",
        }),
        { status: 403 }
      );
    }

    await product.deleteOne();

    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200 }
    );

  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
