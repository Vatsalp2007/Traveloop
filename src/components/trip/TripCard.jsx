import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_GRADIENTS = [
  "from-primary to-orange-400",
  "from-secondary to-blue-800",
  "from-green-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-red-500",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatDate(d) {
  if (!d) return "";
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TripCard({ trip, onDelete, onView, onEdit, onShare }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const gradientIdx = hashString(trip.id || trip.name || "") % PLACEHOLDER_GRADIENTS.length;
  const gradient = PLACEHOLDER_GRADIENTS[gradientIdx];

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleView = () => {
    setMenuOpen(false);
    if (onView) onView(trip);
    else navigate(`/trips/${trip.id}`);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    if (onEdit) onEdit(trip);
    else navigate(`/trips/${trip.id}/edit`);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (onDelete) onDelete(trip.id);
  };

  const handleShare = () => {
    setMenuOpen(false);
    if (onShare) onShare(trip);
  };

  return (
    <div
      className="bg-card rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
      onClick={handleView}
    >
      <div className={`h-36 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        {trip.budget && (
          <span className="absolute top-3 right-3 bg-card/90 text-secondary text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            ₹{trip.budget}
          </span>
        )}
        {trip.citiesCount != null && (
          <span className="absolute top-3 left-3 bg-card/90 text-secondary text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            {trip.citiesCount} {trip.citiesCount === 1 ? "city" : "cities"}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-secondary truncate flex-1">{trip.name}</h3>
          <div className="relative ml-2 flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="text-gray-400 hover:text-secondary transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-card rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); handleView(); }}
                  className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-bg transition-colors cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                  className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-bg transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-bg transition-colors cursor-pointer"
                >
                  Share
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {(trip.startDate || trip.endDate) && (
          <p className="text-xs text-gray-400">
            {formatDate(trip.startDate)}
            {trip.endDate && ` - ${formatDate(trip.endDate)}`}
          </p>
        )}
        {trip.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{trip.description}</p>
        )}
      </div>
    </div>
  );
}
