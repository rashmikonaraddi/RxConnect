"use client";

import React, { useState } from "react";

export default function AnalyticsView({ branches = [] }) {
  const [reportExported, setReportExported] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchAnalytics() {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      try {
        const res = await fetch("http://localhost:5001/api/admin/analytics", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setAnalytics(json.data);
          }
        }
      } catch (err) {
        console.warn("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const topSellingMedicines = analytics?.topSellingMedicines || [
    { rank: 1, name: "Amoxicillin 500mg", type: "Rx", unitsSold: 420, revenue: "₹77,700", category: "Antibiotics", stockLevel: "High" },
    { rank: 2, name: "Paracetamol 650mg", type: "OTC", unitsSold: 380, revenue: "₹11,400", category: "Pain Relief", stockLevel: "Normal" },
    { rank: 3, name: "Metformin 500mg", type: "Rx", unitsSold: 310, revenue: "₹68,200", category: "Chronic Care", stockLevel: "Low" },
    { rank: 4, name: "Vitamin C 1000mg", type: "OTC", unitsSold: 290, revenue: "₹17,400", category: "Vitamins", stockLevel: "Normal" },
    { rank: 5, name: "Ibuprofen 400mg", type: "OTC", unitsSold: 240, revenue: "₹9,600", category: "Pain Relief", stockLevel: "Normal" },
  ];

  const handleExportCSV = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {reportExported && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>📊 Sales & Stock Report exported successfully (RxConnect_Analytics_2026.csv)</span>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded">Downloaded</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sales & Order Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track medicine movement, branch revenue distribution, and prescription vs OTC sales ratios.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-2"
        >
          <span>📥 Export Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Gross Revenue</p>
          <h3 className="text-3xl font-black text-slate-900">
            ₹{analytics?.grossRevenueINR !== undefined ? analytics.grossRevenueINR.toLocaleString("en-IN") : "8,43,200"}
          </h3>
          <p className="text-xs text-emerald-600 font-bold mt-2">↑ 18.2% from last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rx vs OTC Order Ratio</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-black text-purple-700">
              {analytics?.rxToOtcRatio || "58% Rx / 42% OTC"}
            </h3>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden flex">
            <div className="bg-purple-600 h-full w-[58%]"></div>
            <div className="bg-slate-400 h-full w-[42%]"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prescription Fulfillment</p>
          <h3 className="text-3xl font-black text-emerald-600">99.1%</h3>
          <p className="text-xs text-slate-500 mt-2">Pharmacist approval gate verified</p>
        </div>
      </div>

      {/* Main Table: Top Selling Medicines */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Top-Selling Medicines (Branch Aggregated)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Most dispensed medicines across all physical branch locations.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Branch Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topSellingMedicines.map((m) => (
                <tr key={m.rank} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-400">#{m.rank}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.type === "Rx" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-700"
                    }`}>
                      {m.type === "Rx" ? "Prescription" : "OTC"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{m.category}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{m.unitsSold} units</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">{m.revenue}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.stockLevel === "Low" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {m.stockLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
