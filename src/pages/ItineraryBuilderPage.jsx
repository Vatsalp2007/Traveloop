import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import { useStops } from "../hooks/useStops";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import { loadCities, loadActivities } from "../firebase/dataService";

const ACTIVITY_TYPES = [
  { value: "sightseeing", label: "Sightseeing", emoji: "🗺️" },
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "adventure", label: "Adventure", emoji: "🧗" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
];

const typeEmojiMap = Object.fromEntries(ACTIVITY_TYPES.map((t) => [t.value, t.emoji]));

export default function ItineraryBuilderPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTrip, updateTrip } = useTrip();
  const {
    addStop, updateStop, deleteStop, reorderStops,
    addActivity, updateActivity, deleteActivity,
    subscribeToStops, subscribeToActivities, getActivitiesForStop,
  } = useStops();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [targetStopId, setTargetStopId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [showManualInput, setShowManualInput] = useState(null);
  const [manualActName, setManualActName] = useState("");
  const [manualActCost, setManualActCost] = useState("");
  const [manualActDuration, setManualActDuration] = useState("");
  const [manualActType, setManualActType] = useState("sightseeing");

  useEffect(() => {
    async function load() {
      try {
        const tripData = await getTrip(tripId);
        if (!tripData || (tripData.userId !== user?.uid)) {
          navigate("/trips", { replace: true });
          return;
        }
        setTrip(tripData);
        setTitleDraft(tripData.name || "");
      } catch (err) {
        console.error("Load trip error:", err);
        navigate("/trips", { replace: true });
      }
    }
    load();
  }, [tripId, user]);

  useEffect(() => {
    if (!tripId) return;
    const unsub = subscribeToStops(tripId, (stopsData) => {
      const sorted = stopsData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setStops(sorted);
      sorted.forEach((stop) => {
        const unsubAct = subscribeToActivities(tripId, stop.id, (acts) => {
          setActivitiesMap((prev) => ({ ...prev, [stop.id]: acts }));
        });
      });
    });
    return () => unsub();
  }, [tripId]);

  async function openCityModal() {
    setCityModalOpen(true);
    setCitySearch("");
    setCities(await loadCities());
  }

  async function handleAddCity(city) {
    try {
      await addStop(tripId, {
        cityId: city.name,
        cityName: city.name,
        country: city.country || "",
        arrivalDate: "",
        departureDate: "",
        order: stops.length,
        lat: city.lat || 0,
        lng: city.lng || 0,
      });
      setCityModalOpen(false);
    } catch (err) {
      console.error("Add stop error:", err);
    }
  }

  async function openActivityModal(stopId) {
    setTargetStopId(stopId);
    setActivityModalOpen(true);
    setActivitySearch("");
    setActivityTypeFilter("");
    const stop = stops.find((s) => s.id === stopId);
    if (stop?.cityId) {
      const all = await loadActivities();
      setActivities(all.filter((a) => a.city === stop.cityId));
    } else {
      setActivities([]);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleAddActivity(activity) {
    if (!targetStopId) return;
    try {
      await addActivity(tripId, targetStopId, {
        name: activity.name,
        type: activity.type || "sightseeing",
        cost: Number(activity.cost) || 0,
        duration: activity.duration || "",
        time: activity.time || "",
      });
      setActivityModalOpen(false);
      setTargetStopId(null);
      showToast(`✅ Added "${activity.name}" (₹${Number(activity.cost) || 0})`);
    } catch (err) {
      console.error("Add activity error:", err);
      showToast("❌ Failed to add activity");
    }
  }

  async function handleAddManualActivity(stopId) {
    const name = manualActName.trim();
    if (!name) return;
    try {
      await addActivity(tripId, stopId, {
        name,
        type: manualActType,
        cost: Number(manualActCost) || 0,
        duration: manualActDuration || "",
        time: "",
      });
      setManualActName("");
      setManualActCost("");
      setManualActDuration("");
      setShowManualInput(null);
      showToast(`✅ Added "${name}" (₹${Number(manualActCost) || 0})`);
    } catch (err) {
      console.error("Add manual activity error:", err);
      showToast("❌ Failed to add activity");
    }
  }

  async function handleDeleteActivity(stopId, activityId) {
    try {
      await deleteActivity(tripId, stopId, activityId);
    } catch (err) {
      console.error("Delete activity error:", err);
    }
  }

  async function handleStopDateChange(stopId, field, value) {
    try {
      await updateStop(tripId, stopId, { [field]: value });
    } catch (err) {
      console.error("Update stop error:", err);
    }
  }

  async function handleDeleteStop() {
    if (!deleteConfirm) return;
    try {
      await deleteStop(tripId, deleteConfirm);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete stop error:", err);
    }
  }

  async function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(stops);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setStops(items);
    try {
      await reorderStops(tripId, items);
    } catch (err) {
      console.error("Reorder error:", err);
    }
  }

  async function handleSaveTitle() {
    try {
      await updateTrip(tripId, { name: titleDraft.trim() });
      setTrip((prev) => ({ ...prev, name: titleDraft.trim() }));
      setEditingTitle(false);
    } catch (err) {
      console.error("Save title error:", err);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      let totalBudget = 0;
      stops.forEach((stop) => {
        const acts = activitiesMap[stop.id] || [];
        acts.forEach((a) => { totalBudget += Number(a.cost) || 0; });
      });
      await updateTrip(tripId, {
        name: titleDraft.trim(),
        totalBudget,
        cityCount: stops.length,
      });
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  const filteredCities = cities.filter(
    (c) =>
      (!trip?.countries || trip.countries.length === 0 || trip.countries.includes(c.country)) &&
      (c.name?.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.country?.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const filteredActivities = activities.filter((a) => {
    const matchesSearch = a.name?.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesType = !activityTypeFilter || a.type === activityTypeFilter;
    return matchesSearch && matchesType;
  });

  if (!trip) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {toast && (
          <div className="fixed top-20 right-4 z-50 bg-white shadow-lg rounded-xl px-5 py-3 text-sm font-medium text-secondary border border-gray-100 animate-slide-in">
            {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(`/trips/${tripId}`)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Button onClick={handleSave} loading={saving}>Save</Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="text-2xl font-bold text-secondary bg-transparent border-b-2 border-primary outline-none flex-1"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") { setEditingTitle(false); setTitleDraft(trip.name); } }}
              />
              <button onClick={handleSaveTitle} className="text-primary hover:text-primary-dark cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-secondary">{trip.name}</h1>
              <button onClick={() => setEditingTitle(true)} className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {trip.startDate && <span>{new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
            {trip.endDate && <span>- {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
            <span>{stops.length} stop{stops.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stops">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {stops.map((stop, index) => (
                  <Draggable key={stop.id} draggableId={stop.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white rounded-2xl shadow-sm p-6 ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary/30" : ""}`}
                      >
                        <div className="flex items-start gap-4">
                          <div {...provided.dragHandleProps} className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-lg font-semibold text-secondary">{stop.cityName}</h3>
                              <button
                                onClick={() => setDeleteConfirm(stop.id)}
                                className="text-gray-400 hover:text-danger transition-colors shrink-0 cursor-pointer"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            {stop.country && <p className="text-sm text-gray-500">{stop.country}</p>}

                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <Input
                                label="Arrival"
                                type="date"
                                value={stop.arrivalDate || ""}
                                onChange={(e) => handleStopDateChange(stop.id, "arrivalDate", e.target.value)}
                                min={trip?.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : ""}
                                max={trip?.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : ""}
                              />
                              <Input
                                label="Departure"
                                type="date"
                                value={stop.departureDate || ""}
                                onChange={(e) => handleStopDateChange(stop.id, "departureDate", e.target.value)}
                                min={stop.arrivalDate || (trip?.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "")}
                                max={trip?.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : ""}
                              />
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-1 px-1">
                                <span>Activities</span>
                                <span>Cost: <span className="font-medium text-secondary">₹{(activitiesMap[stop.id] || []).reduce((s, a) => s + (Number(a.cost) || 0), 0)}</span></span>
                              </div>
                              {(activitiesMap[stop.id] || []).map((act) => (
                                <div key={act.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{typeEmojiMap[act.type] || "🗺️"}</span>
                                    <div>
                                      <p className="text-sm font-medium text-secondary">{act.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {act.time && <span>{act.time}</span>}
                                        {act.duration && <span>{act.time ? " · " : ""}{act.duration}</span>}
                                        {act.cost > 0 && <span> · ₹{act.cost}</span>}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteActivity(stop.id, act.id)}
                                    className="text-gray-400 hover:text-danger transition-colors cursor-pointer shrink-0"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openActivityModal(stop.id)}
                                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Browse Activities
                                </button>
                                <button
                                  onClick={() => setShowManualInput(showManualInput === stop.id ? null : stop.id)}
                                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-secondary transition-colors cursor-pointer"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Custom
                                </button>
                              </div>
                              {showManualInput === stop.id && (
                                <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                      value={manualActName}
                                      onChange={(e) => setManualActName(e.target.value)}
                                      placeholder="Activity name"
                                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      value={manualActCost}
                                      onChange={(e) => setManualActCost(e.target.value)}
                                      placeholder="Cost ₹"
                                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      value={manualActDuration}
                                      onChange={(e) => setManualActDuration(e.target.value)}
                                      placeholder="Duration (min)"
                                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <select
                                      value={manualActType}
                                      onChange={(e) => setManualActType(e.target.value)}
                                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                                    >
                                      {ACTIVITY_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                                      ))}
                                    </select>
                                    <Button size="sm" onClick={() => handleAddManualActivity(stop.id)} disabled={!manualActName.trim()}>
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={openCityModal}
          className="mt-4 w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-primary hover:text-primary transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stop
          </div>
        </button>

        {stops.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Estimated Total Budget</span>
              <span className="text-xl font-bold text-primary">
                ₹{stops.reduce((sum, s) => sum + (activitiesMap[s.id] || []).reduce((a, act) => a + (Number(act.cost) || 0), 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <Link to={`/trips/${tripId}`} className="text-xs text-primary hover:text-primary-dark font-medium">View Itinerary</Link>
              <span className="text-gray-300">·</span>
              <Link to={`/trips/${tripId}/checklist`} className="text-xs text-primary hover:text-primary-dark font-medium">✅ Checklist</Link>
              <span className="text-gray-300">·</span>
              <Link to={`/trips/${tripId}/notes`} className="text-xs text-primary hover:text-primary-dark font-medium">📓 Notes</Link>
            </div>
          </div>
        )}
        {toast && (
          <div className="fixed bottom-24 right-4 z-50 bg-white shadow-lg rounded-xl px-5 py-3 text-sm font-medium text-secondary border border-gray-100 animate-slide-in">
            {toast}
          </div>
        )}
      </div>

      <Modal isOpen={cityModalOpen} onClose={() => setCityModalOpen(false)} title="Add a City" size="lg">
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search cities..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        {filteredCities.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No cities found</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-1">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleAddCity(city)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-medium text-secondary">{city.name}</p>
                  <p className="text-sm text-gray-500">{city.country || ""}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>

      <Modal isOpen={activityModalOpen} onClose={() => { setActivityModalOpen(false); setTargetStopId(null); }} title="Add Activity" size="lg">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <select
            value={activityTypeFilter}
            onChange={(e) => setActivityTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="">All Types</option>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
            ))}
          </select>
        </div>
        {loadingActivities ? (
          <Spinner />
        ) : filteredActivities.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No activities found</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-1">
            {filteredActivities.map((act) => (
              <button
                key={act.id}
                onClick={() => handleAddActivity(act)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{typeEmojiMap[act.type] || "🗺️"}</span>
                  <div>
                    <p className="font-medium text-secondary">{act.name}</p>
                    <p className="text-xs text-gray-500">{act.duration}{act.cost ? ` · ₹${act.cost}` : ""}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Add</Button>
              </button>
            ))}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Stop" size="sm">
        <p className="text-gray-600 mb-6">Delete this stop and all its activities? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteStop}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
