'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null // for new upload
  });

  const [preview, setPreview] = useState(""); // preview existing or new image
  const [loading, setLoading] = useState(false);

  // Fetch product details on load
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name,
          price: data.price,
          description: data.description,
          image: null // leave empty for new upload
        });
        setPreview(data.image); // show existing image
      });
  }, [id]);

  // Handle new image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let body;

      if (form.image) {
        // If new image uploaded, use FormData
        body = new FormData();
        body.append("name", form.name);
        body.append("price", form.price);
        body.append("description", form.description);
        body.append("image", form.image);

        await fetch(`/api/products/${id}`, {
          method: "PUT",
          body // FormData automatically sets correct headers
        });
      } else {
        // No image change, send JSON
        body = {
          name: form.name,
          price: form.price,
          description: form.description
        };

        await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      }

      alert("Product updated successfully!");
      router.push("/admin/products/list");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex justify-center p-8">
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>

      <form className="space-y-4" onSubmit={handleUpdate}>
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block font-medium mb-1">Price (Rs)</label>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Product Image */}
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg mx-auto border"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  </div>
   
);
}
