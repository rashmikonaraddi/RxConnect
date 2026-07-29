"use client";

import React, { useState } from "react";

export default function DeliveryJobCard({ job, onUpdateStatus, onOpenDetails, mode = "active", isHistory = false }) {
  const [showChecklist, setShowChecklist] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueReason, setIssueReason] = useState("Customer Unreachable");
  const [checklist, setChecklist] = useState({
    sealIntact: false,
    rxVerified: false,
    tempControlChecked: false,
  });

  const isAvailableMode = mode === "available";
  const isOutForDelivery = job.status === "Out for Delivery";
  const isPacked = job.status === "Packed";

  const handleConfirmChecklistPickup = () => {
    if (!checklist.sealIntact || !checklist.rxVerified) {
      alert("Please complete the mandatory safety checks before confirming pickup.");
      return;
    }
    setShowChecklist(false);
    onUpdateStatus(job.id);
  };

  const handleReportIssue = () => {
    alert(`Delivery issue reported for Order #${job.id}: ${issueReason}`);
    setShowIssueModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      
      {/* Top Banner & Status Header */}
      <div className="p-5 pb-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Order #{job.id}
              </span>
              {job.rxRequired && (
                <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-200">
                  Rx Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {job.itemsCount || (job.items ? job.items.length : 2)} items • {job.distance || "3.2 km"}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span 
              className={`text-xs px-3 py-1 rounded-full font-bold border ${
                isHistory || job.status === "Delivered"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : isOutForDelivery
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {job.status}
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              {job.payout || "₹150"} payout
            </span>
          </div>
        </div>

        {/* Safety Gate Indicator */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-emerald-800 mb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pharmacist Verified & Packed
          </span>
          <span className="text-[10px] font-bold text-emerald-700">Ready for Pickup</span>
        </div>

        {/* Pickup & Dropoff Route Card */}
        <div className="space-y-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup Pharmacy</p>
              <p className="font-bold text-slate-800 truncate">{job.pickupBranch}</p>
              <p className="text-[11px] text-slate-500 truncate">{job.branchAddress || " downtown branch"}</p>
            </div>
          </div>

          <div className="ml-3 pl-3 border-l-2 border-dashed border-slate-300 h-2 -my-1"></div>

          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Destination</p>
              <p className="font-bold text-slate-800 truncate">{job.customer || "Customer"}</p>
              <p className="text-[11px] text-slate-500 truncate">{job.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onOpenDetails(job, mode)}
          className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-300 transition-colors shadow-2xs"
        >
          Details
        </button>

        {isAvailableMode && (
          <button
            onClick={() => onUpdateStatus(job.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-xs"
          >
            Claim Job
          </button>
        )}

        {!isHistory && !isAvailableMode && isPacked && (
          <button
            onClick={() => setShowChecklist(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-xs"
          >
            Pickup Check
          </button>
        )}

        {!isHistory && !isAvailableMode && isOutForDelivery && (
          <>
            <button
              onClick={() => onUpdateStatus(job.id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-xs"
            >
              Mark Delivered
            </button>
            <button
              onClick={() => setShowIssueModal(true)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs py-2 px-2.5 rounded-lg border border-amber-200 transition-colors"
              title="Report Delivery Problem"
            >
              ⚠️ Issue
            </button>
          </>
        )}
      </div>

      {/* Branch Pickup Safety Checklist Modal */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              📋 Branch Pickup Safety Verification
            </h3>
            <p className="text-xs text-slate-500">
              Please verify package condition at <span className="font-bold text-slate-800">{job.pickupBranch}</span> before leaving:
            </p>
            <div className="space-y-2.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.sealIntact}
                  onChange={(e) => setChecklist({ ...checklist, sealIntact: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Medicine Package Seal Intact</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.rxVerified}
                  onChange={(e) => setChecklist({ ...checklist, rxVerified: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Pharmacist Sign-off Tag Verified</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.tempControlChecked}
                  onChange={(e) => setChecklist({ ...checklist, tempControlChecked: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Temperature Control Bag (If Cold Chain)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowChecklist(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmChecklistPickup}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Confirm & Out for Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              ⚠️ Report Delivery Issue
            </h3>
            <p className="text-xs text-slate-500">
              Select reason for inability to complete delivery for Order #{job.id}:
            </p>
            <select
              value={issueReason}
              onChange={(e) => setIssueReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold outline-none"
            >
              <option value="Customer Unreachable">Customer Unreachable / Phone Unanswered</option>
              <option value="Incorrect Address">Incorrect or Inaccessible Address</option>
              <option value="Customer Refused Order">Customer Refused Package</option>
              <option value="Damaged Package">Package Damaged En Route</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssue}
                className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Submit Issue Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}