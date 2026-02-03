'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserLayout({ children }) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "/profile.png"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: "url('/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* SIDEBAR */}
      <aside className="w-64 bg-black/80 text-white p-6 pt-10">

        <h1 className="text-2xl font-bold">User Panel</h1>

        <nav className="space-y-5 mt-10">

          <button onClick={() => router.push("/user")} className="sidebar-btn">
            Dashboard
          </button>
          <button onClick={() => router.push("/user/products")} className="sidebar-btn">
            Products
          </button>
          <button onClick={() => router.push("/user/orders")} className="sidebar-btn">
            Orders
          </button>
          <button onClick={() => router.push("/user/cart")} className="sidebar-btn">
            Cart
          </button>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white p-4 shadow-lg">
          <h2 className="text-xl font-semibold">User Dashboard</h2>

          <div className="relative">
            <img
              src={user.image || "/profile.png"}
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowProfile(!showProfile)}
            />

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                <div className="text-center">
                  <img src={user.image} className="w-16 h-16 mx-auto rounded-full mb-2"/>
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <div className="mt-4">
  <button
    onClick={logout}
    className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
  >
    Logout
  </button>
</div>

              </div>
            )}
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* SIDEBAR BUTTON STYLE */}
      <style jsx>{`
  .sidebar-btn {
    width: 100%;
    padding: 14px;
    background: #1f2937;
    border-radius: 10px;
    text-align: left;
    font-size: 15px;
  }
  .sidebar-btn:hover {
    background: #374151;
  }
`}</style>

    </div>
  );
}
