import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";

export default function MyTripsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribeToTrips, deleteTrip } = useTrip();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minCities, setMinCities] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToTrips(user.uid, (data) => {
      const filtered = data.filter((t) => t.userId === user.uid);
      setTrips(filtered);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTrip(deleteTarget);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = trips.filter((t) => {
    const nameMatch = !search || t.name?.toLowerCase().includes(search.toLowerCase());
    let dateMatch = true;
    if (dateFrom) {
      const tripStart = t.startDate?.toDate?.() || new Date(t.startDate);
      dateMatch = tripStart >= new Date(dateFrom);
    }
    if (dateMatch && dateTo) {
      const tripEnd = t.endDate?.toDate?.() || new Date(t.endDate);
      dateMatch = tripEnd <= new Date(dateTo);
    }
    const cityCount = t.cityCount || t.cities?.length || 0;
    const citiesMatch = !minCities || cityCount >= parseInt(minCities);
    return nameMatch && dateMatch && citiesMatch;
  });

  function formatDate(d) {
    if (!d) return "";
    const date = d.toDate ? d.toDate() : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getGradient(i) {
    const gradients = [
      "from-primary to-primary-dark",
      "from-blue-400 to-blue-600",
      "from-green-400 to-emerald-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-rose-600",
      "from-teal-400 to-cyan-600",
    ];
    return gradients[i % gradients.length];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-secondary">My Trips</h1>
          <Button onClick={() => navigate("/trips/new")}>
            + Plan New Trip
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors cursor-pointer ${
              showFilters ? "bg-primary text-white border-primary" : "bg-white text-secondary border-gray-300 hover:border-primary/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">To Date</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Min Cities</label>
              <input type="number" min="0" value={minCities} onChange={(e) => setMinCities(e.target.value)} placeholder="Any"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button onClick={() => { setDateFrom(""); setDateTo(""); setMinCities(""); }}
              className="text-sm text-primary hover:text-primary-dark cursor-pointer">Clear all</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🧳</div>
            <h2 className="text-xl font-semibold text-secondary mb-2">No trips found!</h2>
            <p className="text-gray-500 mb-6">
              {trips.length === 0 ? "Create your first trip and start exploring" : "Try adjusting your filters"}
            </p>
            <Button onClick={() => navigate("/trips/new")}>Create Your First Trip</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trip, i) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-sm group relative hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <Link to={`/trips/${trip.id}`} className="block relative overflow-hidden rounded-t-2xl">
                  {trip.coverPhoto ? (
                    <div className="h-44 overflow-hidden">
                      <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className={`h-44 bg-gradient-to-br ${getGradient(i)} flex items-center justify-center`}>
                      <span className="text-5xl">✈️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/trips/${trip.id}`} className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-secondary truncate group-hover:text-primary transition-colors">{trip.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget(trip.id); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete trip"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenu(openMenu === trip.id ? null : trip.id); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openMenu === trip.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                              <Link to={`/trips/${trip.id}`} className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50" onClick={() => setOpenMenu(null)}>View</Link>
                              <Link to={`/trips/${trip.id}/edit`} className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50" onClick={() => setOpenMenu(null)}>Edit</Link>
                              <Link to={`/trips/${trip.id}/notes`} className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50" onClick={() => setOpenMenu(null)}>📓 Notes</Link>
                              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/trip/${trip.id}`); setOpenMenu(null); setToast("Link copied!"); setTimeout(() => setToast(null), 2000); }} className="block w-full text-left px-4 py-2 text-sm text-secondary hover:bg-gray-50 cursor-pointer">Share</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {(trip.startDate || trip.endDate) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                  )}

                  {trip.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{trip.description}</p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {trip.cityCount || 0} cities
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ₹{trip.totalBudget || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-secondary text-white shadow-lg rounded-xl px-5 py-3 text-sm font-medium animate-slide-in">
          {toast}
        </div>
      )}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Trip" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this trip? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
