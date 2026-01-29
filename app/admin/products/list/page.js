'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      {/* EXISTING UI */}
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <p>Here you can view, add, edit, and delete products.</p>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No products available.</p>
        )}

        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded-lg shadow flex flex-col items-center"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-32 h-32 object-cover rounded mb-4"
            />
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-gray-700 mb-4">Rs {p.price}</p>

            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/admin/products/edit/${p._id}`)}
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PRODUCT BUTTON */}
      <button
  type="button"
  onClick={() => router.push("/admin/products/add")}
  className="fixed bottom-6 right-6 text-3xl bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
>
  +
</button>

    </div>
  );
}
