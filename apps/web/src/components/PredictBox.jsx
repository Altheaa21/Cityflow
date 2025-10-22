// PredictBox.jsx
import { useState } from "react";

export default function PredictBox({ disabled, categoryChosen, onSend }) {
  const [text, setText] = useState("");
  const [modelType, setModelType] = useState("baseline");

  const canSend = !disabled && text.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(text.trim(), modelType);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-transparent p-0">
      {/* input capsule */}
      <div
        className={`predict-capsule flex items-stretch rounded-full overflow-hidden border border-slate-300 bg-white shadow-sm ${
          disabled ? "opacity-70" : ""
        }`}
        style={{ height: "40px" }}
      >
        {/* model choice */}
        <select
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          disabled={disabled || !categoryChosen}
          className={`h-full w-32 bg-white px-2 text-sm transition-colors
            border-0 focus:border-0 ring-0 focus:ring-0 outline-none focus:outline-none focus:shadow-none
            ${disabled || !categoryChosen ? "bg-slate-100 text-slate-400" : "hover:bg-slate-50"}`}
          title={
            disabled
              ? "Please select a city"
              : !categoryChosen
              ? "When no category is selected, only Baseline is supported"
              : "Select Baseline model or Finetune model"
          }
          style={{ border: "none", boxShadow: "none" }}
        >
          <option value="baseline">Baseline</option>
          <option value="finetune" disabled={!categoryChosen}>
            Finetune
          </option>
        </select>

        {/* input */}
        <input
          type="text"
          placeholder={
            disabled
              ? "Please select a city before ask"
              : "Ask questions: Input the sales figures for the past few days and ask how much it will be tomorrow"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className={`flex-1 h-full bg-white px-3 text-[15px] transition-colors
            border-0 focus:border-0 ring-0 focus:ring-0 outline-none focus:outline-none focus:shadow-none
            ${disabled ? "bg-slate-100 text-slate-400" : "focus:bg-slate-50"}`}
          style={{ border: "none", boxShadow: "none" }}
        />

        {/* Send button - round light black with white upward arrow (remains unchanged) */}
        <button
          type="submit"
          disabled={!canSend}
          aria-label="send"
          className={`my-[3px] mr-1 aspect-square h-[30px] rounded-full text-white transition-colors flex items-center justify-center ${
            canSend ? "bg-black/80 hover:bg-black" : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M12 5l-5 5" />
            <path d="M12 5l5 5" />
          </svg>
        </button>
      </div>

      {/* Fallback styles in scope (avoid @tailwindcss/forms or browser UA overrides) */}
      <style>{`
        .predict-capsule select,
        .predict-capsule input {
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          background-clip: padding-box;
        }
        .predict-capsule select:focus,
        .predict-capsule input:focus {
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </form>
  );
}