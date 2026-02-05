'use client';

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  // Load cart on first mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // ✅ ADDED: Sync cart when page gets focus
  useEffect(() => {
    const syncCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
    };

    window.addEventListener("focus", syncCart);

    return () => {
      window.removeEventListener("focus", syncCart);
    };
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return;
    const updated = cart.map(p =>
      p._id === productId ? { ...p, quantity: qty } : p
    );
    setCart(updated);
  };

  const removeProduct = (productId) => {
    const updated = cart.filter(p => p._id !== productId);
    setCart(updated);
  };

  const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingFee = cart.length > 0 ? 499 : 0;
  const total = subtotal + shippingFee;

  const buyNow = () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    alert(`Order placed! Total: Rs. ${total}`);
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Items added to cart will appear here.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image || "/profile.png"}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p>Price: Rs. {p.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  value={p.quantity}
                  onChange={(e) =>
                    updateQuantity(p._id, Number(e.target.value))
                  }
                  className="w-16 border rounded p-1 text-center"
                />
                <button
                  onClick={() => removeProduct(p._id)}
                  className="text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>

              <div>
                <p className="font-semibold">
                  Rs. {p.price * p.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* SUMMARY */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <p className="text-lg">Subtotal: Rs. {subtotal}</p>
            <p className="text-lg">Shipping Fee: Rs. {shippingFee}</p>
            <p className="text-xl font-bold">Total: Rs. {total}</p>

            <button
              onClick={buyNow}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
