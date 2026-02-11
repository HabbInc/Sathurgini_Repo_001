'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // Load cart initially + listen for updates
  useEffect(() => {
    const syncCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
    };

    syncCart();
    window.addEventListener("cartUpdated", syncCart);

    return () => {
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return;

    const updated = cart.map(p =>
      p._id === productId ? { ...p, quantity: qty } : p
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeProduct = (productId) => {
    const updated = cart.filter(p => p._id !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingFee = cart.length > 0 ? 499 : 0;
  const total = subtotal + shippingFee;

  // ✅ ONLY FIX: redirect to checkout
  const buyNow = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/user/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Items added to cart will appear here.</p>
      ) : (
        <>
          {cart.map((p) => (
            <div key={p._id} className="flex justify-between border-b py-4">
              <div className="flex gap-4">
                <img
                  src={p.image || "/profile.png"}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p>Rs. {p.price}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min={1}
                  value={p.quantity}
                  onChange={(e) =>
                    updateQuantity(p._id, Number(e.target.value))
                  }
                  className="w-16 border p-1 text-center"
                />
                <button
                  onClick={() => removeProduct(p._id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>

              <div className="font-semibold">
                Rs. {p.price * p.quantity}
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-2">
            <p>Subtotal: Rs. {subtotal}</p>
            <p>Shipping Fee: Rs. {shippingFee}</p>
            <p className="font-bold text-lg">Total: Rs. {total}</p>

            <button
              onClick={buyNow}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
