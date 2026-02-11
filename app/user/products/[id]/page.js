'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Load product details
  const load = async () => {
    if (!id) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/user/products/${id}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    const data = await res.json();
    setProduct(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  // Add product to cart
  const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const index = cart.findIndex(item => item._id === product._id);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({
      ...product,
      price: Number(product.price),
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ IMPORTANT: notify cart page
  window.dispatchEvent(new Event("cartUpdated"));

  alert("Added to cart");
};



  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      {/* PRODUCT IMAGE */}
      <img
        src={product.image || "/profile.png"}
        className="w-full h-64 object-cover rounded"
        alt={product.name}
      />

      {/* PRODUCT DETAILS */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700 mt-1">{product.description}</p>
          <p className="font-semibold mt-2">Price: Rs. {product.price}</p>
          <p>Category: {product.category}</p>
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={() => addToCart(product)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-start"
        >
          Add to Cart
        </button>
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

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Get logged-in user ID from JWT token
  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // Reload product and comments
  const reload = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/user/products/${product._id}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    const data = await res.json();
    setProduct(data);
  };

  // Submit new comment
  const submit = async () => {
    if (!token) return alert("Please login");
    if (!text.trim()) return alert("Comment cannot be empty");

    const res = await fetch(`/api/user/products/${product._id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text, rating }),
    });

    if (!res.ok) return alert("Failed to submit comment");

    setText("");
    setRating(5);
    reload();
  };

  // Delete comment
  const del = async (commentId) => {
    if (!token) return alert("Please login");

    const res = await fetch(
      `/api/user/products/${product._id}/comment/delete/${commentId}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return alert("Failed to delete comment");
    reload();
  };

  // Edit comment
  const update = async (commentId) => {
    if (!token) return alert("Please login");

    const res = await fetch(
      `/api/user/products/${product._id}/comment/edit/${commentId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: editText, rating: editRating }),
      }
    );

    if (!res.ok) return alert("Failed to update comment");
    setEditingId(null);
    reload();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">Reviews</h2>

      {/* ADD COMMENT */}
      <div className="border p-4 rounded mb-4">
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(n => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={`cursor-pointer text-2xl ${n <= rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="border w-full p-2"
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
          <div key={c._id} className="border-b py-3">
            {editingId === c._id ? (
              <>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <span
                      key={n}
                      onClick={() => setEditRating(n)}
                      className={`cursor-pointer text-xl ${n <= editRating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <textarea
                  className="border w-full p-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <button
                  onClick={() => update(c._id)}
                  className="bg-green-600 text-white px-3 py-1 mt-1 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="ml-2 text-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{c.userName} ⭐ {c.rating}</p>
                  <p>{c.text}</p>
                </div>

                {/* Only show edit/delete if this user owns the comment */}
                {c.userId === currentUserId && (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditText(c.text);
                        setEditRating(c.rating);
                      }}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => del(c._id)}
                      className="text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet</p>
      )}
    </div>
  );
}
