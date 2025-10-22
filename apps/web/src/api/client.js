const API_BASE = import.meta.env.VITE_API_BASE;

// 获取预测
export async function getForecast(city, category) {
  const res = await fetch(`${API_BASE}/forecast?city=${city}&category=${category}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}