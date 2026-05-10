import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { subscribeToCollection, getDocument, createDocument, updateDocument, deleteDocument } from "../firebase/firestore";
import ChecklistItem from "../components/checklist/ChecklistItem";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const CATEGORIES = ["All", "Documents", "Clothing", "Electronics", "Other"];

const SUGGESTED_ITEMS = [
  { label: "Passport", category: "Documents" },
  { label: "Visa Documents", category: "Documents" },
  { label: "Travel Insurance", category: "Documents" },
  { label: "Driver's License", category: "Documents" },
  { label: "Flight Tickets", category: "Documents" },
  { label: "Hotel Reservations", category: "Documents" },
  { label: "T-Shirts", category: "Clothing" },
  { label: "Pants / Shorts", category: "Clothing" },
  { label: "Jacket", category: "Clothing" },
  { label: "Swimwear", category: "Clothing" },
  { label: "Underwear & Socks", category: "Clothing" },
  { label: "Comfortable Shoes", category: "Clothing" },
  { label: "Phone Charger", category: "Electronics" },
  { label: "Power Bank", category: "Electronics" },
  { label: "Camera", category: "Electronics" },
  { label: "Laptop / Tablet", category: "Electronics" },
  { label: "Headphones", category: "Electronics" },
  { label: "Adapter / Converter", category: "Electronics" },
  { label: "Sunglasses", category: "Other" },
  { label: "Umbrella", category: "Other" },
  { label: "First Aid Kit", category: "Other" },
  { label: "Snacks", category: "Other" },
  { label: "Reusable Water Bottle", category: "Other" },
  { label: "Travel Pillow", category: "Other" },
];

export default function ChecklistPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const t = await getDocument("trips", tripId);
        setTrip(t);
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
    };
    loadTrip();
  }, [tripId]);

  useEffect(() => {
    const unsub = subscribeToCollection(
      `trips/${tripId}/checklist`,
      [],
      (data) => {
        setItems(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [tripId]);

  const filtered = activeCategory === "All"
    ? items
    : items.filter((i) => i.category === activeCategory);

  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const progress = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100);

  const handleToggle = async (itemId, isPacked) => {
    try {
      await updateDocument(`trips/${tripId}/checklist`, itemId, { isPacked });
    } catch (err) {
      console.error("Failed to toggle item:", err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDocument(`trips/${tripId}/checklist`, itemId);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleAdd = async () => {
    const label = newLabel.trim();
    if (!label) return;
    try {
      await createDocument(`trips/${tripId}/checklist`, {
        label,
        category: newCategory,
        isPacked: false,
        createdAt: serverTimestamp(),
      });
      setNewLabel("");
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleAddSuggested = async (suggestion) => {
    const exists = items.some(
      (i) => i.label.toLowerCase() === suggestion.label.toLowerCase()
    );
    if (exists) return;
    try {
      await createDocument(`trips/${tripId}/checklist`, {
        label: suggestion.label,
        category: suggestion.category,
        isPacked: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add suggested item:", err);
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm("Uncheck all packed items?")) return;
    try {
      const updates = items
        .filter((i) => i.isPacked)
        .map((i) => updateDocument(`trips/${tripId}/checklist`, i.id, { isPacked: false }));
      await Promise.all(updates);
    } catch (err) {
      console.error("Failed to reset items:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/trips/${tripId}`)}
          className="text-gray-400 hover:text-secondary transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary">Packing Checklist</h1>
          {trip?.name && (
            <p className="text-sm text-gray-400">{trip.name}</p>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary">
            {packedCount} of {totalCount} items packed
          </span>
          {totalCount > 0 && (
            <button
              onClick={handleResetAll}
              className="text-xs text-danger hover:underline cursor-pointer"
            >
              Reset All
            </button>
          )}
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-card text-secondary border border-gray-200 hover:border-primary/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-2xl">
            <p className="text-gray-400">No items in this category</p>
            <p className="text-xs text-gray-400 mt-1">Add some items below!</p>
          </div>
        ) : (
          filtered.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-secondary mb-3">Add Item</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Item name..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-card text-secondary"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-card text-secondary"
          >
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button size="sm" onClick={handleAdd} disabled={!newLabel.trim()}>
            Add
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-secondary">Suggested Items</h3>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            {showSuggestions ? "Hide" : "Show"}
          </button>
        </div>
        {showSuggestions && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_ITEMS.map((suggestion) => {
              const exists = items.some(
                (i) => i.label.toLowerCase() === suggestion.label.toLowerCase()
              );
              return (
                <button
                  key={suggestion.label}
                  onClick={() => handleAddSuggested(suggestion)}
                  disabled={exists}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    exists
                      ? "bg-success/10 text-success/50 border-success/20 cursor-not-allowed"
                      : "bg-bg text-secondary border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {exists ? "\u2713 " : "+ "}{suggestion.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
