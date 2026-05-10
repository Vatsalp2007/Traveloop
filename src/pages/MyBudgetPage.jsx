import { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import { getCollection, updateDocument } from "../firebase/firestore";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

class SafeWrap extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e) { console.error("Budget expand error:", e); }
  render() { return this.state.hasError ? <div className="px-5 py-8 text-center text-sm text-gray-400">Failed to load budget data</div> : this.props.children; }
}

const CATEGORIES = [
  { key: "Transport", label: "Transport", emoji: "🚗", color: "#3B82F6" },
  { key: "Stay", label: "Stay", emoji: "🏨", color: "#8B5CF6" },
  { key: "Activities", label: "Activities", emoji: "🎯", color: "#F5A623" },
  { key: "Meals", label: "Meals", emoji: "🍽️", color: "#10B981" },
];

function fmtDate(d) {
  if (!d) return "";
  try {
    const date = d.toDate ? d.toDate() : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

export default function MyBudgetPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribeToTrips } = useTrip();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [tripData, setTripData] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [togglingPaid, setTogglingPaid] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToTrips(user.uid, (data) => {
      try { setTrips((data || []).filter((t) => t && t.userId === user.uid)); } catch {}
      setLoading(false);
    });
    return () => { try { unsub(); } catch {} };
  }, [user]);

  async function handleExpand(id) {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (tripData[id]) return;
    setLoadingId(id);
    try {
      const stopsData = await getCollection(`trips/${id}/stops`);
      const sorted = (stopsData || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const actsMap = {};
      for (const stop of sorted) {
        try { actsMap[stop.id] = await getCollection(`trips/${id}/stops/${stop.id}/activities`) || []; }
        catch { actsMap[stop.id] = []; }
      }
      setTripData((p) => ({ ...p, [id]: { stops: sorted, activitiesMap: actsMap } }));
    } catch (e) {
      console.error("Failed to load trip budget:", e);
    }
    setLoadingId(null);
  }

  async function togglePaid(tripId, stopId, actId, cur) {
    setTogglingPaid(`${stopId}-${actId}`);
    try {
      await updateDocument(`trips/${tripId}/stops/${stopId}/activities`, actId, { paid: !cur });
      setTripData((prev) => {
        const trip = prev[tripId];
        if (!trip) return prev;
        const actsMap = { ...trip.activitiesMap };
        actsMap[stopId] = (actsMap[stopId] || []).map((a) =>
          a.id === actId ? { ...a, paid: !cur } : a
        );
        return { ...prev, [tripId]: { ...trip, activitiesMap: actsMap } };
      });
    } catch {}
    setTogglingPaid(null);
  }

  async function handleMarkAllPaid(tripId, stopId) {
    const acts = tripData[tripId]?.activitiesMap?.[stopId] || [];
    const unpaid = acts.filter((a) => !a.paid);
    if (unpaid.length === 0) return;
    for (const act of unpaid) {
      try {
        await updateDocument(`trips/${tripId}/stops/${stopId}/activities`, act.id, { paid: true });
      } catch {}
    }
    setTripData((prev) => {
      const trip = prev[tripId];
      if (!trip) return prev;
      const actsMap = { ...trip.activitiesMap };
      actsMap[stopId] = (actsMap[stopId] || []).map((a) => ({ ...a, paid: true }));
      return { ...prev, [tripId]: { ...trip, activitiesMap: actsMap } };
    });
  }

  function calc(trip) {
    try {
      const data = tripData[trip.id];
      if (!data) return null;
      const { stops, activitiesMap } = data;
      if (!stops || !activitiesMap) return null;
      let total = 0, paid = 0;
      const byCity = {}, byCat = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]));
      (stops || []).forEach((stop) => {
        let cc = 0;
        ((activitiesMap[stop.id] || [])).forEach((act) => {
          const c = Number(act.cost) || 0;
          cc += c; total += c;
          if (act.paid) paid += c;
          const t = (act.type || "").toLowerCase();
          const cat = t === "food" || t === "meals" ? "Meals" : t === "transport" ? "Transport" : t === "stay" || t === "hotel" || t === "accommodation" ? "Stay" : "Activities";
          if (byCat[cat] !== undefined) byCat[cat] += c; else byCat[cat] = c;
        });
        byCity[stop.id] = { name: stop.cityName || stop.cityId || "?", cost: cc, paid: 0 };
      });
      let days = 0;
      if (trip.startDate && trip.endDate) {
        try {
          const s = trip.startDate.toDate ? trip.startDate.toDate() : new Date(trip.startDate);
          const e = trip.endDate.toDate ? trip.endDate.toDate() : new Date(trip.endDate);
          days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
        } catch { days = 0; }
      }
      const budgetLimit = Number(trip.budgetLimit) || 0;
      return { total, paid, unpaid: total - paid, byCity, byCat, stops, days, avgPerDay: days > 0 ? total / days : 0, overBudget: budgetLimit > 0 && total > budgetLimit, budgetLimit };
    } catch { return null; }
  }

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">💰 My Budget</h1>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-6xl mb-4">💰</p>
            <h2 className="text-xl font-semibold text-secondary mb-2">No trips yet</h2>
            <p className="text-gray-500 mb-6">Create a trip to start tracking your budget</p>
            <Button onClick={() => navigate("/trips/new")}>Plan a Trip</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => {
              const b = calc(trip);
              const isLoading = loadingId === trip.id;
              return (
                <div key={trip.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button onClick={() => handleExpand(trip.id)} className="w-full text-left p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 text-xl">✈️</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary truncate">{trip.name || "Untitled"}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{fmtDate(trip.startDate)} - {fmtDate(trip.endDate)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {b ? (
                        <>
                          <p className="text-sm font-semibold text-primary">₹{(b.total || 0).toLocaleString()}</p>
                          <p className="text-xs mt-0.5">
                            <span className="text-success font-medium">₹{(b.paid || 0).toLocaleString()} paid</span>
                            {(b.unpaid || 0) > 0 && <span className="text-gray-400"> · ₹{(b.unpaid || 0).toLocaleString()} left</span>}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">{isLoading ? "Loading..." : "Click to view"}</p>
                      )}
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedId === trip.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {expandedId === trip.id && (
                    <div className="border-t border-gray-100">
                      {isLoading ? (
                        <div className="flex justify-center py-10"><Spinner size="md" /></div>
                      ) : !b ? (
                        <div className="px-5 py-8 text-center text-sm text-gray-400">No budget data yet. Add activities to see budget breakdown.</div>
                      ) : (
                        <SafeWrap>
                          {b.overBudget && (
                            <div className="mx-5 mt-5 bg-danger/10 border border-danger/30 rounded-2xl p-4 flex items-center gap-3">
                              <span className="text-xl">⚠️</span>
                              <div>
                                <p className="text-danger font-medium text-sm">Over Budget!</p>
                                <p className="text-xs text-danger/80">Total (₹{(b.total || 0).toLocaleString()}) exceeds limit of ₹{(b.budgetLimit || 0).toLocaleString()}</p>
                              </div>
                            </div>
                          )}

                          <div className="px-5 pt-5 pb-3">
                            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 text-center">
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Estimated Cost</p>
                              <p className="text-4xl font-bold text-primary">₹{(b.total || 0).toLocaleString()}</p>
                              <div className="flex items-center justify-center gap-6 mt-3">
                                <div><p className="text-xs text-gray-400">Paid</p><p className="text-lg font-bold text-success">₹{(b.paid || 0).toLocaleString()}</p></div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div><p className="text-xs text-gray-400">Unpaid</p><p className="text-lg font-bold text-gray-400">₹{(b.unpaid || 0).toLocaleString()}</p></div>
                              </div>
                              <p className="text-xs text-gray-400 mt-3">Avg. ₹{(b.avgPerDay || 0).toFixed(0)} / day over {(b.days || 0)} day{(b.days || 0) !== 1 ? "s" : ""}</p>
                            </div>
                            <div className="flex justify-center mt-3">
                              <a
                                href={`/trips/${trip.id}/invoice?print=true`}
                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-success bg-success/5 rounded-xl hover:bg-success/10 transition-colors no-underline"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Invoice PDF
                              </a>
                            </div>
                          </div>

                          <div className="px-5 pb-3">
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                              <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${(b.total || 0) > 0 ? ((b.paid || 0) / (b.total || 1)) * 100 : 0}%` }} />
                            </div>
                            <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                              <span>₹{(b.paid || 0).toLocaleString()} paid</span>
                              <span>₹{(b.unpaid || 0).toLocaleString()} unpaid</span>
                            </div>
                          </div>

                          <div className="px-5 pb-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-secondary mb-3">📊 Cost by City</h4>
                                {(b.stops || []).length === 0 ? <p className="text-xs text-gray-400">No stops</p> : (
                                  <div className="space-y-3">
                                    {(b.stops || []).map((stop) => {
                                      const info = b.byCity[stop.id];
                                      if (!info) return null;
                                      const pct = (b.total || 0) > 0 ? ((info.cost || 0) / (b.total || 1)) * 100 : 0;
                                      return (
                                        <div key={stop.id}>
                                          <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-secondary font-medium">{info.name || "?"}</span>
                                            <span className="text-gray-500">₹{(info.cost || 0).toLocaleString()}</span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.max(2, pct)}%` }} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-secondary mb-3">🍕 Cost by Category</h4>
                                {(b.total || 0) > 0 && (
                                  <div className="flex flex-col items-center gap-4 mb-4">
                                    <div className="w-36 h-36 rounded-full" style={{
                                      background: (() => {
                                        try {
                                          const filtered = CATEGORIES.filter((c) => (b.byCat[c.key] || 0) > 0);
                                          if (filtered.length === 0) return "#E5E7EB";
                                          let conic = "";
                                          let cumulative = 0;
                                          filtered.forEach((c, i) => {
                                            const pct = ((b.byCat[c.key] || 0) / (b.total || 1)) * 100;
                                            const start = cumulative;
                                            cumulative += pct;
                                            conic += `${c.color} ${start}% ${cumulative}%${i < filtered.length - 1 ? ", " : ""}`;
                                          });
                                          return `conic-gradient(${conic})`;
                                        } catch { return "#E5E7EB"; }
                                      })()
                                    }} />
                                    <div className="space-y-1.5 w-full">
                                      {CATEGORIES.filter((c) => (b.byCat[c.key] || 0) > 0).map((cat) => (
                                        <div key={cat.key} className="flex items-center justify-between text-sm">
                                          <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-secondary">{cat.emoji} {cat.label}</span>
                                          </span>
                                          <span className="text-gray-500">₹{(b.byCat[cat.key] || 0).toLocaleString()} ({((b.byCat[cat.key] || 0) / (b.total || 1) * 100).toFixed(1)}%)</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {Object.values(b.byCat).every((c) => !c || c === 0) && <p className="text-xs text-gray-400">No costs recorded</p>}
                              </div>
                            </div>
                          </div>

                          <div className="px-5 pb-5">
                            <h4 className="text-sm font-semibold text-secondary mb-3">✅ Mark as Paid</h4>
                            {(b.stops || []).some((s) => ((b.byCity[s.id] && b.byCity[s.id].cost) || 0) > 0) || (b.stops || []).some((s) => (tripData[trip.id]?.activitiesMap?.[s.id]?.length || 0) > 0) ? (
                              <div className="space-y-3">
                                  {(b.stops || []).map((stop) => {
                                    const acts = tripData[trip.id]?.activitiesMap?.[stop.id] || [];
                                    return acts.length > 0 ? (
                                      <div key={stop.id}>
                                        <div className="flex items-center justify-between mb-1.5">
                                          <p className="text-xs font-medium text-gray-500">{stop.cityName || stop.cityId || "?"}</p>
                                          {acts.some((a) => !a.paid) && (
                                            <button
                                              onClick={() => handleMarkAllPaid(trip.id, stop.id)}
                                              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                                            >
                                              Mark all paid
                                            </button>
                                          )}
                                        </div>
                                        {acts.map((act) => {
                                        const isPaid = act.paid;
                                        return (
                                          <div key={act.id} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl text-sm mb-1">
                                            <button onClick={() => togglePaid(trip.id, stop.id, act.id, isPaid)} disabled={togglingPaid === `${stop.id}-${act.id}`}
                                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50 ${isPaid ? "bg-success border-success text-white" : "border-gray-300 hover:border-primary"}`}>
                                              {isPaid && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </button>
                                            <span className="text-secondary">{act.name || "?"}</span>
                                            <span className="text-xs ml-auto">
                                              <span className={isPaid ? "text-success font-medium" : "text-gray-400"}>₹{Number(act.cost) || 0}</span>
                                              <span className={`ml-1.5 text-[10px] uppercase ${isPaid ? "text-success" : "text-gray-400"}`}>{isPaid ? "Paid" : "Unpaid"}</span>
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No activities to mark</p>
                            )}
                          </div>
                        </SafeWrap>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
