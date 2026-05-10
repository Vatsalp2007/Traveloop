import { getCollection, createDocument, updateDocument, deleteDocument } from "./firestore";
import staticCountries from "../data/countries";
import staticCities from "../data/cities";
import staticActivities from "../data/activities";

const LS_KEYS = { countries: "admin_data_countries", cities: "admin_data_cities", activities: "admin_data_activities" };

function lsGet(key) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; } catch { return null; }
}
function lsSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export async function loadCountries() {
  const cached = lsGet(LS_KEYS.countries);
  if (cached) return cached;
  try {
    const fb = await getCollection("admin_countries");
    if (fb && fb.length > 0) { lsSet(LS_KEYS.countries, fb); return fb; }
  } catch {}
  return staticCountries;
}

export async function loadCities() {
  const cached = lsGet(LS_KEYS.cities);
  if (cached) return cached;
  try {
    const fb = await getCollection("admin_cities");
    if (fb && fb.length > 0) { lsSet(LS_KEYS.cities, fb); return fb; }
  } catch {}
  return staticCities;
}

export async function loadActivities() {
  const cached = lsGet(LS_KEYS.activities);
  if (cached) return cached;
  try {
    const fb = await getCollection("admin_activities");
    if (fb && fb.length > 0) { lsSet(LS_KEYS.activities, fb); return fb; }
  } catch {}
  return staticActivities;
}

export function saveCountries(data) { lsSet(LS_KEYS.countries, data); }
export function saveCities(data) { lsSet(LS_KEYS.cities, data); }
export function saveActivities(data) { lsSet(LS_KEYS.activities, data); }

export async function seedStaticData() {
  try {
    const existing = await getCollection("admin_countries");
    if (existing && existing.length > 0) return;
  } catch { return; }
  for (const c of staticCountries) { try { await createDocument("admin_countries", c); } catch {} }
  for (const c of staticCities) { try { await createDocument("admin_cities", c); } catch {} }
  for (const a of staticActivities) { try { await createDocument("admin_activities", a); } catch {} }
}

export async function addCountry(data) { return await createDocument("admin_countries", data); }
export async function updateCountry(id, data) { await updateDocument("admin_countries", id, data); }
export async function deleteCountry(id) { await deleteDocument("admin_countries", id); }
export async function addCity(data) { return await createDocument("admin_cities", data); }
export async function updateCity(id, data) { await updateDocument("admin_cities", id, data); }
export async function deleteCity(id) { await deleteDocument("admin_cities", id); }
export async function addActivity(data) { return await createDocument("admin_activities", data); }
export async function updateActivity(id, data) { await updateDocument("admin_activities", id, data); }
export async function deleteActivity(id) { await deleteDocument("admin_activities", id); }
