import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCountry, updateCountry, deleteCountry, addCity, updateCity, deleteCity, addActivity, updateActivity, deleteActivity, saveCountries, saveCities, saveActivities } from "../firebase/dataService";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import staticCountries from "../data/countries";
import staticCities from "../data/cities";
import staticActivities from "../data/activities";

function CountryForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const handleSubmit = (e) => { e.preventDefault(); if (name.trim()) onSave({ name: name.trim(), cities: initial?.cities || [] }); };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Country name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">{initial ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
}

function CityForm({ countries, initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [country, setCountry] = useState(initial?.country || (countries[0]?.name || ""));
  const [region, setRegion] = useState(initial?.region || "Asia");
  const [costIndex, setCostIndex] = useState(initial?.costIndex || 1);
  const [description, setDescription] = useState(initial?.description || "");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !country.trim()) return;
    onSave({ name: name.trim(), country: country.trim(), region, costIndex: Number(costIndex), popularityScore: initial?.popularityScore || 80, imageURL: initial?.imageURL || "", tags: initial?.tags || [], description: description.trim() });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="City name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required />
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
        {countries.map((c) => <option key={c.name || c.id} value={c.name}>{c.name}</option>)}
      </select>
      <div className="flex gap-3">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
          {["Asia", "Europe", "North America", "South America", "Africa", "Oceania"].map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={costIndex} onChange={(e) => setCostIndex(e.target.value)} className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" rows={2} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">{initial ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
}

function ActivityForm({ cities, initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [city, setCity] = useState(initial?.city || (cities[0]?.name || ""));
  const [type, setType] = useState(initial?.type || "sightseeing");
  const [cost, setCost] = useState(initial?.cost || 0);
  const [duration, setDuration] = useState(initial?.duration || 60);
  const [description, setDescription] = useState(initial?.description || "");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;
    onSave({ city: city.trim(), name: name.trim(), type, cost: Number(cost), duration: Number(duration), description: description.trim(), rating: initial?.rating || 4 });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Activity name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" required />
      <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
        {cities.map((c) => <option key={c.name || c.id} value={c.name}>{c.name}</option>)}
      </select>
      <div className="flex gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
          {["sightseeing", "food", "adventure", "shopping"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost ₹" className="w-28 px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Min" className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" rows={2} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">{initial ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("countries");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formCountry, setFormCountry] = useState(null);
  const [formCity, setFormCity] = useState(null);
  const [formActivity, setFormActivity] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      navigate("/login");
      return;
    }
    setCountries(staticCountries);
    setCities(staticCities);
    setActivities(staticActivities);
    setLoading(false);
  }, []);

  useEffect(() => { saveCountries(countries); }, [countries]);
  useEffect(() => { saveCities(cities); }, [cities]);
  useEffect(() => { saveActivities(activities); }, [activities]);

  function handleLogout() { localStorage.removeItem("admin_auth"); navigate("/login"); }

  const filteredCountries = countries.filter((c) => !search || c.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredCities = cities.filter((c) => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.country?.toLowerCase().includes(search.toLowerCase()));
  const filteredActivities = activities.filter((a) => !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.city?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-secondary">Admin Panel</h1>
            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">panchasarav2007@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary">Dashboard</Link>
            <button onClick={handleLogout} className="text-sm text-danger hover:text-danger/80 cursor-pointer">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["countries", "cities", "activities"].map((t) => (
              <button key={t} onClick={() => { setTab(t); setSearch(""); }} className={`flex-1 py-3.5 text-sm font-medium cursor-pointer transition-colors ${tab === t ? "text-primary border-b-2 border-primary bg-primary/5" : "text-gray-500 hover:text-gray-700"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)} ({t === "countries" ? countries.length : t === "cities" ? cities.length : activities.length})
              </button>
            ))}
          </div>

          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <Button onClick={() => { if (tab === "countries") setFormCountry(true); else if (tab === "cities") setFormCity(true); else setFormActivity(true); }} size="sm">
                + Add {tab.slice(0, -1)}
              </Button>
            </div>

            {tab === "countries" && (
              <div className="space-y-2">
                {filteredCountries.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No countries found</p>}
                {filteredCountries.map((c) => (
                  <div key={c.id || c.name} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                    {formCountry === c ? (
                      <CountryForm initial={c} onSave={(d) => { if (c.id) updateCountry(c.id, d).catch(() => {}); setCountries((p) => p.map((x) => x === c ? { ...x, ...d } : x)); setFormCountry(null); }} onCancel={() => setFormCountry(null)} />
                    ) : (
                      <>
                        <span className="text-sm font-medium text-secondary">{c.name}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setFormCountry(c)} className="text-xs text-primary hover:underline cursor-pointer">Edit</button>
                          <button onClick={() => { if (confirm(`Delete ${c.name}?`)) { if (c.id) deleteCountry(c.id).catch(() => {}); setCountries((p) => p.filter((x) => x !== c)); } }} className="text-xs text-danger hover:underline cursor-pointer">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {formCountry === true && (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <CountryForm onSave={(d) => { addCountry(d).then((id) => setCountries((p) => [...p, { ...d, id }])).catch(() => setCountries((p) => [...p, d])); setFormCountry(null); }} onCancel={() => setFormCountry(null)} />
                  </div>
                )}
              </div>
            )}

            {tab === "cities" && (
              <div className="space-y-2">
                {filteredCities.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No cities found</p>}
                {filteredCities.map((c) => (
                  <div key={c.id || c.name} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                    {formCity === c ? (
                      <CityForm countries={countries} initial={c} onSave={(d) => { if (c.id) updateCity(c.id, d).catch(() => {}); setCities((p) => p.map((x) => x === c ? { ...x, ...d } : x)); setFormCity(null); }} onCancel={() => setFormCity(null)} />
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-secondary">{c.name}</span>
                          <span className="text-xs text-gray-400">{c.country}</span>
                          <span className="text-xs text-gray-400">₹{c.costIndex}/5</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setFormCity(c)} className="text-xs text-primary hover:underline cursor-pointer">Edit</button>
                          <button onClick={() => { if (confirm(`Delete ${c.name}?`)) { if (c.id) deleteCity(c.id).catch(() => {}); setCities((p) => p.filter((x) => x !== c)); } }} className="text-xs text-danger hover:underline cursor-pointer">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {formCity === true && (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <CityForm countries={countries} onSave={(d) => { addCity(d).then((id) => setCities((p) => [...p, { ...d, id }])).catch(() => setCities((p) => [...p, d])); setFormCity(null); }} onCancel={() => setFormCity(null)} />
                  </div>
                )}
              </div>
            )}

            {tab === "activities" && (
              <div className="space-y-2">
                {filteredActivities.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No activities found</p>}
                {filteredActivities.map((a) => (
                  <div key={a.id || a.city + a.name} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                    {formActivity === a ? (
                      <ActivityForm cities={cities} initial={a} onSave={(d) => { if (a.id) updateActivity(a.id, d).catch(() => {}); setActivities((p) => p.map((x) => x === a ? { ...x, ...d } : x)); setFormActivity(null); }} onCancel={() => setFormActivity(null)} />
                    ) : (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-medium text-secondary truncate">{a.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">{a.city}</span>
                          <span className="text-xs text-gray-400 shrink-0">{a.type}</span>
                          <span className="text-xs font-medium text-primary shrink-0">₹{a.cost}</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setFormActivity(a)} className="text-xs text-primary hover:underline cursor-pointer">Edit</button>
                          <button onClick={() => { if (confirm(`Delete ${a.name}?`)) { if (a.id) deleteActivity(a.id).catch(() => {}); setActivities((p) => p.filter((x) => x !== a)); } }} className="text-xs text-danger hover:underline cursor-pointer">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {formActivity === true && (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <ActivityForm cities={cities} onSave={(d) => { addActivity(d).then((id) => setActivities((p) => [...p, { ...d, id }])).catch(() => setActivities((p) => [...p, d])); setFormActivity(null); }} onCancel={() => setFormActivity(null)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
