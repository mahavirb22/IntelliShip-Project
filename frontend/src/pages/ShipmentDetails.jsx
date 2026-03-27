import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Share2, Package } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";
import ToastContainer from "../components/ToastNotification";
import {
  addManualLog,
  getEvents,
  getShipment,
  markShipmentDelivered,
  startMonitoring,
  updateShipmentStatus,
} from "../services/api";
import { getShipmentHealthStatus } from "../utils/shipmentHealth";

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingMonitoring, setUpdatingMonitoring] = useState(false);
  const [manualLogText, setManualLogText] = useState("");
  const [nextStatus, setNextStatus] = useState("OUT_FOR_DELIVERY");
  const [addingManualLog, setAddingManualLog] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const {
    data: shipmentDataBundle,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["shipment", id],
    queryFn: async () => {
      const [shipmentResponse, eventsResponse] = await Promise.all([
        getShipment(id),
        getEvents(id),
      ]);

      return {
        shipmentData: shipmentResponse.data?.data || shipmentResponse.data,
        eventsData:
          eventsResponse.data?.data || eventsResponse.data?.events || [],
      };
    },
    staleTime: 10000,
    gcTime: 30000,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (!shipmentDataBundle) {
      return;
    }

    const shipmentPayload = shipmentDataBundle.shipmentData;
    const shipmentLogs = Array.isArray(shipmentPayload?.logs)
      ? [...shipmentPayload.logs].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        )
      : [];

    setShipment(shipmentPayload);
    setLogs(shipmentLogs);
    setEvents(
      Array.isArray(shipmentDataBundle.eventsData)
        ? shipmentDataBundle.eventsData
        : [],
    );
    setRefreshing(false);
  }, [shipmentDataBundle]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    addToast("Data refreshed successfully");
  };

  const handleShare = () => {
    const trackingUrl = `${window.location.origin}/track/${id}`;
    navigator.clipboard.writeText(trackingUrl);
    addToast("Tracking link copied to clipboard!");
  };

  const handleStartMonitoring = async () => {
    setUpdatingMonitoring(true);
    try {
      await startMonitoring(id);
      addToast("Monitoring started. Shipment is now in transit.");
      await refetch();
    } catch (error) {
      console.error("Start monitoring error:", error);
      addToast("Failed to start monitoring", "error");
    } finally {
      setUpdatingMonitoring(false);
    }
  };

  const submitManualLog = async (message) => {
    if (!message.trim()) return;
    setAddingManualLog(true);
    try {
      await addManualLog({ shipment_id: id, message: message.trim() });
      setManualLogText("");
      addToast("Manual log added");
      await refetch();
    } catch (error) {
      console.error("Manual log error:", error);
      addToast("Failed to add manual log", "error");
    } finally {
      setAddingManualLog(false);
    }
  };

  const submitStatusUpdate = async () => {
    try {
      if (nextStatus === "DELIVERED") {
        await markShipmentDelivered(id);
      } else {
        await updateShipmentStatus(id, { status: nextStatus });
      }
      addToast(`Shipment updated to ${nextStatus}`);
      await refetch();
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to update status",
        "error",
      );
    }
  };

  const resolvedHealthStatus = getShipmentHealthStatus({
    shipment,
    events,
    logs,
  });
  const verificationStatus = shipment?.verificationStatus || "PENDING";
  const isDeviceReleased = Boolean(!shipment?.active && !shipment?.device_id);

  if (isLoading && !shipment) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
          <Sidebar />
          <div className="flex-1 w-full min-w-0 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto mt-12 lg:mt-0 space-y-4">
              <div className="h-10 w-56 rounded-lg bg-slate-200/70 animate-pulse" />
              <div className="h-40 rounded-2xl bg-slate-200/70 animate-pulse" />
              <div className="h-64 rounded-2xl bg-slate-200/70 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto mt-12 lg:mt-0">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate("/dashboard/shipments")}
                className="btn-secondary mb-4 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back to Shipments
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 font-display gradient-text">
                    {shipment?.product_name}
                  </h1>
                  <p className="text-on-surface-variant">ID: {id}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing || isFetching}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw
                      size={20}
                      className={refreshing || isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Status Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`glass-card mb-8 text-center py-12 ${
                resolvedHealthStatus === "DAMAGED"
                  ? "animate-pulse-glow border-severe/50"
                  : ""
              }`}
            >
              <div className="mb-6">
                <Package size={64} className="mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2 font-display">
                  Current Status
                </h2>
              </div>
              <StatusBadge status={resolvedHealthStatus} size="lg" animate />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <StatusBadge status={shipment?.status} size="sm" />
                <StatusBadge status={verificationStatus} size="sm" />
              </div>

              {!shipment?.monitoring_started && (
                <button
                  onClick={handleStartMonitoring}
                  disabled={updatingMonitoring}
                  className="btn-primary mt-6 disabled:opacity-60"
                >
                  {updatingMonitoring
                    ? "Starting Monitoring..."
                    : "Start Monitoring"}
                </button>
              )}

              {resolvedHealthStatus === "DAMAGED" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-severe font-medium"
                >
                  ⚠️ Immediate attention required!
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
              className="glass-card mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">
                Update Lifecycle Status
              </h2>
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  className="input-field flex-1"
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                >
                  <option value="PACKED">PACKED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
                <button onClick={submitStatusUpdate} className="btn-primary">
                  Update Status
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">
                Add Delivery Update
              </h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={manualLogText}
                  onChange={(e) => setManualLogText(e.target.value)}
                  placeholder="Example: Out for Delivery"
                  className="input-field flex-1"
                />
                <button
                  onClick={() => submitManualLog(manualLogText)}
                  disabled={addingManualLog || !manualLogText.trim()}
                  className="btn-primary disabled:opacity-60"
                >
                  {addingManualLog ? "Adding..." : "Add Log"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Reached Hub",
                  "Handed to Delivery Partner",
                  "Out for Delivery",
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => submitManualLog(preset)}
                    disabled={addingManualLog}
                    className="btn-secondary text-sm"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Shipment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">
                Shipment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Customer Name
                  </p>
                  <p className="font-medium text-lg">
                    {shipment?.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Fragility Level
                  </p>
                  <p className="font-medium text-lg">
                    {shipment?.fragility_level}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Total Events
                  </p>
                  <p className="font-medium text-lg">{events.length}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Tracking URL
                  </p>
                  <p className="font-medium text-sm text-primary truncate">
                    {window.location.origin}/track/{id}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Delivered At
                  </p>
                  <p className="font-medium text-lg">
                    {shipment?.deliveredAt
                      ? new Date(shipment.deliveredAt).toLocaleString()
                      : "Not Delivered Yet"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Verification Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={verificationStatus} size="sm" />
                  </div>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm">
                    Device Released
                  </p>
                  <p className="font-medium text-lg">
                    {isDeviceReleased ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 font-display">
                Shipment Timeline
              </h2>
              <Timeline logs={logs} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShipmentDetails;
