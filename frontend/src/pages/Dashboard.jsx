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
import { motion } from "framer-motion";
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

  const statCards = [
    {
      icon: Package,
      label: "Total Shipments",
      value: stats.totalShipments,
      color: "bg-primary/10 text-primary",
      glowColor: "rgba(0, 217, 255, 0.15)",
    },
    {
      icon: TrendingUp,
      label: "Active",
      value: stats.activeShipments,
      color: "bg-secondary/10 text-secondary",
      glowColor: "rgba(124, 58, 237, 0.15)",
    },
    {
      icon: AlertTriangle,
      label: "Damaged",
      value: stats.damagedShipments,
      color: "bg-severe/10 text-severe",
      glowColor: "rgba(239, 68, 68, 0.15)",
    },
    {
      icon: CheckCircle,
      label: "Delivered",
      value: stats.deliveredShipments,
      color: "bg-safe/10 text-safe",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm border border-primary/15">
          <p className="font-display font-semibold text-on-surface mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="text-xs">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface">
      <Sidebar />

      <main className="flex-1 w-full min-w-0 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 mt-12 lg:mt-0"
          >
          <h1 className="text-4xl font-bold mb-2 font-display gradient-text">
            Dashboard
          </h1>
          <p className="text-on-surface-variant">
            Real-time logistics and event intelligence.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent border-t-primary border-r-primary" />
              <div className="absolute inset-0 rounded-full animate-ping-slow border-2 border-primary/20" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {statCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      y: -4,
                      scale: 1.02,
                      boxShadow: `0 8px 32px ${card.glowColor}`,
                    }}
                    className="glass-card group cursor-default relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <p className="text-on-surface-variant text-sm mb-2 uppercase tracking-wider font-medium">
                          {card.label}
                        </p>
                        <p className="text-4xl font-bold font-display tracking-tight text-on-surface">{card.value}</p>
                      </div>
                      <div className={`${card.color} p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                        <IconComponent size={24} />
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-outline-variant/20 relative z-10">
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant/80 font-medium">
                        <div className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${card.color.split(' ')[0].replace('/10', '')}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${card.color.split(' ')[0].replace('/10', '')}`}></span>
                        </div>
                        <span>Live real-time feed</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">
                Event Frequency <span className="text-on-surface-variant font-normal text-base">(Last 7 Days)</span>
              </h2>
              {chartData.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-on-surface-variant/30 mb-4" />
                  <p className="text-on-surface-variant">No event data available yet.</p>
                </div>
              ) : (
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="rgba(255,255,255,0.04)" 
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="day" 
                        stroke="#BBC9CE" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                      />
                      <YAxis 
                        stroke="#BBC9CE" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: '16px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar 
                        dataKey="LOW" 
                        fill="#10B981" 
                        radius={[6, 6, 0, 0]} 
                        barSize={20}
                      />
                      <Bar
                        dataKey="MEDIUM"
                        fill="#F59E0B"
                        radius={[6, 6, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        dataKey="HIGH"
                        fill="#EF4444"
                        radius={[6, 6, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </>
        )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
