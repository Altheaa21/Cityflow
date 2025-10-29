// api/client.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getForecast(city, category, modelType, query) {
  const qs = new URLSearchParams({
    city,
    category,
    model_type: modelType,
    query, // encode in fetch
  });

  const url = `${API_URL}/forecast?${qs.toString()}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Forecast HTTP ${res.status}: ${text}`);
  }
  return res.json();
}