import { useState } from "react";
import ActivityCard from "./ActivityCard";
import Button from "../common/Button";

export default function StopCard({
  stop,
  activities = [],
  onAddActivity,
  onDelete,
  onDeleteActivity,
  onEdit,
  isDraggable = false,
}) {
  const [expanded, setExpanded] = useState(true);

  const handleDelete = async () => {
    if (!window.confirm(`Delete stop in ${stop.cityName || "this city"}?`)) return;
    try {
      await onDelete(stop.id);
    } catch (err) {
      console.error("Failed to delete stop:", err);
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = d.toDate ? d.toDate() : new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isDraggable && (
              <span className="text-gray-300 cursor-grab flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-secondary truncate">
                {stop.cityName || "Unknown City"}
              </h3>
              {stop.country && (
                <p className="text-xs text-gray-400">{stop.country}</p>
              )}
            </div>
            {(stop.startDate || stop.endDate) && (
              <div className="text-xs text-gray-500 flex-shrink-0">
                {formatDate(stop.startDate)}
                {stop.endDate && ` - ${formatDate(stop.endDate)}`}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 ml-3 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(stop)}
                className="text-gray-400 hover:text-primary transition-colors p-1.5 cursor-pointer"
                title="Edit stop"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-danger transition-colors p-1.5 cursor-pointer"
                title="Delete stop"
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

        {activities.length > 0 ? (
          <div className="mt-4 space-y-1.5">
            {activities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onDelete={onDeleteActivity ? (id) => onDeleteActivity(stop.id, id) : null}
                compact
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-4">No activities added yet</p>
        )}

        {onAddActivity && (
          <Button
            size="sm"
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => onAddActivity(stop)}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Activity
          </Button>
        )}
      </div>
    </div>
  );
}
