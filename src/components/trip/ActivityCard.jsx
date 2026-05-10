import { useState } from "react";

const TYPE_EMOJIS = {
  sightseeing: "\uD83D\uDDFA\uFE0F",
  food: "\uD83C\uDF5C",
  adventure: "\uD83E\uDDD7",
  shopping: "\uD83D\uDECD\uFE0F",
};

export default function ActivityCard({ activity, onDelete, onEdit, compact = false }) {
  const [deleting, setDeleting] = useState(false);
  const typeEmoji = TYPE_EMOJIS[activity.type] || "\uD83D\uDCCC";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(activity.id);
    } catch {
      setDeleting(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg/50 hover:bg-bg transition-colors group">
        <span className="text-base flex-shrink-0">{typeEmoji}</span>
        <span className="text-sm text-secondary flex-1 truncate">{activity.name}</span>
        {activity.cost != null && (
          <span className="text-xs text-gray-500 flex-shrink-0">₹{activity.cost}</span>
        )}
        {activity.duration && (
          <span className="text-xs text-gray-400 flex-shrink-0">{activity.duration}h</span>
        )}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(activity)}
              className="text-gray-400 hover:text-primary transition-colors p-0.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-gray-400 hover:text-danger transition-colors p-0.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeEmoji}</span>
          <div>
            <h4 className="font-medium text-secondary">{activity.name}</h4>
            {activity.type && (
              <span className="text-xs text-gray-400 capitalize">{activity.type}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(activity)}
              className="text-gray-400 hover:text-primary transition-colors p-1 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-gray-400 hover:text-danger transition-colors p-1 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {activity.cost != null && <span>₹{activity.cost}</span>}
        {activity.duration && <span>{activity.duration} hrs</span>}
        {activity.time && <span>{activity.time}</span>}
        {activity.rating != null && (
          <span className="text-amber-500">
            {"\u2605".repeat(Math.round(activity.rating))}{"\u2606".repeat(5 - Math.round(activity.rating))}
          </span>
        )}
      </div>
    </div>
  );
}
