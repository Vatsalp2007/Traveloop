import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTrip } from "../hooks/useTrip";
import { fileToDataURL } from "../firebase/storage";
import suggestions from "../data/suggestions";
import { loadCountries } from "../firebase/dataService";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTrip } = useTrip();

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budgetLimit: "",
    countries: [],
  });
  const [countries, setCountries] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { loadCountries().then(setCountries); }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleCover(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Trip name is required";
    if (form.name.length > 60) errs.name = "Max 60 characters";
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      errs.endDate = "End date must be after start date";
    }
    if (form.budgetLimit && (isNaN(form.budgetLimit) || Number(form.budgetLimit) < 0)) {
      errs.budgetLimit = "Enter a valid budget amount";
    }
    if (form.countries.length === 0) {
      errs.countries = "Select at least one country";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let coverPhoto = "";
      if (coverFile) {
        if (coverFile.size > 5 * 1024 * 1024) {
          setErrors({ submit: "Cover photo must be under 5MB" });
          setLoading(false);
          return;
        }
        coverPhoto = await fileToDataURL(coverFile);
      }
      const tripId = await createTrip({
        userId: user.uid,
        name: form.name.trim(),
        description: form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        coverPhoto,
        cities: [],
        totalBudget: 0,
        budgetLimit: form.budgetLimit ? Number(form.budgetLimit) : 0,
        isPublic: false,
        cityCount: 0,
        countries: form.countries,
      });
      navigate(`/trips/${tripId}/edit`);
    } catch (err) {
      console.error("Create trip error:", err);
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => navigate("/trips")}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Trips
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h1 className="text-xl font-semibold text-secondary">Trip Details</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Trip Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Summer in Europe"
                required
                maxLength={60}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-primary/50 focus:border-primary sm:text-sm transition-colors bg-white text-secondary"
              />
              {errors.name && <p className="text-sm text-danger">{errors.name}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Tell us about your trip..."
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-primary/50 focus:border-primary sm:text-sm transition-colors bg-white text-secondary resize-vertical"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Trip Budget (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="number"
                  value={form.budgetLimit}
                  onChange={(e) => handleChange("budgetLimit", e.target.value)}
                  placeholder="e.g. 5000"
                  min="0"
                  className="pl-10 w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-primary/50 focus:border-primary sm:text-sm transition-colors bg-white text-secondary"
                />
              </div>
              {errors.budgetLimit && <p className="text-sm text-danger">{errors.budgetLimit}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Select Countries</label>
              <div className="flex flex-wrap gap-2">
                {countries.map((c) => {
                  const selected = form.countries.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? form.countries.filter((n) => n !== c.name)
                          : [...form.countries, c.name];
                        handleChange("countries", next);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                        selected
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-secondary border-slate-300 hover:border-primary/50"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
              {errors.countries && <p className="text-sm text-danger">{errors.countries}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  min={today}
                  className="pl-10 w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-primary/50 focus:border-primary sm:text-sm transition-colors bg-white text-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  min={form.startDate || today}
                  className="pl-10 w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-primary/50 focus:border-primary sm:text-sm transition-colors bg-white text-secondary"
                />
              </div>
              {errors.endDate && <p className="text-sm text-danger">{errors.endDate}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Cover Photo</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-secondary hover:bg-slate-50 cursor-pointer transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose Photo
                  <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
                </label>
                {coverFile && (
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="text-sm text-danger hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {coverPreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-w-xs">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4 flex justify-end border-t border-slate-100 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white font-medium py-2.5 px-6 rounded-lg shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {loading ? "Creating Trip..." : "Create Trip"}
              </button>
            </div>

            {errors.submit && (
              <p className="text-sm text-danger bg-danger/10 rounded-lg p-3 md:col-span-2">{errors.submit}</p>
            )}
          </form>
        </div>

        {/* Suggestions Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary">Suggestions for Places to Visit / Activities to Perform</h2>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors cursor-pointer"
            >
              Refresh Suggestions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="h-48 bg-slate-200 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-sm text-primary font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location}
                  </div>
                  <h3 className="font-semibold text-lg text-secondary mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
