import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ADD structure (important for admin view)
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    // Improve status (real-world)
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending"
    }
  },
  { timestamps: true } // ADD THIS
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);
