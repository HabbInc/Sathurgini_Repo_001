import jwt from "jsonwebtoken";

// verifyToken expects a token string
export const verifyToken = (token) => {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
