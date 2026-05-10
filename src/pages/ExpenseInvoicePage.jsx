import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import { useStops } from "../hooks/useStops";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const CATEGORY_META = {
  Transport: { icon: "🚗", label: "Transport", color: "text-blue-600", bg: "bg-blue-50" },
  Stay: { icon: "🏨", label: "Stay", color: "text-purple-600", bg: "bg-purple-50" },
  Activities: { icon: "🎯", label: "Activities", color: "text-primary", bg: "bg-amber-50" },
  Meals: { icon: "🍽️", label: "Meals", color: "text-green-600", bg: "bg-green-50" },
};

export default function ExpenseInvoicePage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTrip } = useTrip();
  const { subscribeToStops, getActivitiesForStop } = useStops();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const tripData = await getTrip(tripId);
        if (!tripData || tripData.userId !== user?.uid) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setTrip(tripData);
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

  function fmtDate(d) {
    if (!d) return "";
    const date = d.toDate ? d.toDate() : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function fmtDateFull(d) {
    if (!d) return "";
    const date = d.toDate ? d.toDate() : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  function guessCategory(activity) {
    const type = activity.type || "";
    if (type === "food" || type === "meals") return "Meals";
    if (type === "transport") return "Transport";
    if (type === "stay" || type === "hotel" || type === "accommodation") return "Stay";
    return "Activities";
  }

  const allActivities = [];
  stops.forEach((stop) => {
    (activitiesMap[stop.id] || []).forEach((act) => {
      allActivities.push({ ...act, cityName: stop.cityName || "Unknown", stopId: stop.id });
    });
  });

  const grouped = {};
  allActivities.forEach((act) => {
    const cat = guessCategory(act);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(act);
  });

  const CATEGORY_ORDER = ["Transport", "Stay", "Meals", "Activities"];
  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped[c]?.length > 0);

  let grandTotal = 0;
  let paidTotal = 0;
  Object.values(grouped).forEach((acts) => {
    acts.forEach((a) => {
      const c = Number(a.cost) || 0;
      grandTotal += c;
      if (a.paid) paidTotal += c;
    });
  });

  const invoiceNumber = `INV-${tripId?.slice(-8).toUpperCase() || "00000000"}`;
  const today = fmtDateFull(new Date().toISOString());
  const citiesVisited = [...new Set(stops.map((s) => s.cityName).filter(Boolean))].join(", ");
  const unpaidTotal = grandTotal - paidTotal;

  function handlePrint() {
    window.print();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button onClick={() => navigate(`/trips/${tripId}/budget`)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Budget
          </button>
          <Button onClick={handlePrint} variant="secondary" size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / PDF
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm print:shadow-none overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">✈️</div>
                  <div>
                    <h1 className="text-2xl font-bold text-secondary">Traveloop</h1>
                    <p className="text-sm text-gray-500">Trip Expense Invoice</p>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Invoice #</p>
                <p className="text-xl font-bold text-secondary">{invoiceNumber}</p>
                <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-secondary font-medium">{today}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-200">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Travel Details</h3>
                <h2 className="text-lg font-bold text-secondary">{trip?.name || "Untitled Trip"}</h2>
                {trip?.description && <p className="text-sm text-gray-500 mt-1">{trip.description}</p>}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {trip?.startDate ? fmtDate(trip.startDate) : "—"} — {trip?.endDate ? fmtDate(trip.endDate) : "—"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {citiesVisited || "No cities"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    {stops.length} stop{stops.length !== 1 ? "s" : ""} · {allActivities.length} activit{allActivities.length !== 1 ? "ies" : "y"}
                  </div>
                </div>
              </div>
              <div className="sm:text-right">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Status</h3>
                <div className="inline-flex flex-col items-center sm:items-end gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Paid</p>
                      <p className="text-lg font-bold text-success">₹{paidTotal.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Unpaid</p>
                      <p className="text-lg font-bold text-gray-400">₹{unpaidTotal.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-[200px]">
                    <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${grandTotal > 0 ? (paidTotal / grandTotal) * 100 : 0}%` }} />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${paidTotal >= grandTotal && grandTotal > 0 ? "bg-success/10 text-success" : paidTotal > 0 ? "bg-warning/10 text-warning" : "bg-gray-100 text-gray-400"}`}>
                    {grandTotal === 0 ? "No expenses" : paidTotal >= grandTotal ? "Fully Paid" : `Partially Paid (${grandTotal > 0 ? Math.round((paidTotal / grandTotal) * 100) : 0}%)`}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-base font-bold text-secondary mb-6">Expense Breakdown</h3>

              {sortedCategories.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-sm">No expenses recorded for this trip.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">#</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Description</th>
                        <th className="text-right py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Qty</th>
                        <th className="text-right py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Unit Cost</th>
                        <th className="text-right py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCategories.map((cat) => {
                        const acts = grouped[cat];
                        const meta = CATEGORY_META[cat] || { icon: "📋", label: cat };

                        return (
                          <tr key={cat}>
                            <td colSpan={6} className="pt-5 pb-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${meta.color} ${meta.bg}`}>
                                {meta.icon} {meta.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {sortedCategories.map((cat) => {
                        const acts = grouped[cat];
                        let catTotal = 0;
                        let rowNum = 1;

                        return acts.map((act, idx) => {
                          const cost = Number(act.cost) || 0;
                          catTotal += cost;
                          return (
                            <tr key={`${cat}-${act.id || idx}`} className={idx === acts.length - 1 ? "border-b border-gray-100" : "border-b border-gray-50"}>
                              <td className="py-2.5 px-3 text-gray-400 text-xs">{rowNum++}</td>
                              <td className="py-2.5 px-3 text-gray-500 text-xs capitalize">{cat}</td>
                              <td className="py-2.5 px-3 text-secondary font-medium">
                                <span>{act.name}</span>
                                {act.cityName && <span className="text-gray-400 text-xs ml-1">— {act.cityName}</span>}
                              </td>
                              <td className="py-2.5 px-3 text-right text-gray-600">1</td>
                              <td className="py-2.5 px-3 text-right text-gray-600">₹{cost.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-right text-secondary font-medium">₹{cost.toLocaleString()}</td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                    <tfoot>
                      {sortedCategories.map((cat) => {
                        const acts = grouped[cat];
                        const catTotal = acts.reduce((s, a) => s + (Number(a.cost) || 0), 0);
                        return (
                          <tr key={`sub-${cat}`} className="border-b border-gray-200">
                            <td colSpan={3} className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500">{CATEGORY_META[cat]?.icon || "📋"} {cat} Subtotal</td>
                            <td className="py-2.5 px-3 text-right text-xs text-gray-500">{acts.length}</td>
                            <td className="py-2.5 px-3" />
                            <td className="py-2.5 px-3 text-right text-sm font-bold text-secondary">₹{catTotal.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      <tr className="border-t-2 border-gray-300">
                        <td colSpan={4} className="py-4 px-3 text-right text-base font-bold text-secondary">Grand Total</td>
                        <td className="py-4 px-3" />
                        <td className="py-4 px-3 text-right text-xl font-bold text-primary">₹{grandTotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-2 px-3 text-right text-sm text-success font-semibold">Amount Paid</td>
                        <td className="py-2 px-3" />
                        <td className="py-2 px-3 text-right text-sm font-bold text-success">₹{paidTotal.toLocaleString()}</td>
                      </tr>
                      {unpaidTotal > 0 && (
                        <tr>
                          <td colSpan={4} className="py-2 px-3 text-right text-sm text-gray-400 font-semibold">Balance Due</td>
                          <td className="py-2 px-3" />
                          <td className="py-2 px-3 text-right text-sm font-bold text-gray-400">₹{unpaidTotal.toLocaleString()}</td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-8 md:px-12 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>✈️ Traveloop</span>
                <span className="w-px h-3 bg-gray-300" />
                <span>Generated {today}</span>
              </div>
              <p className="text-xs text-gray-400">This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
