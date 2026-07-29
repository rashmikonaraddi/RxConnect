"use client";

import React, { useState } from "react";

export default function DeliveryProfileView({ user, onUpdateUser, driverStatus, onToggleStatus }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "Delivery Partner",
    phone: user?.phone || "+91 9876543210",
    email: user?.email || "delivery@rxconnect.com",
    vehicle: user?.vehicle || "Honda Activa 6G (KA-19-EX-1234)",
    zone: user?.zone || "Downtown & Central District",
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ ...user, ...formData });
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold text-amber-400 shadow-inner">
              {user?.fullName ? user.fullName.charAt(0) : "D"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{formData.fullName}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Employee ID: <span className="font-mono text-amber-300">{user?.employeeId || "DEL-002"}</span>
              </p>
            </div>
          </div>

          {/* Duty Status Toggle */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
            <span className="text-xs text-slate-300 font-semibold">Duty Status:</span>
            <button
              onClick={onToggleStatus}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                driverStatus === "On Duty"
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {driverStatus === "On Duty" ? "● ON DUTY" : "○ OFF DUTY"}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 bg-slate-50/50">
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
            <p className="text-xl font-black text-amber-500 mt-1">4.9 ★</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Acceptance</p>
            <p className="text-xl font-black text-blue-600 mt-1">99.2%</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">On-Time Rate</p>
            <p className="text-xl font-black text-emerald-600 mt-1">98.4%</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Lifetime Orders</p>
            <p className="text-xl font-black text-slate-800 mt-1">248</p>
          </div>
        </div>
      </div>

      {/* Information Form Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Partner Details</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition-colors border border-slate-300"
          >
            {isEditing ? "Cancel" : "✏️ Edit Info"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Registered Vehicle</label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Zone</label>
                <input
                  type="text"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px] mb-1">Full Name</p>
              <p className="font-semibold text-slate-800 text-sm">{formData.fullName}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px] mb-1">Contact Email</p>
              <p className="font-semibold text-slate-800 text-sm">{formData.email}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px] mb-1">Phone Number</p>
              <p className="font-semibold text-slate-800 text-sm">{formData.phone}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px] mb-1">Assigned Delivery Zone</p>
              <p className="font-semibold text-slate-800 text-sm">{formData.zone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-400 uppercase font-bold text-[10px] mb-1">Registered Delivery Vehicle</p>
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 inline-block mt-1">
                <p className="font-bold text-slate-800 text-xs">🛵 {formData.vehicle}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}