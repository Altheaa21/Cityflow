import { useState } from "react";
import NavBar from "./components/NavBar";
import PredictPage from "./pages/PredictPage";

export default function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <PredictPage
        selectedCity={selectedCity}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
