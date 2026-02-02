import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,         // Changed from title -> name
  price: Number,
  description: String,
  category: String,     // Add category field
  image: String,
  stock: {
    type: Number,
    default: 0
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},{ timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
