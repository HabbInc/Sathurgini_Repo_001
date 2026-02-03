import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  text: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,

  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  comments: [commentSchema]
}, { timestamps: true });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
