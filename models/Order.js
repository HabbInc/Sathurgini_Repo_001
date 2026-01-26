import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  products: [],
  totalPrice: Number,
  status: {
    type: String,
    default: "pending"
  }
});

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);
