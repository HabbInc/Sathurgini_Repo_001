'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetails() {
  const { id } = useParams(); // get product ID from route
  const [product, setProduct] = useState(null);

  // Load product details from backend
  const load = async () => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user/products/${id}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Failed to load product:", err);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">

      {/* PRODUCT IMAGE */}
      <img
        src={product.image || "/profile.png"}
        className="w-full h-64 object-cover rounded"
        alt={product.name}
      />

      {/* PRODUCT DETAILS */}
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-700 mt-2">{product.description}</p>

      <div className="mt-3 space-y-1">
        <p className="font-semibold">Price: Rs. {product.price}</p>
        <p>Category: {product.category}</p>
        <p className="text-sm text-gray-600">
          Added by: {product.adminName || "Admin"}
        </p>
      </div>

      {/* COMMENTS COMPONENT */}
      <Comments product={product} setProduct={setProduct} />
    </div>
  );
}

/* ======================================================
   COMMENTS COMPONENT
   ====================================================== */
function Comments({ product, setProduct }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  // Reload product data to refresh comments
  const reload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user/products/${product._id}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Failed to reload comments:", err);
    }
  };

  // Submit new comment
  const submit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add a comment");
      return;
    }

    if (!text.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch(`/api/user/products/${product._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, rating }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("COMMENT ERROR:", err);
        alert("Failed to submit comment");
        return;
      }

      setText("");
      setRating(5);
      reload();
    } catch (err) {
      console.error("COMMENT SUBMIT ERROR:", err);
      alert("Failed to submit comment");
    }
  };

  // Delete comment (all comments by current user)
  const del = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login");
      return;
    }

    try {
      const res = await fetch(`/api/user/products/${product._id}/comment/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("DELETE COMMENT ERROR:", err);
        alert("Failed to delete comment");
        return;
      }

      reload();
    } catch (err) {
      console.error("DELETE COMMENT ERROR:", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">Reviews</h2>

      {/* ADD COMMENT */}
      <div className="border p-4 rounded mb-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 mb-2"
        >
          {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </select>

        <textarea
          className="border w-full p-2 mt-2"
          placeholder="Write your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
        >
          Submit
        </button>
      </div>

      {/* COMMENTS LIST */}
      {product.comments?.length > 0 ? (
        product.comments.map((c) => (
          <div key={c._id} className="border-b py-3 flex justify-between">
            <div>
              <p className="font-semibold">{c.userName} ⭐ {c.rating}</p>
              <p>{c.text}</p>
            </div>
            <button
              onClick={del}
              className="text-red-500 font-semibold"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet</p>
      )}
    </div>
  );
}
