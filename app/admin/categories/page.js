"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link href="/admin/dashboard" className="text-blue-600">
        ← Back to Admin Dashboard
      </Link>

      <h1 className="text-2xl font-bold my-4">
        Categories (Reference View)
      </h1>

      <p className="mb-6">
        This page shows products grouped by category.
        Products are managed from Product Management.
      </p>

      {Object.keys(categories).length === 0 && (
        <p>No categories or products found.</p>
      )}

      {Object.entries(categories).map(([categoryName, products]) => (
        <div key={categoryName} className="mb-10">
          {/* Category Title */}
          <h2 className="text-xl font-semibold mb-3">
            {categoryName}
          </h2>

          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Added By</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="text-center">
                  <td className="border p-2">{p.name}</td>

                  <td className="border p-2">
                    {p.description || "N/A"}
                  </td>

                  <td className="border p-2">
                    {p.price ? `Rs. ${p.price}` : "N/A"}
                  </td>

                  <td className="border p-2">
                    {p.adminId?.name || "Admin"}
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    No products in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
