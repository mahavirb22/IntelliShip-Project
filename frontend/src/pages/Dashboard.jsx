import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Sidebar from "../components/Sidebar";
import { getAnalytics } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    damagedShipments: 0,
    deliveredShipments: 0,
    eventFrequency: [],
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const response = await getAnalytics();
      const payload = response.data?.data || {};
      setStats({
        totalShipments: payload.totalShipments || 0,
        activeShipments: payload.activeShipments || 0,
        damagedShipments: payload.damagedShipments || 0,
        deliveredShipments: payload.deliveredShipments || 0,
        eventFrequency: payload.eventFrequency || [],
      });
    } catch {
      setStats({
        totalShipments: 0,
        activeShipments: 0,
        damagedShipments: 0,
        deliveredShipments: 0,
        eventFrequency: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();

    const interval = setInterval(loadAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    const buckets = {};

    stats.eventFrequency.forEach((entry) => {
      const day = entry?._id?.day;
      const severity = entry?._id?.severity;
      if (!day || !severity) return;

      if (!buckets[day]) {
        buckets[day] = { day, LOW: 0, MEDIUM: 0, HIGH: 0 };
      }

      buckets[day][severity] = entry.count;
    });

    return Object.values(buckets);
  }, [stats.eventFrequency]);

  const StatCard = ({ icon, label, value, color }) => {
    const IconComponent = icon;

    return (
      <div className="glass-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">{label}</p>
            <p className="text-4xl font-bold">{value}</p>
          </div>
          <div className={`${color} p-3 rounded-lg`}>
            <IconComponent size={28} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Activity size={16} />
            <span>Live backend metrics</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-8 lg:ml-0">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Real-time logistics and event intelligence.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Package}
                label="Total Shipments"
                value={stats.totalShipments}
                color="bg-primary/20 text-primary"
                index={0}
              />
              <StatCard
                icon={TrendingUp}
                label="Active"
                value={stats.activeShipments}
                color="bg-blue-500/20 text-blue-400"
                index={1}
              />
              <StatCard
                icon={AlertTriangle}
                label="Damaged"
                value={stats.damagedShipments}
                color="bg-severe/20 text-severe"
                index={2}
              />
              <StatCard
                icon={CheckCircle}
                label="Delivered"
                value={stats.deliveredShipments}
                color="bg-safe/20 text-safe"
                index={3}
              />
            </div>

            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-6">
                Event Frequency (Last 7 Days)
              </h2>
              {chartData.length === 0 ? (
                <p className="text-gray-400">No event data available yet.</p>
              ) : (
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                      <XAxis dataKey="day" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="LOW" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Bar
                        dataKey="MEDIUM"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="HIGH"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
