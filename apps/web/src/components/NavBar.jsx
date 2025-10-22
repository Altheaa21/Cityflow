import { useEffect, useState } from "react";
import { getManifest } from "../api/manifest";

export default function NavBar({
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
}) {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);

  // get manifest when start
  useEffect(() => {
    async function loadManifest() {
      try {
        const data = await getManifest();
        setManifest(data);
      } catch (err) {
        console.error("❌ cannot load manifest:", err);
      } finally {
        setLoading(false);
      }
    }
    loadManifest();
  }, []);

  if (loading) {
    return (
      <nav
        style={{
          background: "#1E293B",
          color: "white",
          padding: "12px 24px",
          fontWeight: "500",
        }}
      >
        CityFlow Portal · Loading...
      </nav>
    );
  }

  return (
    <nav
      style={{
        background: "#1E293B",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        fontWeight: "500",
      }}
    >
      {/* left label */}
      <div style={{ fontSize: "18px" }}>CityFlow Portal</div>

      {/* right select */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* city select */}
        <div>
          <label style={{ marginRight: "6px" }}>City:</label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedCategory(""); // clean category when select city
            }}
            style={{ padding: "4px 8px" }}
          >
            <option value="">Select City</option>
            {manifest.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* category */}
        <div>
          <label style={{ marginRight: "6px" }}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedCity}
            style={{ padding: "4px 8px" }}
          >
            <option value="">Select Category</option>
            {selectedCity &&
              manifest.cities
                .find((c) => c.id === selectedCity)
                .categories.filter((cat) => cat.ready)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
          </select>
        </div>
      </div>
    </nav>
  );
}