import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ShipmentCard from "../components/ShipmentCard";
import { getAllShipments } from "../services/api";

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await getAllShipments();
        const apiShipments = response.data?.shipments || [];
        setShipments(apiShipments);
        setFilteredShipments(apiShipments);
      } catch (error) {
        console.error("Error loading shipments:", error);
        setShipments([]);
        setFilteredShipments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  useEffect(() => {
    let filtered = shipments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredShipments(filtered);
  }, [searchTerm, statusFilter, shipments]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-8 lg:ml-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Active Shipments</h1>
          <p className="text-gray-400">
            Monitor all your shipments in real-time
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by ID, product, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-auto"
              >
                <option value="All">All Status</option>
                <option value="CREATED">Created</option>
                <option value="PACKED">Packed</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                <option value="DAMAGED">Damaged</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Shipments Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
          </div>
        ) : filteredShipments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card text-center py-20"
          >
            <p className="text-xl text-gray-400">No shipments found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment, index) => (
              <ShipmentCard
                key={shipment.shipment_id}
                shipment={shipment}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shipments;
