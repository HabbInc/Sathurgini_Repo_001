import connectDB from "./lib/db.js";

async function test() {
  try {
    await connectDB();
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

test();
