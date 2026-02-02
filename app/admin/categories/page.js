"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">Categories</h1>
      <p className="mb-4">View all product categories in the system.</p>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Created Date</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="text-center">
              <td className="border p-2">{cat.name}</td>
              <td className="border p-2">{cat.description || "N/A"}</td>
              <td className="border p-2">
                {cat.createdAt
                  ? new Date(cat.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

