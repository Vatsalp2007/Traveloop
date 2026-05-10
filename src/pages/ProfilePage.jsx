import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, updateDoc, deleteDoc, serverTimestamp, where } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { fileToDataURL } from "../firebase/storage";
import { db } from "../firebase/config";
import { subscribeToCollection } from "../firebase/firestore";
import Spinner from "../components/common/Spinner";

const PREPLANNED = [
  { name: "European Summer Tour", description: "A 3-week journey through France, Italy, and Spain. Exploring historic sites and culinary delights.", image: "" },
  { name: "Tokyo City Breaks", description: "A fast-paced itinerary covering the best of Tokyo's districts, from Shinjuku to Akihabara.", image: "" },
  { name: "Patagonia Trek", description: "An adventurous hiking trip through the stunning landscapes of Chilean Patagonia.", image: "" },
];

const DEFAULT_COVER = "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=400";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [trips, setTrips] = useState([]);
  const [editing, setEditing] = useState(false);

  const loading = user && !userData;

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToCollection("trips", [where("userId", "==", user.uid)], (data) => {
      const sorted = data.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      setTrips(sorted);
    });
    return () => unsub();
  }, [user]);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Photo must be under 2MB" });
      return;
    }
    setUploading(true);
    setMessage({ type: "", text: "" });
    try {
      const dataUrl = await fileToDataURL(file);
      setPhotoURL(dataUrl);
      setUploading(false);
      setMessage({ type: "success", text: "Photo loaded. Save changes to apply." });
    } catch {
      setUploading(false);
      setMessage({ type: "error", text: "Failed to read photo" });
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name.trim(),
        photoURL: photoURL || "",
        location: location.trim(),
        bio: bio.trim(),
        updatedAt: serverTimestamp(),
      });
      if (user.displayName !== name.trim()) {
        await user.updateProfile({ displayName: name.trim() });
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setMessage({ type: "error", text: "Logout failed" });
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete" });
    }
  }

  function formatDate(d) {
    if (!d) return "";
    const date = d.toDate ? d.toDate() : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getCover(trip) {
    return trip.coverPhoto || trip.coverPhotoURL || trip.imageURL || DEFAULT_COVER;
  }

  const getInitials = (n) => {
    if (!n) return "?";
    return n.split(" ").map((s) => s[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {message.text && (
        <div className={`text-sm rounded-lg p-4 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* User Details Section */}
      <section className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center mx-auto md:mx-0 relative">
          {(editing ? photoURL : (userData?.photoURL || user.photoURL)) ? (
            <img src={editing ? photoURL : (userData?.photoURL || user.photoURL)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-gray-400">{getInitials(userData?.displayName || user.displayName)}</span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <Spinner size={24} />
            </div>
          )}
        </div>
        <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={() => {
                if (editing) {
                  setEditing(false);
                } else {
                  setName(userData?.displayName || user.displayName || "");
                  setEmail(userData?.email || user.email || "");
                  setPhotoURL(userData?.photoURL || user.photoURL || "");
                  setLocation(userData?.location || "");
                  setBio(userData?.bio || "");
                  setEditing(true);
                }
              }}
              className="text-sm font-medium text-primary hover:text-blue-800 transition-colors cursor-pointer"
            >
              {editing ? "Cancel" : "Edit Details"}
            </button>
          </div>
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-900 text-lg py-2">{email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900"
                />
              </div>
              <div className="flex items-end gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 resize-vertical"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-gray-900 text-lg">{userData?.displayName || user.displayName || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-900 text-lg">{userData?.email || user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                <p className="text-gray-900 text-lg">{userData?.location || "Not set"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                <p className="text-gray-700 leading-relaxed">{userData?.bio || "No bio yet."}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Preplanned Trips Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Preplanned Trips</h3>
          <Link to="/trips" className="text-sm font-medium text-primary hover:text-blue-800 transition-colors no-underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREPLANNED.map((trip, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-gray-400 overflow-hidden">
                {trip.image ? (
                  <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl block mb-2">✈️</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{trip.name}</h4>
                <p className="text-gray-600 text-sm flex-grow mb-4">{trip.description}</p>
                <button
                  onClick={() => navigate("/trips/new")}
                  className="w-full py-2.5 px-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  Create This Trip
                </button>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl block mb-2 text-gray-300">+</span>
                <p className="text-sm text-gray-400">Custom Trip</p>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col items-center justify-center">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Create Your Own</h4>
              <p className="text-gray-600 text-sm text-center mb-4">Design a trip from scratch</p>
              <button
                onClick={() => navigate("/trips/new")}
                className="w-full py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium cursor-pointer"
              >
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Trips Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Previous Trips</h3>
          <Link to="/trips" className="text-sm font-medium text-primary hover:text-blue-800 transition-colors no-underline">View History</Link>
        </div>
        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <p className="text-gray-500 text-lg mb-6">No trips planned yet. Start your adventure!</p>
            <button
              onClick={() => navigate("/trips/new")}
              className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const endYr = trip.endDate?.toDate?.()?.getFullYear() || new Date(trip.endDate).getFullYear() || "";
              return (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col relative hover:shadow-md transition-shadow group no-underline"
                >
                  {endYr && (
                    <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200 z-10">
                      Completed {endYr}
                    </span>
                  )}
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img src={getCover(trip)} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{trip.name || "Untitled Trip"}</h4>
                    <p className="text-gray-600 text-sm flex-grow mb-4">
                      {trip.startDate && trip.endDate
                        ? `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`
                        : "No dates set"}
                    </p>
                    <span className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center block">
                      View Memories
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Account Actions */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Account</h3>
            <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Log Out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
