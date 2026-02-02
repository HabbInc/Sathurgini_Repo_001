"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Welcome {user?.name} 👋
      </h2>

      <p className="text-gray-600">
        Explore products, manage your cart, and track your orders.
      </p>
    </div>
  );
}
