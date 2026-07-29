"use client";

import React, { useState } from "react";

export default function DeliveryDetailsModal({ job, onClose, onUpdateStatus, mode = "active" }) {
  const [deliveryNote, setDeliveryNote] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) return null;

  const isAvailableMode = mode === "available";
  const isOutForDelivery = job.status === "Out for Delivery";
  const isPacked = job.status === "Packed";

  const handleAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateStatus(job.id, deliveryNote);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">Order #{job.id}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                job.status === "Delivered"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : job.status === "Out for Delivery"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}>
                {job.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              RxConnect Express Dispatch • {job.pickupBranch}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          
          {/* Pharmacist Safety Verification Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-emerald-900">Pharmacist Verified & Packed</h4>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  Safety Gate Passed
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Verified by Pharmacist <span className="font-semibold">{job.pharmacistName || "Dr. Sarah Jenkins"}</span>. All prescription checks and stock locks completed.
              </p>
            </div>
          </div>

          {/* Pickup & Destination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Pickup Branch
                </div>
                <p className="font-bold text-slate-900 text-base">{job.pickupBranch}</p>
                <p className="text-slate-600 text-xs mt-1">{job.branchAddress || "104 Healthcare Boulevard, City Center"}</p>
                <p className="text-slate-500 text-xs mt-2 font-mono">Phone: {job.branchPhone || "+91 98765 99000"}</p>
              </div>
              <button 
                onClick={() => alert(`Dialing Branch: ${job.branchPhone || "+91 98765 99000"}`)}
                className="mt-3 text-xs bg-white hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-3 rounded-lg border border-slate-300 transition-colors self-start flex items-center gap-1.5"
              >
                📞 Call Pharmacy
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Address
                </div>
                <p className="font-bold text-slate-900 text-base">{job.customer || "Customer"}</p>
                <p className="text-slate-600 text-xs mt-1 font-medium">{job.destination}</p>
                <p className="text-slate-500 text-xs mt-2 font-mono">Contact: {job.customerPhone || "+91 98765 23456"}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => alert(`Calling customer: ${job.customerPhone || "+91 98765 23456"}`)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  📞 Call Customer
                </button>
                <button 
                  onClick={() => alert(`Opening navigation for: ${job.destination}`)}
                  className="text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  🗺️ Map Route
                </button>
              </div>
            </div>
          </div>

          {job.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <span className="font-bold text-base">⚠️</span>
              <div>
                <span className="font-bold">Delivery Note: </span>
                {job.notes}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <span>📦 Package Item Breakdown</span>
              <span className="text-xs font-normal text-slate-500">({job.items ? job.items.length : 2} items)</span>
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {(job.items || [
                { name: "Amoxicillin 500mg", qty: "1 Box", rx: true, price: "₹185" },
                { name: "Vitamin C 1000mg Effervescent", qty: "2 Packs", rx: false, price: "₹120" }
              ]).map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.rx 
                        ? "bg-purple-100 text-purple-700 border-purple-200" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {item.rx ? "Rx Required" : "OTC"}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-700 text-xs">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {mode === "active" && isOutForDelivery && (
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Proof of Delivery Confirmation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Delivery Note / Remarks
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Handed to customer at door"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Delivery Code / OTP (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RX-8842"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
            Close
          </button>

          {isAvailableMode && (
            <button
              onClick={handleAction}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? "Accepting Job..." : "⚡ Claim & Self-Assign Delivery"}
            </button>
          )}

          {mode === "active" && isPacked && (
            <button
              onClick={handleAction}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? "Updating..." : "📦 Confirm Pickup at Branch"}
            </button>
          )}

          {mode === "active" && isOutForDelivery && (
            <button
              onClick={handleAction}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? "Completing..." : "✅ Complete & Mark Delivered"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
