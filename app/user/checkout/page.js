'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cash",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    if (form.payment === "card") {
      if (!form.cardNumber || !form.cardName || !form.expiry || !form.cvv) {
        alert("Please fill card details");
        return;
      }
    }

    // 🚀 In real-world: send to backend here
    localStorage.removeItem("cart");
    alert("Order placed successfully!");
    router.push("/user/orders");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/back.jpg')" }}
    >
      <div className="bg-white/95 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

        {/* USER INFO */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        {/* PAYMENT METHOD */}
        <div className="mb-4">
          <label className="font-semibold">Payment Method</label>

          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={form.payment === "cash"}
                onChange={handleChange}
              />{" "}
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={form.payment === "card"}
                onChange={handleChange}
              />{" "}
              Card
            </label>
          </div>
        </div>

        {/* CARD DETAILS */}
        {form.payment === "card" && (
          <div className="space-y-3 mb-4">
            <input
              name="cardNumber"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              name="cardName"
              placeholder="Card Holder Name"
              value={form.cardName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <div className="flex gap-3">
              <input
                name="expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              />

              <input
                name="cvv"
                placeholder="CVV"
                value={form.cvv}
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>
        )}

        <button
          onClick={placeOrder}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
