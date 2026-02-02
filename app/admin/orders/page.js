'use client'; // optional if you need client-side code

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="p-6">
      {/* YOUR EXISTING CONTENT – NOT CHANGED */}
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <p>Here you can view and process all orders.</p>

      {/* ADDITIONAL REAL-WORLD ADMIN CONTENT */}
      <div className="mt-6">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="text-center">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">
                  {order.userId?.email || "User"}
                </td>
                <td className="border p-2">
                  Rs. {order.totalPrice}
                </td>
                <td className="border p-2 capitalize">
                  {order.status}
                </td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
