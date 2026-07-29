"use client";

import React, { useState } from "react";
import DeliveryJobCard from "./DeliveryJobCard";

export default function DeliveryJobsView({ jobs = [], mode = "active", onUpdateStatus, onOpenDetails }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAvailableMode = mode === "available";

  // Filter jobs based on search term & status filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (job.id && job.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.customer && job.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.pickupBranch && job.pickupBranch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.destination && job.destination.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true : job.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isAvailableMode ? "Available Delivery Jobs" : "Your Active Deliveries"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAvailableMode
              ? "Verified and packed orders ready to be claimed at pharmacy branches."
              : "Track and update the status of your assigned delivery orders."}
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search order #, customer, branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
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

          {/* Status Filter (only for Active mode) */}
          {!isAvailableMode && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="packed">Packed (Ready for Pickup)</option>
              <option value="out for delivery">Out for Delivery</option>
            </select>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            {isAvailableMode ? "📋" : "🛵"}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {isAvailableMode ? "No Available Jobs Right Now" : "No Active Deliveries Assigned"}
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {isAvailableMode
              ? "All branch orders have been claimed. Check back shortly for newly packed orders."
              : "You have no active orders in progress. Switch to the 'Available Jobs' tab to claim new orders!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <DeliveryJobCard
              key={job.id}
              job={job}
              mode={mode}
              onUpdateStatus={onUpdateStatus}
              onOpenDetails={onOpenDetails}
              isHistory={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}