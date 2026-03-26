import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateShipment = lazy(() => import("./pages/CreateShipment"));
const Shipments = lazy(() => import("./pages/Shipments"));
const ShipmentDetails = lazy(() => import("./pages/ShipmentDetails"));
const TrackShipment = lazy(() => import("./pages/TrackShipment"));

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen bg-surface p-6">
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="h-10 w-1/3 bg-slate-200/70 animate-pulse rounded-lg" />
              <div className="h-40 bg-slate-200/70 animate-pulse rounded-2xl" />
              <div className="h-24 bg-slate-200/70 animate-pulse rounded-2xl" />
            </div>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/track" element={<TrackShipment />} />
            <Route path="/track/:shipment_id" element={<TrackShipment />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create"
              element={
                <ProtectedRoute>
                  <CreateShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/shipments"
              element={
                <ProtectedRoute>
                  <Shipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/shipments/:id"
              element={
                <ProtectedRoute>
                  <ShipmentDetails />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Router>
  );
}

export default App;
