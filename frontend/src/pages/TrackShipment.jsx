import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";
import ComplaintModal from "../components/ComplaintModal";
import ToastContainer from "../components/ToastNotification";
import {
  createComplaint,
  getShipment,
  trackShipmentSecure,
} from "../services/api";

const TrackShipment = () => {
  const { shipment_id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefilledId = shipment_id || searchParams.get("shipmentId") || "";

  const [form, setForm] = useState({
    shipment_id: prefilledId,
    mobile: "",
  });

  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(Boolean(prefilledId));
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const normalizedTimeline = useMemo(() => {
    const baseLogs = Array.isArray(logs) ? [...logs] : [];
    const statusHistoryLogs = Array.isArray(shipment?.statusHistory)
      ? shipment.statusHistory.map((entry) => ({
          timestamp: entry.timestamp,
          type: "SYSTEM",
          message: entry.location
            ? `${entry.status} at ${entry.location}`
            : `${entry.status}`,
        }))
      : [];

    return [...baseLogs, ...statusHistoryLogs].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }, [logs, shipment]);

  const fetchPublicTracking = async (id) => {
    const response = await getShipment(id);
    const shipmentData = response.data?.data || response.data;

    setShipment(shipmentData);
    setEvents(response.data?.events || []);
    setLogs(Array.isArray(shipmentData?.logs) ? shipmentData.logs : []);
  };

  const fetchTrackingData = async () => {
    if (!form.shipment_id.trim()) {
      addToast("Enter shipment ID", "error");
      return;
    }

    setSubmitting(true);

    try {
      if (form.mobile.trim()) {
        const response = await trackShipmentSecure({
          shipment_id: form.shipment_id.trim(),
          mobile: form.mobile.trim(),
        });
        const shipmentData = response.data?.data || response.data;
        setShipment(shipmentData);
        setEvents(response.data?.events || []);
        setLogs(Array.isArray(shipmentData?.logs) ? shipmentData.logs : []);
      } else {
        await fetchPublicTracking(form.shipment_id.trim());
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "Unable to load shipment tracking",
        "error",
      );
      setShipment(null);
      setEvents([]);
      setLogs([]);
    } finally {
      setSubmitting(false);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!prefilledId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        await fetchPublicTracking(prefilledId);
      } catch {
        addToast("Unable to load prefilled shipment", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [prefilledId]);

  useEffect(() => {
    if (!shipment?.shipment_id) {
      return undefined;
    }

    const interval = setInterval(() => {
      if (form.mobile.trim()) {
        trackShipmentSecure({
          shipment_id: shipment.shipment_id,
          mobile: form.mobile.trim(),
        })
          .then((response) => {
            const shipmentData = response.data?.data || response.data;
            setShipment(shipmentData);
            setEvents(response.data?.events || []);
            setLogs(Array.isArray(shipmentData?.logs) ? shipmentData.logs : []);
          })
          .catch(() => {
            // Silent polling failure.
          });
      } else {
        fetchPublicTracking(shipment.shipment_id).catch(() => {
          // Silent polling failure.
        });
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [shipment?.shipment_id, form.mobile]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrackingData();
    addToast("Tracking data refreshed");
  };

  const handleComplaintSubmit = async (description) => {
    try {
      await createComplaint({
        shipment_id: shipment?.shipment_id || form.shipment_id,
        complaint_text: description,
      });
      addToast("Complaint submitted successfully");
      setShowComplaintModal(false);
    } catch {
      addToast("Failed to submit complaint", "error");
      throw new Error("Complaint failed");
    }
  };

  const hasHighSeverityEvent = events.some(
    (event) => event.severity === "HIGH",
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-surface">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        shipmentId={shipment?.shipment_id || form.shipment_id}
        onSubmit={handleComplaintSubmit}
      />

      <div className="glass-card mb-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display gradient-text mb-1">
              IntelliShip Tracking
            </h1>
            <p className="text-sm text-on-surface-variant">
              Track with shipment ID and mobile number
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchTrackingData();
          }}
          className="glass-card mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              value={form.shipment_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, shipment_id: e.target.value }))
              }
              placeholder="Shipment ID"
              className="input-field"
              required
            />
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, mobile: e.target.value }))
              }
              placeholder="Customer Mobile (for secure access)"
              className="input-field"
              pattern="^[0-9+\-\s]{8,15}$"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Search size={18} />
              {submitting ? "Checking..." : "Track Shipment"}
            </button>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-3 flex items-center gap-2">
            <ShieldCheck size={14} />
            Mobile number unlocks secure tracking details.
          </p>
        </form>

        {!shipment ? null : (
          <>
            <div
              className={`glass-card mb-8 text-center py-10 ${shipment?.condition === "DAMAGED" ? "animate-pulse-glow border-severe/50" : ""}`}
            >
              <Package size={60} className="mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2 font-display">
                {shipment?.product_name}
              </h2>
              <p className="text-on-surface-variant mb-4">
                Shipment ID: {shipment?.shipment_id}
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <StatusBadge status={shipment?.status} size="lg" animate />
                <StatusBadge status={shipment?.condition} size="lg" animate />
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary flex items-center gap-2 mx-auto"
              >
                <RefreshCw
                  size={20}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              {hasHighSeverityEvent && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowComplaintModal(true)}
                    className="btn-primary bg-severe hover:bg-red-600 flex items-center gap-2 mx-auto"
                  >
                    <AlertTriangle size={20} />
                    File Complaint
                  </button>
                </div>
              )}
            </div>

            <div className="glass-card mb-8">
              <h2 className="text-2xl font-bold mb-6 font-display">Vibration Event Logs</h2>
              {events.length === 0 ? (
                <p className="text-on-surface-variant">
                  No vibration events recorded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {events.slice(0, 10).map((event) => (
                    <div
                      key={event._id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between bg-surface-container-low border border-outline-variant/10 shadow-lg rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <StatusBadge status={event.severity} size="sm" />
                        <p className="text-sm text-on-surface-variant">
                          Intensity:{" "}
                          <span className="font-semibold">
                            {event.intensity}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-on-surface-variant/60 mt-2 md:mt-0">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 font-display">Shipment Timeline</h2>
              <Timeline logs={normalizedTimeline} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackShipment;
