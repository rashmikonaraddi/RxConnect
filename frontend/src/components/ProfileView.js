"use client";

import { useState, useEffect } from "react";

export default function ProfileView({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditForm({ ...user });
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
    try {
      const res = await fetch("http://localhost:5001/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("rxconnect_user", JSON.stringify(data.user));
        }
        if (onUpdateUser) {
          onUpdateUser(data.user);
        }
      } else if (onUpdateUser) {
        onUpdateUser({ ...editForm });
      }
    } catch (err) {
      console.warn("Failed to persist profile update to backend:", err);
      if (onUpdateUser) {
        onUpdateUser({ ...editForm });
      }
    }
    setIsEditing(false);
  };

  const handleCopyId = () => {
    if (user?.customerId) {
      navigator.clipboard.writeText(user.customerId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all duration-300">
      {/* Card Header Banner with Creative Badges */}
      <div className="bg-gradient-to-r from-[#0b193c] via-[#102454] to-[#0b193c] px-8 py-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-white">My Profile</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              100% Complete
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-normal">
            Manage your personal information, contact details, and default delivery pharmacy preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-lg text-slate-200 font-medium">
            Account Status: <strong className="text-emerald-400 font-semibold">Active</strong>
          </span>
        </div>
      </div>

      {/* Card Content: View Mode vs Edit Mode */}
      {!isEditing ? (
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Full Name
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.fullName || "Not provided"}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Email
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.email || "Not provided"}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Phone
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.phone || "Not provided"}
                </span>
              </div>
            </div>

            {/* Customer ID with Copy Button */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Customer ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 font-mono tracking-tight">
                    {user.customerId || "RX-0000000"}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="text-xs text-slate-400 hover:text-[#0b193c] transition cursor-pointer p-1 rounded-md hover:bg-slate-100"
                    title="Copy ID"
                  >
                    {copied ? (
                      <span className="text-emerald-600 font-semibold text-[10px]">Copied!</span>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Preferred Pharmacy */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4M10 7h4" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Preferred Pharmacy
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.preferredPharmacy || "HealthFirst Central Pharmacy"}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Delivery Address
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.deliveryAddress || "Not specified"}
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Emergency Contact
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.emergencyContact || "Not specified"}
                </span>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Joined Date
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {user.joinedDate || "Recently"}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Action */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                setEditForm({ ...user });
                setIsEditing(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0b193c] to-[#14295e] hover:from-[#13285c] hover:to-[#1b367a] text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      ) : (
        /* Edit Form Mode */
        <form onSubmit={handleSaveProfile} className="p-8 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={editForm.fullName || ""}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={editForm.phone || ""}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Preferred Pharmacy
              </label>
              <input
                type="text"
                value={editForm.preferredPharmacy || ""}
                onChange={(e) => setEditForm({ ...editForm, preferredPharmacy: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Delivery Address
              </label>
              <input
                type="text"
                value={editForm.deliveryAddress || ""}
                onChange={(e) => setEditForm({ ...editForm, deliveryAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Emergency Contact
              </label>
              <input
                type="text"
                value={editForm.emergencyContact || ""}
                onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0b193c] hover:bg-[#13285c] text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
