const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "https://findamech-1.onrender.com").replace(/\/$/, "");

console.log("API_BASE_URL =", API_BASE_URL);

export function apiUrl(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log("Request URL:", url);
  return url;
}