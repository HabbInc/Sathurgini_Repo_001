"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Details</h2>

      <p><b>User:</b> {order.userId.email}</p>
      <p><b>Total:</b> Rs. {order.totalPrice}</p>
      <p><b>Status:</b> {order.status}</p>

      <h3>Products</h3>
      <ul>
        {order.products.map((p, i) => (
          <li key={i}>
            {p.name} – Rs.{p.price} × {p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
