"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-center sticky top-0 z-50">
        <h1 className="text-4xl font-bold text-blue-600">MarketHub</h1>
      </header>

      {/* Hero Section */}
      <div className="relative w-[90%] max-w-4xl h-[500px] flex items-center justify-center mt-8">
        {/* Background Image */}
        <Image
          src="/hero.jpg" // Place your image in public folder
          alt="Marketplace Hero"
          fill
          className="object-cover rounded-lg shadow-md"
        />

        {/* Overlay with quote and buttons */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-xl mb-6">“Discover the best products from trusted vendors!”</p>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition"
            >
              Register
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-md font-semibold transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* See Products Section */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Check Our Products</h2>
        <button
          onClick={() => router.push("/user/products/list")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition"
        >
          See Products
        </button>
      </div>
    </div>
  );
}
