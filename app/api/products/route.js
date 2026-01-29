import connectDB from "@/lib/db";
import Product from "@/models/Product";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// GET all products
export async function GET(req) {
  await connectDB();
  const products = await Product.find();
  return new Response(JSON.stringify(products), { status: 200 });
}

// POST new product
export async function POST(req) {
  await connectDB();

  // Convert the Web Request to a Node stream
  const data = await req.formData(); // Next.js Request API

  const name = data.get("name");
  const price = data.get("price");
  const category = data.get("category");
  const description = data.get("description");
  const image = data.get("image"); // File object

  if (!name || !price || !category || !image) {
    return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
  }

  // Save image manually to public/uploads
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `${Date.now()}-${image.name}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const imageUrl = `/uploads/${fileName}`;

  // Create product in DB
  const newProduct = await Product.create({
    name,
    price: Number(price),
    category,
    description: description || "",
    image: imageUrl,
  });

  return new Response(JSON.stringify(newProduct), { status: 201 });
}
