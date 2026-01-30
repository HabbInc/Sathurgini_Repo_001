'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams(); // gets product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setError("Product not found");
          setProduct(null);
          return;
        }
        const data = await res.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?productId=${id}`);
      if (!res.ok) {
        setComments([]);
        return;
      }
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // Add comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token"); // optional if auth required
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          productId: id,
          comment: newComment,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add comment");
      }

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading product...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!product) return <p className="p-6 text-red-500">Product not found!</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Product Info */}
      <div className="flex flex-col md:flex-row gap-6 bg-white shadow-lg rounded-lg p-6">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full md:w-1/3 h-64 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2"> test{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">Rs {product.price}</p>
          <p className="text-gray-600 mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {comments.length === 0 && (
          <p className="text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
        )}

        {comments.map((c) => (
          <div key={c._id} className="border-b border-gray-200 py-2">
            <p className="font-semibold">{c.userName || "Anonymous"}</p>
            <p className="text-gray-700">{c.comment}</p>
          </div>
        ))}

        <form onSubmit={handleCommentSubmit} className="mt-4 flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Submitting..." : "Add Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
