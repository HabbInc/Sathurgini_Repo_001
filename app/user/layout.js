"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout");
    router.push("/");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: "url('/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-black/70 text-white p-6">
        <h2 className="text-xl font-bold mb-6">User Panel</h2>

        <nav className="space-y-4">
          <Link href="/user/dashboard">Dashboard</Link>
          <Link href="/user/products">Products</Link>
          <Link href="/user/cart">Cart</Link>
          <Link href="/user/orders">My Orders</Link>
          <Link href="/user/profile">Profile</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-white/90">
        {/* Topbar */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="font-semibold">User Dashboard</h1>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              {user?.name || "Profile"}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white shadow rounded w-48 p-3">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>

                <button
                  onClick={logout}
                  className="mt-3 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
