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

  // Add product to cart
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const index = cart.findIndex(item => item._id === product._id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        ...product,
        price: Number(product.price),
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-gray-600 mt-1">Browse all products added by admins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-xl flex flex-col"
            >
              <img
                src={p.image || "/profile.png"}
                className="h-40 w-full object-cover rounded cursor-pointer mb-2"
                alt={p.name}
                onClick={() => router.push(`/user/products/${p._id}`)}
              />

              <div className="flex justify-between items-center mt-2">
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-gray-500">Rs. {p.price}</p>
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No products found.</p>
        )}
      </div>
    </div>
  );
}
