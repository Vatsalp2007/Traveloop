import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import { useStops } from "../hooks/useStops";
import { createDocument, updateDocument, deleteDocument, subscribeToCollection } from "../firebase/firestore";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";

const ACTIVITY_TYPES = [
  { value: "sightseeing", emoji: "🗺️" },
  { value: "food", emoji: "🍜" },
  { value: "adventure", emoji: "🧗" },
  { value: "shopping", emoji: "🛍️" },
];
const typeEmojiMap = Object.fromEntries(ACTIVITY_TYPES.map((t) => [t.value, t.emoji]));

function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtRange(start, end) {
  if (!start) return "";
  if (!end) return fmtDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) return fmtDate(start);
  return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${fmtDate(end)}`;
}

export default function ItineraryViewPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTrip, updateTrip } = useTrip();
  const { getActivitiesForStop, subscribeToStops } = useStops();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const tripData = await getTrip(tripId);
        if (!tripData) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const isOwner = tripData.userId === user?.uid;
        if (!isOwner && !tripData.isPublic) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setTrip(tripData);
      } catch (err) {
        console.error("Load trip error:", err);
        setNotFound(true);
        setLoading(false);
      }
    }
    load();
  }, [tripId, user]);

  useEffect(() => {
    if (!tripId || !trip) return;
    const unsub = subscribeToStops(tripId, async (stopsData) => {
      const sorted = stopsData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setStops(sorted);
      const map = {};
      for (const stop of sorted) {
        try {
          const acts = await getActivitiesForStop(tripId, stop.id);
          map[stop.id] = acts || [];
        } catch {
          map[stop.id] = [];
        }
      }
      setActivitiesMap(map);
      setLoading(false);
    });
    return () => unsub();
  }, [tripId, trip]);

  useEffect(() => {
    if (!tripId) return;
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
      },
      () => {}
    );
    return () => unsub();
  }, [tripId]);

  function getNoteForStop(stopId) {
    return notes.find((n) => n.stopId === stopId);
  }
  function getNotesForStop(stopId) {
    return notes.filter((n) => n.stopId === stopId);
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/trip/${tripId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function totalCost() {
    let sum = 0;
    Object.values(activitiesMap).forEach((acts) => {
      acts.forEach((a) => { sum += Number(a.cost) || 0; });
    });
    return sum;
  }

  function openNote(stop, existingNote) {
    setNoteModal(stop);
    setNoteDraft(existingNote?.content || "");
    setEditingNoteId(existingNote?.id || null);
  }

  async function saveNote() {
    if (!noteModal) return;
    const stopName = stops.find((s) => s.id === noteModal.id)?.cityName || "";
    try {
      if (editingNoteId) {
        await updateDocument(`trips/${tripId}/notes`, editingNoteId, {
          content: noteDraft.trim(),
          stopId: noteModal.id,
          stopName,
          updatedAt: serverTimestamp(),
        });
      } else {
        await createDocument(`trips/${tripId}/notes`, {
          content: noteDraft.trim(),
          stopId: noteModal.id,
          stopName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setNoteModal(null);
      setNoteDraft("");
      setEditingNoteId(null);
    } catch (err) {
      console.error("Save note error:", err);
    }
  }

  async function handleDeleteNote(noteId) {
    if (!window.confirm("Delete this note?")) return;
    setDeletingNoteId(noteId);
    try {
      await deleteDocument(`trips/${tripId}/notes`, noteId);
    } catch (err) {
      console.error("Delete note error:", err);
    }
    setDeletingNoteId(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Trip not found</h1>
          <Button onClick={() => navigate("/trips")}>Back to My Trips</Button>
        </div>
      </div>
    );
  }

  const isOwner = trip.userId === user?.uid;
  const allActivities = Object.values(activitiesMap).flat();

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button onClick={() => navigate("/trips")} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trips
          </button>
          <div className="flex gap-2">
            {isOwner && (
              <Link to={`/trips/${tripId}/edit`}>
                <Button variant="secondary" size="sm">Edit Trip</Button>
              </Link>
            )}
            <Link to={`/trips/${tripId}/checklist`}>
              <Button variant="ghost" size="sm">✅ Checklist</Button>
            </Link>
            <Link to={`/trips/${tripId}/invoice`}>
              <Button variant="ghost" size="sm">🧾 Invoice</Button>
            </Link>
            <Button size="sm" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-secondary">{trip.name}</h1>
          {trip.description && <p className="text-gray-500 mt-1">{trip.description}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
            <span className="font-medium text-secondary">{fmtRange(trip.startDate, trip.endDate)}</span>
            <span>{stops.length} stop{stops.length !== 1 ? "s" : ""}</span>
            <span>{allActivities.length} activit{allActivities.length !== 1 ? "ies" : "y"}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "list" ? "bg-primary text-white" : "bg-white text-secondary hover:bg-gray-100"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "calendar" ? "bg-primary text-white" : "bg-white text-secondary hover:bg-gray-100"
            }`}
          >
            Calendar View
          </button>
        </div>

        {viewMode === "list" && (
          <div className="space-y-4">
            {stops.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No stops in this trip yet.</p>
              </div>
            ) : (
              stops.map((stop, idx) => {
                const acts = activitiesMap[stop.id] || [];
                const stopNotes = getNotesForStop(stop.id);
                const primaryNote = stopNotes[0] || null;
                return (
                  <div key={stop.id} className="group bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 p-5 pb-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-secondary">{stop.cityName}</h3>
                            {stop.country && <p className="text-xs text-gray-400">{stop.country}</p>}
                          </div>
                          <div className="ml-auto text-right text-xs text-gray-400">
                            {stop.arrivalDate && <p>{new Date(stop.arrivalDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>}
                            {stop.departureDate && <p>{new Date(stop.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>}
                          </div>
                        </div>
                        {acts.length > 0 ? (
                          <div className="px-5 pb-5 space-y-2">
                            {acts.map((act) => (
                              <div key={act.id} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl text-sm">
                                <span className="text-lg">{typeEmojiMap[act.type] || "🗺️"}</span>
                                <span className="text-secondary font-medium">{act.name}</span>
                                <span className="text-gray-400 text-xs ml-auto">₹{Number(act.cost) || 0}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-5 pb-5">
                            <p className="text-xs text-gray-400 italic">No activities added</p>
                          </div>
                        )}
                        {stopNotes.length > 0 && (
                          <div className="px-5 pb-5 sm:hidden space-y-2">
                            {stopNotes.map((n) => (
                              <div key={n.id} className="bg-primary/5 rounded-xl p-3">
                                <div className="bg-primary text-white text-xs leading-relaxed rounded-xl rounded-tr-none px-3 py-2 max-w-[85%] ml-auto break-words">
                                  {n.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {primaryNote ? (
                        <div className="hidden sm:flex flex-col justify-center w-56 shrink-0 border-l border-gray-100 bg-gray-50/50 p-3 gap-2">
                          <div className="bg-primary text-white text-xs leading-relaxed rounded-xl rounded-tr-none px-3 py-2 w-full break-words">
                            {primaryNote.content}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openNote(stop, primaryNote)}
                              className="flex items-center justify-center gap-1 text-xs text-primary/60 hover:text-primary transition-colors cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNote(primaryNote.id)}
                              disabled={deletingNoteId === primaryNote.id}
                              className="flex items-center justify-center gap-1 text-xs text-danger/60 hover:text-danger transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="hidden sm:flex flex-col overflow-hidden transition-all duration-300 w-0 group-hover:w-14">
                          <button
                            onClick={() => openNote(stop, null)}
                            className="flex-1 min-h-[56px] bg-primary/10 hover:bg-primary/20 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors"
                          >
                            <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="text-[10px] text-primary font-medium leading-tight">Add Note</span>
                          </button>
                        </div>
                      )}

                      {!primaryNote && (
                        <button
                          onClick={() => openNote(stop, null)}
                          className="sm:hidden flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-primary font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Add Note
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {viewMode === "calendar" && (
          <CalendarView
            trip={trip}
            stops={stops}
            activitiesMap={activitiesMap}
            typeEmojiMap={typeEmojiMap}
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-secondary mb-4">Cost Summary</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Total Estimated Cost</span>
            <span className="text-2xl font-bold text-primary">₹{totalCost().toLocaleString()}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            {stops.map((stop) => {
              const cost = (activitiesMap[stop.id] || []).reduce((s, a) => s + (Number(a.cost) || 0), 0);
              return (
                <div key={stop.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{stop.cityName}</span>
                  <span className="font-medium text-secondary">₹{cost.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Modal isOpen={!!noteModal} onClose={() => { setNoteModal(null); setEditingNoteId(null); setNoteDraft(""); }} title={`Note for ${noteModal?.cityName || ""}`} size="md">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Write your notes for this stop..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="ghost" onClick={() => { setNoteModal(null); setEditingNoteId(null); setNoteDraft(""); }}>Cancel</Button>
            <Button onClick={saveNote} disabled={!noteDraft.trim()}>{editingNoteId ? "Update Note" : "Add Note"}</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function CalendarView({ trip, stops, activitiesMap, typeEmojiMap }) {
  if (!trip?.startDate) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <p className="text-gray-500">No dates configured.</p>
      </div>
    );
  }

  const start = new Date(trip.startDate);
  const end = trip.endDate ? new Date(trip.endDate) : new Date(start);
  const year = start.getFullYear();
  const month = start.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const tripDays = {};
  let current = new Date(start);
  while (current <= end) {
    const ds = current.toISOString().split("T")[0];
    const dayStops = stops.filter((s) => {
      if (!s.arrivalDate && !s.departureDate) return false;
      return ds >= (s.arrivalDate || ds) && ds <= (s.departureDate || ds);
    });
    const acts = [];
    dayStops.forEach((s) => {
      (activitiesMap[s.id] || []).forEach((a) => acts.push(a));
    });
    tripDays[ds] = acts;
    current.setDate(current.getDate() + 1);
  }

  const monthName = start.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-secondary text-center mb-4">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const acts = tripDays[dateStr] || [];
          const inTrip = dateStr >= (trip.startDate || "") && dateStr <= (trip.endDate || "");
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(selectedDay === dateStr ? null : dateStr)}
              className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center text-sm transition-colors cursor-pointer ${
                inTrip ? "hover:bg-primary/10" : "text-gray-300"
              } ${selectedDay === dateStr ? "bg-primary/15 ring-2 ring-primary" : ""}`}
            >
              <span className={`font-medium ${inTrip ? "text-secondary" : ""}`}>{day}</span>
              {acts.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {acts.slice(0, 3).map((act) => (
                    <span key={act.id} className="text-xs">{typeEmojiMap[act.type] || "🗺️"}</span>
                  ))}
                  {acts.length > 3 && <span className="text-xs text-gray-400">+{acts.length - 3}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selectedDay && tripDays[selectedDay] && tripDays[selectedDay].length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-secondary mb-2">{new Date(selectedDay).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
          <div className="space-y-1.5">
            {tripDays[selectedDay].map((act) => (
              <div key={act.id} className="flex items-center gap-2 text-sm">
                <span>{typeEmojiMap[act.type] || "🗺️"}</span>
                <span className="text-secondary">{act.name}</span>
                {act.time && <span className="text-gray-400 text-xs">{act.time}</span>}
                {act.cost > 0 && <span className="text-gray-400 ml-auto">₹{act.cost}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
