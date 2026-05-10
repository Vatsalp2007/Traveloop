import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { where, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { getCollection, subscribeToCollection } from "../firebase/firestore";
import Spinner from "../components/common/Spinner";

const DESTINATIONS = [
  { name: "Mumbai", country: "India", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&h=400&fit=crop", gradient: "from-blue-600 to-purple-700" },
  { name: "Jaipur", country: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=400&fit=crop", gradient: "from-pink-600 to-rose-700" },
  { name: "Goa", country: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=400&fit=crop", gradient: "from-green-500 to-emerald-700" },
  { name: "Varanasi", country: "India", image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=400&h=400&fit=crop", gradient: "from-amber-600 to-orange-700" },
  { name: "Delhi", country: "India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=400&fit=crop", gradient: "from-red-600 to-yellow-700" },
  { name: "Udaipur", country: "India", image: "https://images.unsplash.com/photo-1568826742478-9909ea95ad88?w=400&h=400&fit=crop", gradient: "from-indigo-500 to-blue-700" },
];

const DEFAULT_COVER = "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800";

function TripCard({ trip }) {
  const startDate = trip.startDate?.toDate?.() || new Date(trip.startDate);
  const endDate = trip.endDate?.toDate?.() || new Date(trip.endDate);
  const dateStr = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " - " + endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const season = endDate.toLocaleDateString("en-US", { month: "long" });
  const cover = trip.coverPhoto || trip.coverPhotoURL || trip.imageURL || DEFAULT_COVER;

  return (
    <Link to={`/trips/${trip.id}`} className="block group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl cursor-pointer">
      <img
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        src={cover}
        alt={trip.name || "Trip"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
        <span className="bg-secondary-container text-on-secondary-fixed text-[11px] uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded-full w-fit mb-4">{season}</span>
        <h3 className="font-headline-md text-[32px] text-white mb-2 group-hover:text-secondary-fixed transition-colors">{trip.name || "Untitled Trip"}</h3>
        <p className="text-white/80 font-body-md text-lg">{dateStr}</p>
        <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mt-4">
          <span className="text-white font-bold flex items-center gap-2 border-b border-white/30 pb-1">
            View Trip <span className="inline-block ml-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function RegionCard({ dest, navigate }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative cursor-pointer">
      <div className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 relative">
        {imgError ? (
          <div className={`w-full h-full bg-gradient-to-br ${dest.gradient} flex items-center justify-center`}>
            <span className="text-5xl font-bold text-white/80 drop-shadow-lg">{dest.name.charAt(0)}</span>
          </div>
        ) : (
          <img
            src={dest.image}
            alt={dest.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold text-lg drop-shadow-lg">{dest.name}</p>
          <p className="text-white/80 text-sm">{dest.country}</p>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/trips/new"); }}
            className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Plan a Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [allTrips, setAllTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = userData?.displayName || user?.displayName || "Traveler";

  useEffect(() => {
    if (!user) {
      setLoadingTrips(false);
      return;
    }
    const unsub = subscribeToCollection("trips", [where("userId", "==", user.uid)], (data) => {
      const sorted = data.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      setAllTrips(sorted);
      setLoadingTrips(false);
    }, () => {
      setLoadingTrips(false);
    });
    return () => unsub();
  }, [user]);

  const recentTrips = allTrips.slice(0, 3);

  if (loadingTrips) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="pb-stack-lg">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden -mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover scale-105"
            alt="Hero"
            src="/background_dash.jpeg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.2)] to-[#f8f9fa]"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-[56px] md:text-[80px] leading-tight tracking-tight drop-shadow-2xl mb-6 font-bold">
            Explore Beyond, {displayName.split(" ")[0]}
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto opacity-95 drop-shadow-lg font-medium leading-relaxed">
            Discover legendary adventures curated for the modern traveler with Traveloop's reliable explorer toolkit.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/trips/new")}
              className="px-10 py-4 bg-white text-primary rounded-full font-bold shadow-xl transition-transform hover:-translate-y-1 cursor-pointer"
            >
              Plan a Trip
            </button>
            <button
              onClick={() => navigate("/trips")}
              className="px-10 py-4 bg-primary/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold transition-transform hover:-translate-y-1 cursor-pointer"
            >
              My Trips
            </button>
          </div>
        </div>
      </section>

      {/* Search & Controls */}
      <section className="w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="max-w-[1400px] mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-lg text-secondary"
              placeholder="Where do you want to go?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/community?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate("/trips/new")}
              className="flex-1 lg:flex-none px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all cursor-pointer"
            >
              Plan a Trip
            </button>
            <button
              onClick={() => navigate("/community")}
              className="flex-1 lg:flex-none px-8 py-4 bg-gray-100 text-secondary rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      {allTrips.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 mt-8">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-primary">{allTrips.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-primary">₹{allTrips.reduce((sum, t) => sum + (t.totalBudget || t.totalBudgetEstimate || 0), 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Cities Planned</p>
              <p className="text-3xl font-bold text-primary">{allTrips.reduce((sum, t) => sum + (t.cityCount || t.cities?.length || 0), 0)}</p>
            </div>
          </div>
        </section>
      )}

      {/* Top Regional Selections */}
      <section className="w-full px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[32px] text-primary font-bold mb-2">
                Top Destinations in India
              </h2>
              <p className="text-gray-500 text-lg">
                Most loved destinations across the country.
              </p>
            </div>
            <Link to="/community" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all duration-300 no-underline">
              View all <span className="inline-block ml-1">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS.map((dest) => <RegionCard key={dest.name} dest={dest} navigate={navigate} />)}
          </div>
        </div>
      </section>

      {/* Previous Trips */}
      <section className="w-full px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-[32px] text-primary font-bold mb-2">Previous Trips</h2>
              <p className="text-gray-500 text-lg">Your recent travel adventures.</p>
            </div>
            {recentTrips.length > 0 && (
              <Link to="/trips" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all duration-300 no-underline">
                View all <span className="inline-block ml-1">→</span>
              </Link>
            )}
          </div>
          {loadingTrips ? (
            <div className="flex justify-center py-8"><Spinner size={32} /></div>
          ) : recentTrips.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <div className="text-5xl mb-4">🌍</div>
              <p className="text-gray-500 text-lg mb-6">No trips yet. Plan your first adventure!</p>
              <button
                onClick={() => navigate("/trips/new")}
                className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Plan a Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
            </div>
          )}
        </div>
      </section>

      <div className="h-16"></div>

      {/* FAB for mobile */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <button
          onClick={() => navigate("/trips/new")}
          className="bg-primary text-white shadow-2xl w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
