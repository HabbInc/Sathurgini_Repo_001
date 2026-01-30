'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products (admin-specific)
  const fetchProducts = async () => {
    const token = localStorage.getItem("token"); // make sure you saved token after login
    if (!token) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Failed to fetch products:", data.message);
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.status === 200) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  // ✅ Handle immediate refresh after adding a product
  const handleAddProductClick = () => {
    router.push("/admin/products/add");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <p>Here you can view, add, edit, and delete products.</p>

      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col items-center cursor-pointer"
              onClick={() => router.push(`/admin/products/${p._id}`)} // ✅ card click opens product page
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
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    router.push(`/admin/products/edit/${p._id}`);
                  }}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    handleDelete(p._id);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PRODUCT BUTTON */}
      <button
        type="button"
        onClick={handleAddProductClick}
        className="fixed bottom-6 right-6 text-3xl bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
