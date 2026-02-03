'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-gray-600 mt-1">Browse all products added by admins</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              onClick={() => router.push(`/user/products/${p._id}`)}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-xl"
            >
              <img
                src={p.image || "/profile.png"}
                className="h-40 w-full object-cover rounded"
                alt={p.name}
              />
              <h3 className="font-bold mt-2">{p.name}</h3>
              <p className="text-gray-500">Rs. {p.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No products found.</p>
        )}
      </div>
    </div>
  );
}
