"use client";

import React, { useState } from "react";
import DeliveryJobCard from "./DeliveryJobCard";

export default function DeliveryHistoryView({ jobs = [], onOpenDetails }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      (job.id && job.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.customer && job.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.pickupBranch && job.pickupBranch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEarnings = jobs.reduce((acc, job) => {
    const amount = parseFloat((job.payout || "₹150").replace("₹", "")) || 150;
    return acc + amount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Delivery History</h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of your past fulfilled medical deliveries.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Completed</p>
            <p className="text-lg font-extrabold text-slate-800">{jobs.length} Jobs</p>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Earnings</p>
            <p className="text-lg font-extrabold text-emerald-600">₹{totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Filter past orders by ID, branch, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* History Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            
          </div>
          <h3 className="text-base font-bold text-slate-800">No Completed Deliveries Found</h3>
          <p className="text-xs text-slate-500 mt-2">
            Completed deliveries will appear here once you fulfill orders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <DeliveryJobCard
              key={job.id}
              job={job}
              mode="history"
              onOpenDetails={onOpenDetails}
              isHistory={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}