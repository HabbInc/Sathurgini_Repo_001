'use client';

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ prevents first empty call

    fetch("/api/admin/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.name) setAdminName(data.name);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col p-6 space-y-4">
      {/* Header Section */}
      <div className="bg-black/50 p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg">
          Welcome, <span className="font-semibold">{adminName}</span>! Here you can manage products, orders, and categories.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="flex flex-wrap gap-6 mt-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
          <h2 className="font-bold text-lg">Products</h2>
          <p>Manage all products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
          <h2 className="font-bold text-lg">Orders</h2>
          <p>View and process orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
          <h2 className="font-bold text-lg">Categories</h2>
          <p>Manage product categories</p>
        </div>
      </div>
    </div>
  );
}
