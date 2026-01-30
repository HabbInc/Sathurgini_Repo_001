// utils/auth.js
export function getToken() {
  const token = localStorage.getItem("token"); // ✅ use the key you saved at login
  if (!token) throw new Error("No token found. Please login.");
  return token;
}
