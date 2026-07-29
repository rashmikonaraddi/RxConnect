"use client";

import React, { useState } from "react";

export default function AdminDashboardOverview({
  branches = [],
  ordersCount = 142,
  lowStockItems = [],
  onTriggerRestock,
  onNavigateTab,
}) {
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("all");
  const [restockAlert, setRestockAlert] = useState(null);

  const filteredLowStock = lowStockItems.filter((item) =>
    selectedBranchFilter === "all" ? true : item.branch === selectedBranchFilter
  );

  const bottleneckBranches = branches.filter((b) => b.fulfillmentRate < 90);

  const handleRestock = (item) => {
    onTriggerRestock(item);
    setRestockAlert(`Restock order requested for ${item.name} at ${item.branch}`);
    setTimeout(() => setRestockAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Restock Notification Toast */}
      {restockAlert && (
        <div className="bg-emerald-900 text-emerald-100 p-4 rounded-xl shadow-lg border border-emerald-700 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <span>✅</span> {restockAlert}
          </span>
          <span className="text-[10px] bg-emerald-800 px-2 py-1 rounded">Supplier Notified</span>
        </div>
      )}

      {/* Top Filter & Overview Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Regional Pharmacy Control Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time branch operational oversight, stock tracking, and fulfillment bottleneck alerts.
          </p>
        </div>

        {/* Branch Filter Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">Branch:</span>
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">All Pharmacy Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottleneck Warning Banner */}
      {bottleneckBranches.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0">
            ⚠️
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-sm">
                Fulfillment Bottleneck Warning ({bottleneckBranches.length} Branch Affected)
              </h3>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Action Required
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {bottleneckBranches.map((b) => b.name).join(", ")} is reporting a fulfillment rate below 90% due to branch-level stock shortages. Check low stock alerts below to dispatch inventory.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Orders Today</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{ordersCount}</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden flex">
            <div className="bg-blue-500 h-full w-[45%]" title="Verified"></div>
            <div className="bg-amber-500 h-full w-[25%]" title="Packed"></div>
            <div className="bg-purple-500 h-full w-[15%]" title="Out for Delivery"></div>
            <div className="bg-emerald-500 h-full w-[15%]" title="Delivered"></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>● 45% Verified</span>
            <span>● 15% Delivered</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Low Stock Alerts</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-amber-600">{filteredLowStock.length}</h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Items Low</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Medicines below minimum branch safety threshold.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Fulfillment Rate</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-emerald-600">96.8%</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Target &gt;95%</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Branch order fulfillment without stockout delays.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Revenue</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">₹2,84,200</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">OTC + Rx</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Total sales processed across active branches.
          </p>
        </div>
      </div>

      {/* Main Grid: Low-Stock Alerts & Branch Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>🔴 Branch Low-Stock Warning List</span>
                <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {filteredLowStock.length} Alerts
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Medicines at or below reorder threshold. Stock is tracked per branch.
              </p>
            </div>
          </div>

          {filteredLowStock.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">No low stock warnings for the selected branch filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {filteredLowStock.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.rx 
                          ? "bg-purple-100 text-purple-700 border border-purple-200" 
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {item.rx ? "Rx Required" : "OTC"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Branch: <span className="font-semibold text-slate-700">{item.branch}</span> • Current Stock:{" "}
                      <span className="font-bold text-red-600">{item.currentStock} units</span> (Min Threshold: {item.minThreshold})
                    </p>
                  </div>

                  <button
                    onClick={() => handleRestock(item)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-xs shrink-0 self-end sm:self-center"
                  >
                    📦 Restock Branch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Branch Fulfillment Rates</h3>
              <button
                onClick={() => onNavigateTab("branches")}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                Manage Branches →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {branches.map((b) => (
                <div key={b.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-800">{b.name}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${
                      b.fulfillmentRate >= 95
                        ? "bg-emerald-100 text-emerald-800"
                        : b.fulfillmentRate >= 90
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {b.fulfillmentRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        b.fulfillmentRate >= 95
                          ? "bg-emerald-500"
                          : b.fulfillmentRate >= 90
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${b.fulfillmentRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Orders Today: {b.ordersToday}</span>
                    <span>Stockouts: {b.stockoutsToday || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
            💡 <span className="font-bold">Admin Hint:</span> Fulfillment rate drops when customers request items out of stock at the assigned branch.
          </div>
        </div>
      </div>
    </div>
  );
}
