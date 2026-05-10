import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { subscribeToCollection, getDocument, createDocument, updateDocument, deleteDocument, getCollection } from "../firebase/firestore";
import NoteCard from "../components/notes/NoteCard";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";

function fmtDate(d) {
  if (!d) return "";
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function fmtDay(d) {
  if (!d) return "Unknown";
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function NotesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [content, setContent] = useState("");
  const [selectedStopId, setSelectedStopId] = useState("");

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStop, setFilterStop] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const t = await getDocument("trips", tripId);
        setTrip(t);
        const s = await getCollection(`trips/${tripId}/stops`);
        const sorted = s.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setStops(sorted);
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
    };
    loadTrip();
  }, [tripId]);

  useEffect(() => {
    const unsub = subscribeToCollection(
      `trips/${tripId}/notes`,
      [],
      (data) => {
        const sorted = data.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });
        setNotes(sorted);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [tripId]);

  const sortedNotes = [...notes].sort((a, b) => {
    const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
    const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
    if (sortBy === "oldest") return aTime - bTime;
    if (sortBy === "az") return (a.content || "").localeCompare(b.content || "");
    if (sortBy === "za") return (b.content || "").localeCompare(a.content || "");
    return bTime - aTime;
  });

  const searchedNotes = search
    ? sortedNotes.filter((n) => n.content?.toLowerCase().includes(search.toLowerCase()))
    : sortedNotes;

  const filteredNotes = filterStop
    ? searchedNotes.filter((n) => n.stopId === filterStop)
    : searchedNotes;

  const processedNotes = filteredNotes;

  function groupByDay(notesArr) {
    const groups = {};
    notesArr.forEach((n) => {
      const key = n.createdAt ? fmtDay(n.createdAt) : "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  }

  function groupByStop(notesArr) {
    const groups = {};
    notesArr.forEach((n) => {
      const key = n.stopName || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  }

  const handleOpenAdd = () => {
    setEditingNote(null);
    setContent("");
    setSelectedStopId("");
    setModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setContent(note.content || "");
    setSelectedStopId(note.stopId || "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const stopName = selectedStopId
        ? stops.find((s) => s.id === selectedStopId)?.cityName || ""
        : "";
      if (editingNote) {
        await updateDocument(`trips/${tripId}/notes`, editingNote.id, {
          content: content.trim(),
          stopId: selectedStopId || null,
          stopName,
          updatedAt: serverTimestamp(),
        });
      } else {
        await createDocument(`trips/${tripId}/notes`, {
          content: content.trim(),
          stopId: selectedStopId || null,
          stopName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setModalOpen(false);
      setContent("");
      setSelectedStopId("");
      setEditingNote(null);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
    setSaving(false);
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteDocument(`trips/${tripId}/notes`, noteId);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const [saving, setSaving] = useState(false);

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
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary">Trip Notes</h1>
          {trip?.name && <p className="text-sm text-gray-400">{trip.name}</p>}
        </div>
        <Button onClick={handleOpenAdd} size="sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Note
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-secondary"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Group By */}
          <div className="relative">
            <button
              onClick={() => { setFilterOpen(false); setSortOpen(false); setFilterOpen(false); }}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-secondary hover:border-primary/50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Group By
            </button>
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
              className={`px-3 py-2.5 text-sm border rounded-xl bg-white transition-colors cursor-pointer flex items-center gap-1.5 ${filterStop ? "border-primary text-primary" : "border-gray-200 text-secondary hover:border-primary/50"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {filterStop ? stops.find((s) => s.id === filterStop)?.cityName || "Filter" : "Filter"}
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 max-h-60 overflow-y-auto">
                  <button onClick={() => { setFilterStop(""); setFilterOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${!filterStop ? "text-primary font-medium" : "text-secondary hover:bg-gray-50"}`}>All Stops</button>
                  {stops.map((s) => (
                    <button key={s.id} onClick={() => { setFilterStop(s.id); setFilterOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${filterStop === s.id ? "text-primary font-medium" : "text-secondary hover:bg-gray-50"}`}>{s.cityName}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort By */}
          <div className="relative">
            <button
              onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
              className={`px-3 py-2.5 text-sm border rounded-xl bg-white transition-colors cursor-pointer flex items-center gap-1.5 ${sortBy !== "newest" ? "border-primary text-primary" : "border-gray-200 text-secondary hover:border-primary/50"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h6M3 12h6m-6 5h6m4-10l4-4 4 4m-4 14V3" />
              </svg>
              {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "az" ? "A-Z" : "Z-A"}
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "az", label: "A-Z" },
                    { value: "za", label: "Z-A" },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${sortBy === opt.value ? "text-primary font-medium" : "text-secondary hover:bg-gray-50"}`}>{opt.label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {[
          { value: "all", label: "All", count: processedNotes.length },
          { value: "day", label: "By Day" },
          { value: "stop", label: "By Stop" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setViewMode(tab.value)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${viewMode === tab.value ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-secondary"}`}
          >
            {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ""}
          </button>
        ))}
      </div>

      {processedNotes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📓</p>
          <p className="text-gray-400 text-lg">No notes yet</p>
          <p className="text-gray-400 text-sm mt-1">Start journaling your trip!</p>
        </div>
      ) : viewMode === "all" ? (
        <div className="space-y-4">
          {processedNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleOpenEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : viewMode === "day" ? (
        <div className="space-y-6">
          {Object.entries(groupByDay(processedNotes)).map(([day, dayNotes]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 sticky top-0 bg-bg py-2">{day}</h3>
              <div className="space-y-4">
                {dayNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onEdit={handleOpenEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupByStop(processedNotes)).map(([stopName, stopNotes]) => (
            <div key={stopName}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 sticky top-0 bg-bg py-2 flex items-center gap-2">
                <span>📍</span> {stopName}
              </h3>
              <div className="space-y-4">
                {stopNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onEdit={handleOpenEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingNote ? "Edit Note" : "New Note"}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary block mb-1.5">
              Note Content <span className="text-danger">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-card text-secondary resize-vertical"
            />
          </div>
          {stops.length > 0 && (
            <div>
              <label className="text-sm font-medium text-secondary block mb-1.5">
                Link to Stop (optional)
              </label>
              <select
                value={selectedStopId}
                onChange={(e) => setSelectedStopId(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-card text-secondary"
              >
                <option value="">None</option>
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.cityName || "Unknown"} {s.country ? `(${s.country})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!content.trim()}>
              {editingNote ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
