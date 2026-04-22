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
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getAnalytics } from "../services/api";

const SEVERITY_SERIES = [
  { key: "LOW", label: "Low", color: "#10B981" },
  { key: "MEDIUM", label: "Medium", color: "#F59E0B" },
  { key: "HIGH", label: "High", color: "#EF4444" },
];

const SHIPMENT_STATUS_COLORS = {
  ACTIVE: "#D4AF37",
  DELIVERED: "#10B981",
  DAMAGED: "#EF4444",
  OTHER: "#6B7280",
};

const formatDayLabel = (dayString) => {
  const parsedDate = new Date(`${dayString}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return dayString;
  }
  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

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
      const count = entry?.count || 0;
      if (!day || !severity) return;
      if (!buckets[day]) {
        buckets[day] = {
          day,
          label: formatDayLabel(day),
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
          total: 0,
        };
      }
      buckets[day][severity] = count;
      buckets[day].total += count;
    });
    return Object.values(buckets).sort((a, b) => a.day.localeCompare(b.day));
  }, [stats.eventFrequency]);

  const shipmentStatusData = useMemo(() => {
    const otherShipments = Math.max(
      stats.totalShipments -
        stats.activeShipments -
        stats.deliveredShipments -
        stats.damagedShipments,
      0,
    );

    return [
      {
        key: "ACTIVE",
        label: "Active",
        value: stats.activeShipments,
        color: SHIPMENT_STATUS_COLORS.ACTIVE,
      },
      {
        key: "DELIVERED",
        label: "Delivered",
        value: stats.deliveredShipments,
        color: SHIPMENT_STATUS_COLORS.DELIVERED,
      },
      {
        key: "DAMAGED",
        label: "Damaged",
        value: stats.damagedShipments,
        color: SHIPMENT_STATUS_COLORS.DAMAGED,
      },
      {
        key: "OTHER",
        label: "Other",
        value: otherShipments,
        color: SHIPMENT_STATUS_COLORS.OTHER,
      },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const severitySummaryData = useMemo(() => {
    const totals = chartData.reduce(
      (acc, dayBucket) => ({
        LOW: acc.LOW + dayBucket.LOW,
        MEDIUM: acc.MEDIUM + dayBucket.MEDIUM,
        HIGH: acc.HIGH + dayBucket.HIGH,
      }),
      { LOW: 0, MEDIUM: 0, HIGH: 0 },
    );

    return SEVERITY_SERIES.map((severity) => ({
      key: severity.key,
      label: severity.label,
      value: totals[severity.key],
      color: severity.color,
    })).filter((item) => item.value > 0);
  }, [chartData]);

  const incidentTrendData = useMemo(
    () =>
      chartData.map((entry) => ({
        day: entry.label,
        incidents: entry.total,
        high: entry.HIGH,
      })),
    [chartData],
  );

  const totalEvents = useMemo(
    () => incidentTrendData.reduce((sum, entry) => sum + entry.incidents, 0),
    [incidentTrendData],
  );

  const highSeverityEvents = useMemo(
    () => severitySummaryData.find((entry) => entry.key === "HIGH")?.value || 0,
    [severitySummaryData],
  );

  const avgEventsPerDay =
    incidentTrendData.length > 0
      ? (totalEvents / incidentTrendData.length).toFixed(1)
      : "0";

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
          <p className="font-display font-semibold text-on-surface mb-1">
            {label}
          </p>
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

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const current = payload[0];
    return (
      <div className="glass-card p-3 text-sm border border-primary/15">
        <p className="font-display font-semibold text-on-surface mb-1">
          {current.name}
        </p>
        <p style={{ color: current.payload.color }} className="text-xs">
          Count: {current.value}
        </p>
      </div>
    );
  };

  const NoChartData = ({ message }) => (
    <div className="text-center py-12">
      <Activity size={44} className="mx-auto text-gray-300 mb-4" />
      <p className="text-on-surface-variant">{message}</p>
    </div>
  );

  const shipmentTotal = shipmentStatusData.reduce(
    (sum, entry) => sum + entry.value,
    0,
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 font-display text-on-surface">
              Logistics Overview
            </h1>
            <p className="text-on-surface-variant">
              Real-time analytics and tracking insights.
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
                        boxShadow: `0 15px 35px rgba(0,0,0,0.04), 0 0 20px ${card.glowColor}`,
                      }}
                      className="glass-card group cursor-default relative overflow-hidden bg-white"
                    >
                      <div className="flex items-start justify-between relative z-10">
                        <div>
                          <p className="text-on-surface-variant text-sm mb-2 uppercase tracking-wider font-medium">
                            {card.label}
                          </p>
                          <p className="text-4xl font-bold font-display tracking-tight text-on-surface">
                            {card.value}
                          </p>
                        </div>
                        <div
                          className={`${card.color} p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-lg`}
                        >
                          <IconComponent size={24} />
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-100 relative z-10">
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant/80 font-medium">
                          <div className="relative flex h-2 w-2">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${card.color.split(" ")[0].replace("/10", "")}`}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-2 w-2 ${card.color.split(" ")[0].replace("/10", "")}`}
                            ></span>
                          </div>
                          <span>Live real-time feed</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card bg-white xl:col-span-8"
                >
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold font-display text-on-surface">
                      Event Frequency by Severity
                    </h2>
                    <span className="text-on-surface-variant text-sm">
                      Last 7 days
                    </span>
                  </div>

                  {chartData.length === 0 ? (
                    <NoChartData message="No event data available yet." />
                  ) : (
                    <div className="w-full h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(0,0,0,0.06)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="label"
                            stroke="#6B7280"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                          />
                          <YAxis
                            stroke="#6B7280"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            wrapperStyle={{
                              paddingTop: "16px",
                              fontSize: "12px",
                            }}
                          />
                          {SEVERITY_SERIES.map((severity) => (
                            <Bar
                              key={severity.key}
                              dataKey={severity.key}
                              name={severity.label}
                              fill={severity.color}
                              radius={[6, 6, 0, 0]}
                              barSize={18}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card bg-white xl:col-span-4"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h2 className="text-xl font-bold font-display text-on-surface">
                      Shipment Mix
                    </h2>
                    <span className="text-on-surface-variant text-sm">
                      Current state
                    </span>
                  </div>

                  {shipmentStatusData.length === 0 ? (
                    <NoChartData message="No shipment records found." />
                  ) : (
                    <>
                      <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={shipmentStatusData}
                              dataKey="value"
                              nameKey="label"
                              innerRadius={58}
                              outerRadius={88}
                              paddingAngle={3}
                              stroke="none"
                            >
                              {shipmentStatusData.map((entry) => (
                                <Cell key={entry.key} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2 mt-2">
                        {shipmentStatusData.map((entry) => {
                          const percent =
                            shipmentTotal > 0
                              ? Math.round((entry.value / shipmentTotal) * 100)
                              : 0;
                          return (
                            <div
                              key={entry.key}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2 text-on-surface-variant">
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{entry.label}</span>
                              </div>
                              <div className="text-on-surface font-semibold">
                                {entry.value} ({percent}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card bg-white xl:col-span-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-xl font-bold font-display text-on-surface">
                      Incident Trend
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
                        Total: {totalEvents}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-severe/10 text-severe font-semibold">
                        High Severity: {highSeverityEvents}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-surface-dim text-on-surface-variant font-semibold">
                        Avg/Day: {avgEventsPerDay}
                      </span>
                    </div>
                  </div>

                  {incidentTrendData.length === 0 ? (
                    <NoChartData message="Incident trend will appear after events are recorded." />
                  ) : (
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={incidentTrendData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(0,0,0,0.06)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            stroke="#6B7280"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                          />
                          <YAxis
                            stroke="#6B7280"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            wrapperStyle={{
                              paddingTop: "16px",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="incidents"
                            name="Total Incidents"
                            stroke="#D4AF37"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="high"
                            name="High Severity"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass-card bg-white xl:col-span-5"
                >
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold font-display text-on-surface">
                      Severity Split
                    </h2>
                    <span className="text-on-surface-variant text-sm">
                      Event contribution
                    </span>
                  </div>

                  {severitySummaryData.length === 0 ? (
                    <NoChartData message="Severity split is unavailable without event data." />
                  ) : (
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={severitySummaryData}
                          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(0,0,0,0.06)"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            stroke="#6B7280"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                          />
                          <YAxis
                            type="category"
                            dataKey="label"
                            stroke="#6B7280"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={72}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="value"
                            name="Events"
                            radius={[0, 8, 8, 0]}
                          >
                            {severitySummaryData.map((entry) => (
                              <Cell key={entry.key} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
