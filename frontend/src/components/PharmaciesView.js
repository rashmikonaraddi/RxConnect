"use client";

import { useState, useEffect } from "react";

export default function PharmaciesView() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("http://localhost:5001/api/branches");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.branches)) {
            setBranches(data.branches);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch branches from API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-5">Nearby Partner Pharmacies</h2>
      {loading ? (
        <div className="p-8 text-center text-xs font-semibold text-slate-500">Loading nearby pharmacies from database...</div>
      ) : branches.length === 0 ? (
        <div className="p-8 text-center text-xs font-semibold text-slate-500">No partner pharmacy branches registered.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{b.name}</h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Open Now</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">{b.address || "Main Street"} • Phone: {b.phone || "+91 98765 43210"}</p>
              <div className="mt-4 text-xs font-medium text-[#0b193c] flex items-center gap-1">
                ★ 4.9 • Express 30-min Delivery Available
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
