import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCollection } from "../firebase/firestore";
import Spinner from "../components/common/Spinner";

const CATEGORIES = ["All", "Adventure", "Relaxation", "Cultural", "Food", "Budget"];

const DESTINATIONS = [
  { name: "Paris", country: "France", image: "🇫🇷", gradient: "from-blue-400 to-purple-600" },
  { name: "Tokyo", country: "Japan", image: "🇯🇵", gradient: "from-red-400 to-orange-600" },
  { name: "Bali", country: "Indonesia", image: "🇮🇩", gradient: "from-green-400 to-emerald-600" },
  { name: "New York", country: "USA", image: "🇺🇸", gradient: "from-indigo-400 to-blue-600" },
  { name: "Barcelona", country: "Spain", image: "🇪🇸", gradient: "from-yellow-400 to-red-600" },
  { name: "Sydney", country: "Australia", image: "🇦🇺", gradient: "from-teal-400 to-cyan-600" },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [publicTrips, setPublicTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function load() {
      try {
        const allTrips = await getCollection("trips", []);
        const publicOnes = allTrips
          .filter((t) => t.isPublic && t.id !== "stats")
          .filter((t) => !t.userId || t.userId !== user?.uid);
        setPublicTrips(publicOnes);
      } catch (err) {
        console.error("Failed to load community trips:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

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

  const filtered = publicTrips
    .filter((t) => !search || t.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest") {
        const aT = a.createdAt?.toDate?.()?.getTime() || 0;
        const bT = b.createdAt?.toDate?.()?.getTime() || 0;
        return bT - aT;
      }
      if (sortBy === "budget") return (b.totalBudget || 0) - (a.totalBudget || 0);
      if (sortBy === "cities") return (b.cityCount || 0) - (a.cityCount || 0);
      return 0;
    });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Community</h1>
          <p className="text-gray-500">Discover trips from fellow travelers around the world</p>
        </div>



        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="budget">Highest Budget</option>
            <option value="cities">Most Cities</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-secondary border border-gray-200 hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-xl font-semibold text-secondary mb-2">No trips in the community yet</h2>
            <p className="text-gray-500 mb-6">
              Be the first to share your adventure! Make your trip public to inspire others.
            </p>
            <button
              onClick={() => navigate("/trips")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Go to My Trips
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trip, i) => (
              <Link
                key={trip.id}
                to={`/trip/${trip.id}`}
                className="bg-white rounded-2xl shadow-sm overflow-hidden group block no-underline"
              >
                {trip.coverPhoto ? (
                  <div className="h-44 overflow-hidden">
                    <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className={`h-44 bg-gradient-to-br ${getGradient(i)} flex items-center justify-center`}>
                    <span className="text-5xl">✈️</span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-secondary truncate">{trip.name}</h3>
                  {trip.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{trip.description}</p>
                  )}
                  {(trip.startDate || trip.endDate) && (
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
