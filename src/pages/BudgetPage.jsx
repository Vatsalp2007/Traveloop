import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import { useStops } from "../hooks/useStops";
import { updateDocument, getCollection } from "../firebase/firestore";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const CATEGORY_EMOJIS = {
  Transport: "🚗",
  Stay: "🏨",
  Activities: "🎯",
  Meals: "🍽️",
};

const CATEGORY_COLORS = {
  Transport: "bg-blue-500",
  Stay: "bg-purple-500",
  Activities: "bg-primary",
  Meals: "bg-green-500",
};

export default function BudgetPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTrip, updateTrip } = useTrip();
  const { subscribeToStops, getActivitiesForStop } = useStops();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [budgetLimit, setBudgetLimit] = useState("");
  const [savingLimit, setSavingLimit] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [togglingPaid, setTogglingPaid] = useState(null);

  async function handleTogglePaid(stopId, actId, currentPaid) {
    setTogglingPaid(`${stopId}-${actId}`);
    try {
      await updateDocument(`trips/${tripId}/stops/${stopId}/activities`, actId, { paid: !currentPaid });
      setActivitiesMap((prev) => {
        const next = { ...prev };
        next[stopId] = (next[stopId] || []).map((a) =>
          a.id === actId ? { ...a, paid: !currentPaid } : a
        );
        return next;
      });
    } catch (err) {
      console.error("Toggle paid error:", err);
    }
    setTogglingPaid(null);
  }

  async function handleMarkAllPaid(stopId) {
    const acts = activitiesMap[stopId] || [];
    const unpaid = acts.filter((a) => !a.paid);
    if (unpaid.length === 0) return;
    for (const act of unpaid) {
      try {
        await updateDocument(`trips/${tripId}/stops/${stopId}/activities`, act.id, { paid: true });
      } catch (err) {
        console.error("Mark all paid error:", err);
      }
    }
    setActivitiesMap((prev) => {
      const next = { ...prev };
      next[stopId] = (next[stopId] || []).map((a) => ({ ...a, paid: true }));
      return next;
    });
  }

  useEffect(() => {
    async function load() {
      try {
        const tripData = await getTrip(tripId);
        if (!tripData || (tripData.userId !== user?.uid)) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setTrip(tripData);
        setBudgetLimit(tripData.budgetLimit?.toString() || "");
      } catch (err) {
        console.error("Load error:", err);
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

  async function handleSaveLimit() {
    setSavingLimit(true);
    try {
      const val = budgetLimit ? Number(budgetLimit) : 0;
      await updateTrip(tripId, { budgetLimit: val });
      setTrip((prev) => ({ ...prev, budgetLimit: val }));
    } catch (err) {
      console.error("Save limit error:", err);
    } finally {
      setSavingLimit(false);
    }
  }

  const costByCity = {};
  const costByCategory = { Transport: 0, Stay: 0, Activities: 0, Meals: 0 };
  let total = 0;
  let totalDays = 0;

  if (trip?.startDate && trip?.endDate) {
    const s = new Date(trip.startDate);
    const e = new Date(trip.endDate);
    totalDays = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
  }

  stops.forEach((stop) => {
    let cityCost = 0;
    (activitiesMap[stop.id] || []).forEach((act) => {
      const c = Number(act.cost) || 0;
      cityCost += c;
      total += c;
      const category = guessCategory(act);
      costByCategory[category] = (costByCategory[category] || 0) + c;
    });
    costByCity[stop.id] = { name: stop.cityName, cost: cityCost, days: calcStopDays(stop) };
  });

  function calcStopDays(stop) {
    if (stop.arrivalDate && stop.departureDate) {
      const s = new Date(stop.arrivalDate);
      const e = new Date(stop.departureDate);
      return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
    }
    return 0;
  }

  function guessCategory(activity) {
    const type = activity.type || "";
    if (type === "food") return "Meals";
    if (type === "shopping") return "Activities";
    if (type === "adventure") return "Activities";
    if (type === "sightseeing") return "Activities";
    return "Activities";
  }

  let paidTotal = 0;
  stops.forEach((stop) => {
    (activitiesMap[stop.id] || []).forEach((act) => {
      if (act.paid) paidTotal += Number(act.cost) || 0;
    });
  });

  const maxCityCost = Math.max(1, ...Object.values(costByCity).map((c) => c.cost));
  const maxCategoryCost = Math.max(1, ...Object.values(costByCategory));
  const avgPerDay = totalDays > 0 ? total / totalDays : 0;
  const overBudget = trip?.budgetLimit > 0 && total > trip.budgetLimit;

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

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(`/trips/${tripId}`)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {overBudget && (
          <div className="bg-danger/10 border border-danger/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-danger font-medium">Over Budget!</p>
              <p className="text-sm text-danger/80">
                Total (₹{total.toLocaleString()}) exceeds your limit of ₹{trip.budgetLimit.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Estimated Cost</p>
          <p className="text-4xl font-bold text-primary">₹{total.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div>
              <p className="text-xs text-gray-400">Paid</p>
              <p className="text-lg font-bold text-success">₹{paidTotal.toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400">Unpaid</p>
              <p className="text-lg font-bold text-gray-400">₹{(total - paidTotal).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Avg. <span className="font-medium text-secondary">₹{avgPerDay.toFixed(0)}</span> / day over{" "}
            <span className="font-medium text-secondary">{totalDays}</span> day{totalDays !== 1 ? "s" : ""}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              to={`/trips/${tripId}/invoice`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors no-underline"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Full Invoice
            </Link>
            <Link
              to={`/trips/${tripId}/invoice`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-success bg-success/5 rounded-xl hover:bg-success/10 transition-colors no-underline"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">Cost by City</h3>
            <div className="space-y-3">
              {stops.length === 0 && (
                <p className="text-gray-400 text-sm">No stops added yet.</p>
              )}
              {stops.map((stop) => {
                const info = costByCity[stop.id];
                if (!info) return null;
                const pct = maxCityCost > 0 ? (info.cost / maxCityCost) * 100 : 0;
                return (
                  <div key={stop.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-secondary font-medium">{info.name}</span>
                      <span className="text-gray-500">₹{info.cost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">Cost by Category</h3>
            {total > 0 && (
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div
                  className="w-40 h-40 rounded-full shrink-0"
                  style={{
                    background: `conic-gradient(
                      #3B82F6 0% ${((costByCategory.Transport / total) * 100).toFixed(1)}%,
                      #8B5CF6 ${((costByCategory.Transport / total) * 100).toFixed(1)}% ${(((costByCategory.Transport + costByCategory.Stay) / total) * 100).toFixed(1)}%,
                      #F5A623 ${(((costByCategory.Transport + costByCategory.Stay) / total) * 100).toFixed(1)}% ${(((costByCategory.Transport + costByCategory.Stay + costByCategory.Activities) / total) * 100).toFixed(1)}%,
                      #10B981 ${(((costByCategory.Transport + costByCategory.Stay + costByCategory.Activities) / total) * 100).toFixed(1)}% 100%
                    )`,
                  }}
                />
                <div className="space-y-2">
                  {Object.entries(costByCategory).filter(([, c]) => c > 0).map(([cat, cost]) => (
                    <div key={cat} className="flex items-center gap-2 text-sm">
                      <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat] || "bg-gray-400"}`} />
                      <span className="text-secondary">{CATEGORY_EMOJIS[cat]} {cat}</span>
                      <span className="text-gray-500">₹{cost.toLocaleString()} ({((cost / total) * 100).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              {Object.entries(costByCategory).map(([cat, cost]) => {
                const pct = maxCategoryCost > 0 ? (cost / maxCategoryCost) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span>{CATEGORY_EMOJIS[cat] || "📋"}</span>
                        <span className="text-secondary">{cat}</span>
                      </span>
                      <span className="text-gray-500">₹{cost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[cat] || "bg-gray-400"}`}
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-secondary mb-4">Budget Limit</h3>
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <label className="text-sm text-gray-500 mb-1 block">Set a budget limit</label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <Button onClick={handleSaveLimit} loading={savingLimit}>Save</Button>
          </div>
          {trip?.budgetLimit > 0 && (
            <div className="mt-3 text-sm text-gray-500">
              Budget limit: <span className="font-medium text-secondary">₹{trip.budgetLimit.toLocaleString()}</span>
              <span className={`ml-2 ${total <= trip.budgetLimit ? "text-success" : "text-danger"}`}>
                ({total <= trip.budgetLimit ? "Under budget" : `Over by ₹${(total - trip.budgetLimit).toLocaleString()}`})
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-secondary mb-4">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">City</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Days</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Est. Cost</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {stops.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">No data</td>
                  </tr>
                )}
                {stops.map((stop) => {
                  const info = costByCity[stop.id];
                  if (!info) return null;
                  const pct = total > 0 ? ((info.cost / total) * 100).toFixed(1) : "0.0";
                  const stopActs = activitiesMap[stop.id] || [];
                  const paidCount = stopActs.filter((a) => a.paid).length;
                  return (
                    <tr key={stop.id} className="border-b border-gray-50">
                      <td className="py-3 px-2 text-secondary font-medium">{info.name}</td>
                      <td className="py-3 px-2 text-right text-gray-500">{info.days}</td>
                      <td className="py-3 px-2 text-right text-secondary">₹{info.cost.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right">
                        {stopActs.length > 0 && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paidCount === stopActs.length ? "bg-success/10 text-success" : paidCount > 0 ? "bg-warning/10 text-warning" : "bg-gray-100 text-gray-400"}`}>
                            {paidCount}/{stopActs.length} paid
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right text-gray-500">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="py-3 px-2 text-secondary">Total</td>
                  <td className="py-3 px-2 text-right text-secondary">{totalDays}</td>
                  <td className="py-3 px-2 text-right text-primary">₹{total.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-success">₹{paidTotal.toLocaleString()} paid</td>
                  <td className="py-3 px-2 text-right text-secondary">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-secondary mb-4">Mark as Paid</h3>
          <div className="space-y-2">
            {stops.map((stop) => {
              const acts = activitiesMap[stop.id] || [];
              return acts.length > 0 ? (
                <div key={stop.id} className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500">{stop.cityName}</p>
                    {acts.some((a) => !a.paid) && (
                      <button
                        onClick={() => handleMarkAllPaid(stop.id)}
                        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                      >
                        Mark all paid
                      </button>
                    )}
                  </div>
                  {acts.map((act) => {
                    const isPaid = act.paid;
                    const toggleKey = `${stop.id}-${act.id}`;
                    return (
                      <div key={act.id} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl text-sm mb-1">
                        <button
                          onClick={() => handleTogglePaid(stop.id, act.id, isPaid)}
                          disabled={togglingPaid === toggleKey}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50 ${isPaid ? "bg-success border-success text-white" : "border-gray-300 hover:border-primary"}`}
                        >
                          {isPaid && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className="text-secondary">{act.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ₹{Number(act.cost) || 0}
                          <span className={`ml-1.5 ${isPaid ? "text-success" : "text-gray-400"}`}>{isPaid ? "Paid" : "Unpaid"}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null;
            })}
            {stops.every((s) => (activitiesMap[s.id] || []).length === 0) && (
              <p className="text-sm text-gray-400 py-4 text-center">No activities to mark</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
