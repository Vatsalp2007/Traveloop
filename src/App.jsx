import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const CreateTripPage = lazy(() => import("./pages/CreateTripPage"));
const MyTripsPage = lazy(() => import("./pages/MyTripsPage"));
const ItineraryViewPage = lazy(() => import("./pages/ItineraryViewPage"));
const ItineraryBuilderPage = lazy(() => import("./pages/ItineraryBuilderPage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const ChecklistPage = lazy(() => import("./pages/ChecklistPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const PublicItineraryPage = lazy(() => import("./pages/PublicItineraryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ExpenseInvoicePage = lazy(() => import("./pages/ExpenseInvoicePage"));
const MyBudgetPage = lazy(() => import("./pages/MyBudgetPage"));
const Layout = lazy(() => import("./components/Layout"));

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LoadingFallback() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#F8F9FA",
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: "4px solid #E0E0E0",
        borderTop: "4px solid #F5A623",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/trips/new" element={<CreateTripPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/trips/:tripId" element={<ItineraryViewPage />} />
          <Route path="/trips/:tripId/edit" element={<ItineraryBuilderPage />} />
          <Route path="/trips/:tripId/budget" element={<BudgetPage />} />
          <Route path="/trips/:tripId/checklist" element={<ChecklistPage />} />
          <Route path="/trips/:tripId/notes" element={<NotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-budget" element={<MyBudgetPage />} />
          <Route path="/trips/:tripId/invoice" element={<ExpenseInvoicePage />} />
        </Route>
        <Route path="/trip/:tripId" element={<PublicItineraryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
