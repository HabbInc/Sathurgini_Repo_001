"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="p-6">
      {/* Back Navigation */}
      <Link href="/admin/dashboard" className="text-blue-600">
        ← Back to Admin Dashboard
      </Link>

      <h1 className="text-2xl font-bold my-4">
        User Management
      </h1>

      <p className="mb-4">
        View all registered users and administrators in the system.
      </p>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Joined Date</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">
                {user.name || "N/A"}
              </td>
              <td className="border p-2">
                {user.email}
              </td>
              <td className="border p-2 capitalize">
                {user.role === "admin" ? "Admin" : "User"}
              </td>
              <td className="border p-2">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </td>

            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
