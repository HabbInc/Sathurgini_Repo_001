'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">Rs {product.price}</p>
          <p className="text-gray-600 mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>
        </div>
      </div>

      {/* COMMENTS SECTION (READ-ONLY FOR ADMIN) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>

        {(!product.comments || product.comments.length === 0) && (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {product.comments?.map((c) => (
          <div key={c._id} className="border-b border-gray-200 py-3">
            <p className="font-semibold">
              {c.userName || "Anonymous"} ⭐ {c.rating}
            </p>
            <p className="text-gray-700">{c.text}</p>
            <p className="text-sm text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
