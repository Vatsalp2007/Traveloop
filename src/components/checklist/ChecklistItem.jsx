import { useState } from "react";

const CATEGORY_COLORS = {
  Documents: "bg-blue-100 text-blue-700",
  Clothing: "bg-green-100 text-green-700",
  Electronics: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function ChecklistItem({ item, onToggle, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(item.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        item.isPacked
          ? "bg-success/5 border border-success/20"
          : "bg-bg/50 border border-transparent hover:border-gray-200"
      }`}
    >
      <button
        onClick={() => onToggle(item.id, !item.isPacked)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
          item.isPacked
            ? "bg-success border-success"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        {item.isPacked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm transition-all ${
            item.isPacked
              ? "line-through text-gray-400"
              : "text-secondary"
          }`}
        >
          {item.label}
        </span>
      </div>
      {item.category && (
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
            CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other
          }`}
        >
          {item.category}
        </span>
      )}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex-shrink-0 text-gray-400 hover:text-danger transition-colors p-1 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
