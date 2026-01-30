import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, default: 5 },
    userName: { type: String, default: "Anonymous" },
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
