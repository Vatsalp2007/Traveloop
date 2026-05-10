# Traveloop

A travel planning web app for Indian users with budget management, notes system, and shareable itineraries.

## Features

- **Trip Planning** — Create trips with multiple stops, add activities per stop
- **Budget Management** — Track costs by city/category, mark expenses as paid, set budget limits
- **Notes System** — Add notes to any trip stop, search/filter/sort across all notes
- **Itinerary Views** — List and calendar views for trip itinerary
- **Invoice** — Generate and print trip expense invoices
- **Admin Panel** — Manage countries, cities, and activities data
- **Authentication** — Email/password and Google sign-in via Firebase Auth

## Tech Stack

- React (Vite)
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- React Router

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Admin Access

Click **Admin Login** on the login page (top-right corner).

- Email: `panchasarav2007@gmail.com`
- Password: `Vatsal@2007`

## Project Structure

```
src/
  pages/        — Page components (Login, Dashboard, Trips, Budget, etc.)
  components/   — Reusable UI components
  hooks/        — Custom React hooks (useAuth, useTrip, useStops)
  firebase/     — Firebase config, auth, firestore utilities, data service
  data/         — Static seed data (countries, cities, activities)
  context/      — React context providers (AuthContext)
```

## Data Flow

Admin CRUD changes are stored in localStorage and synced across pages. Static seed data is used as fallback when Firebase Firestore is unavailable.

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginPage | Sign in page |
| `/signup` | SignupPage | Create account |
| `/` | DashboardPage | Home dashboard |
| `/trips` | MyTripsPage | Your trips list |
| `/trips/new` | CreateTripPage | New trip form |
| `/trips/:id` | ItineraryViewPage | Trip itinerary |
| `/trips/:id/edit` | ItineraryBuilderPage | Edit trip stops/activities |
| `/trips/:id/budget` | BudgetPage | Per-trip budget |
| `/trips/:id/notes` | NotesPage | Trip notes |
| `/trips/:id/invoice` | ExpenseInvoicePage | Trip invoice |
| `/my-budget` | MyBudgetPage | All trips budget overview |
| `/admin` | AdminPage | Data management panel |
| `/trip/:id` | PublicItineraryPage | Shared trip view |
