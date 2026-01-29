import connectDB from "@/lib/db";
import Product from "@/models/Product";
import fs from "fs";
import path from "path";

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  const product = await Product.findById(id);
  if (!product) {
    return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req) {
  await connectDB();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  let data;
  let newImageUrl = null;

  // Check if request is FormData (file upload)
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const image = formData.get("image"); // may be null

    if (image && image.size > 0) {
      // Save new image
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      newImageUrl = `/uploads/${fileName}`;
    }

    data = {
      name,
      price: Number(price),
      description,
      ...(newImageUrl && { image: newImageUrl })
    };
  } else {
    // JSON request
    data = await req.json();
  }

  const updated = await Product.findByIdAndUpdate(id, data, { new: true });

  if (!updated) {
    return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(updated), { status: 200 });
}
