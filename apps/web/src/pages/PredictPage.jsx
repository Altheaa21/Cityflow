import { useState } from "react";
import MessageList from "../components/MessageList";
import PredictBox from "../components/PredictBox";
import { getForecast } from "../api/client";

export default function PredictPage({ selectedCity, selectedCategory }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (inputText, modelType) => {
    if (!selectedCity) return;

    // user message
    setMessages((prev) => [...prev, { role: "user", text: inputText }]);

    // A placeholder is still sent even when no category is selected (the backend baseline will ignore this).
    const category = selectedCategory || "citywide";

    // Key: Package user input into training templates
    const formattedQuery = `predict next day: ${inputText}`;

    setLoading(true);
    try {
      // send modelType and formattedQuery together to the backend
      const res = await getForecast(selectedCity, category, modelType, formattedQuery);

      // Display the actual model name returned by the backend to avoid inconsistency with the UI selection
      const reply = `Model: ${res.model}\nPredict: ${res.prediction}\nInterval: ${res.interval[0]} - ${res.interval[1]}\nSuggestion: ${res.advice}`;
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "The request failed, please try again later." },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col px-4 text-lg sm:text-xl">
      <div className="mb-3 mt-4 text-sm text-slate-600">
        Currently:{" "}
        <span className="rounded bg-slate-200 px-2 py-0.5">
          {selectedCity || "No city selected"}
        </span>{" "}
        /
        <span className="ml-1 rounded bg-slate-200 px-2 py-0.5">
          {selectedCategory || "City level(baseline)"}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-lg bg-white p-4">
        <MessageList messages={messages} loading={loading} />
      </div>

      <div className="sticky bottom-0 mt-3">
        <PredictBox
          disabled={!selectedCity}
          categoryChosen={!!selectedCategory}
          onSend={handleSend}
        />
        {!selectedCity && (
          <p className="mt-2 text-center text-sm text-slate-500">
            Please select a city to start forecasting
          </p>
        )}
      </div>
    </div>
  );
}