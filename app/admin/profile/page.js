'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("/profile.png");

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
      setImage(admin.image || "/profile.png");
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedAdmin = { name, email, image };
    localStorage.setItem("admin", JSON.stringify(updatedAdmin)); // <-- fixed
    alert("Profile updated!");
    router.push("/admin");
  };

  return (
    <div className="flex justify-center items-start mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="flex flex-col items-center mb-4">
          <img src={image} alt="Profile" className="w-24 h-24 rounded-full mb-2"/>
          <input type="file" onChange={handleImageChange} className="text-sm"/>
        </div>
        
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Email"
          />
          <button
            onClick={handleSave}
            className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
