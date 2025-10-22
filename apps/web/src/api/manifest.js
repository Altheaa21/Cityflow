const API_BASE = import.meta.env.VITE_API_BASE;

// 获取 manifest.json
export async function getManifest() {
  const res = await fetch(`${API_BASE}/v1/manifest`);
  if (!res.ok) throw new Error("Failed to load manifest");
  return res.json();
}