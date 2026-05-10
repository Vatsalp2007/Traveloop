import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, getCollection } from "../firebase/firestore";
import ItineraryTimeline from "../components/trip/ItineraryTimeline";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

export default function PublicItineraryPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    const loadData = async () => {
      try {
        const tripData = await getDocument("trips", tripId);
        if (!tripData) {
          setTrip(null);
          setLoading(false);
          return;
        }
        setTrip(tripData);

        const stopsData = await getCollection(`trips/${tripId}/stops`);
        const sorted = stopsData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setStops(sorted);

        const activitiesMap = {};
        for (const stop of sorted) {
          const acts = await getCollection(`trips/${tripId}/stops/${stop.id}/activities`);
          activitiesMap[stop.id] = acts;
        }
        setActivities(activitiesMap);
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
      setLoading(false);
    };
    loadData();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-bg">
        <Spinner size={40} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-4">
        <p className="text-6xl mb-4">🗺️</p>
        <h1 className="text-2xl font-bold text-secondary mb-2">Trip Not Found</h1>
        <p className="text-gray-400 mb-6">This trip doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  function fmt(d) {
    if (!d) return "";
    const date = d.toDate ? d.toDate() : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative" />
          <div className="px-8 pb-8 -mt-8 relative z-10">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-secondary">{trip.name}</h1>
              {trip.startDate && (
                <p className="text-sm text-gray-500 mt-1">
                  {fmt(trip.startDate)}{trip.endDate ? ` - ${fmt(trip.endDate)}` : ""}
                </p>
              )}
            </div>
            {trip.description && (
              <p className="text-gray-600 leading-relaxed">{trip.description}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-secondary mb-6">Itinerary</h2>
          <ItineraryTimeline
            stops={stops}
            activities={activities}
            isReadOnly={true}
          />
        </div>
      </div>
    </div>
  );
}
