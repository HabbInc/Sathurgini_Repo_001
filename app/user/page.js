'use client';

import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setName(data.name))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-black/60 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">
          Welcome, {name} 👋
        </h1>
        <p className="mt-2 text-gray-200">
          Browse products, track orders, and manage your cart easily.
        </p>
      </div>
    </div>
  );
}
