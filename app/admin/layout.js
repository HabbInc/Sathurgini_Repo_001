'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const [showProfile, setShowProfile] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    image: "/profile.png"
  });

  const router = useRouter();

  // ✅ FETCH ADMIN FROM DATABASE USING TOKEN
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setAdminData(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-lg">
        <div className="text-2xl font-bold">Admin Panel</div>

        <div className="relative">
          <img
            src={adminData.image || "/profile.png"}
            alt="Admin"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <div className="flex flex-col items-center">
                <img
                  src={adminData.image || "/profile.png"}
                  alt="Admin"
                  className="w-20 h-20 rounded-full mb-2"
                />
                <h2 className="font-bold">{adminData.name}</h2>
                <p className="text-sm text-gray-500">{adminData.email}</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
