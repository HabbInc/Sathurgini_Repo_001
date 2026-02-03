'use client';

import { useState, useEffect } from "react";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <input value={name} className="border p-2 w-full mb-3"/>
      <input value={email} className="border p-2 w-full"/>
    </div>
  );
}
