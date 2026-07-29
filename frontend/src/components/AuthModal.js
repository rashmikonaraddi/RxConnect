"use client";

import { useState } from "react";

export default function AuthModal({ onLogin, onClose }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    preferredPharmacy: "HealthFirst Central Pharmacy - Downtown",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName && isSignUp) return;
    if (!formData.email) return;

    const userPayload = {
      fullName: formData.fullName || formData.email.split("@")[0],
      email: formData.email,
      phone: formData.phone || "+1 (555) 000-0000",
      customerId: "RX-" + Math.floor(1000000 + Math.random() * 9000000),
      preferredPharmacy: formData.preferredPharmacy || "HealthFirst Central Pharmacy",
      deliveryAddress: formData.deliveryAddress || "Not specified",
      emergencyContact: "Not specified",
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    onLogin(userPayload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with App Name RxConnect */}
        <div className="bg-[#0b193c] px-6 py-6 text-white text-center relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-300 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto mb-2.5 shadow-inner">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            RxConnect
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-normal">
            {isSignUp
              ? "Create your account to manage prescriptions & pharmacy orders"
              : "Log in to access your RxConnect customer dashboard"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="Street address, city, state"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#0b193c] hover:bg-[#13285c] text-white font-semibold text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            {isSignUp ? "Create RxConnect Account" : "Log In to RxConnect"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#0b193c] hover:underline font-semibold cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Log In"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
