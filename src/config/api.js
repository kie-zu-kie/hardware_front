// In local development, fallback to local Go API on port 8081.
// In production (e.g. Vercel), set VITE_API_URL to your Render backend URL (e.g. https://your-backend.onrender.com).
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:8081").replace(/\/+$/, "");

export default API_BASE_URL;
