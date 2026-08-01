"use client";

import React, { useState, useEffect } from "react";

export default function BrowseMedicinesView({ onAddToCart, onPlaceOrder }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const res = await fetch("http://localhost:5001/api/medicines");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.medicines)) {
            const formatted = data.medicines.map((m) => ({
              id: m.id,
              name: m.name,
              category: m.category || "General",
              price: typeof m.price === "number" ? m.price : parseFloat(String(m.price).replace(/[^0-9.]/g, "")) || 0,
              type: m.prescriptionRequired ? "Rx" : "OTC",
              dosage: m.dosage || "Standard Dose",
              manufacturer: m.manufacturer || "Licensed Pharma",
              description: m.description || "Healthcare medication",
              stockStatus: m.inventories?.[0]?.quantity > 0 ? "In Stock at Nearby Branch" : "In Stock",
              usage: "Take as directed by doctor or healthcare provider.",
              prescriptionRequired: m.prescriptionRequired,
            }));
            setMedicines(formatted);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch medicines from API:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" ? true : m.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search Bar (Issue #21: Search Medicines) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Browse Medicine Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Search OTC medicines and prescription-required drugs across neighborhood pharmacy branches.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by medicine name, category (e.g. Paracetamol, Antibiotics)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Chronic Care">Chronic Care</option>
            <option value="Vitamins">Vitamins</option>
          </select>
        </div>
      </div>

      {/* Medicines Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs font-semibold text-slate-500">
          Loading medicine catalog from database...
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs font-semibold text-slate-500">
          No medicines found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedicines.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    m.type === "Rx" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}>
                    {m.type === "Rx" ? "Prescription Required" : "OTC Available"}
                  </span>
                  <span className="text-base font-extrabold text-slate-900">₹{m.price.toFixed(2)}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">{m.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{m.dosage}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{m.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span>📍</span> {m.stockStatus}
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedMedicine(m)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
                  >
                    View Medicine Details
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onAddToCart && onAddToCart(m)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-2 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      🛒 Add to Cart
                    </button>
                    <button
                      onClick={() => onPlaceOrder && onPlaceOrder(m)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-2 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medicine Details Modal (Issue #22) */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedMedicine.type === "Rx" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {selectedMedicine.type === "Rx" ? "Prescription Required" : "OTC Item"}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedMedicine.name}</h3>
                <p className="text-xs text-slate-500">{selectedMedicine.dosage} • {selectedMedicine.manufacturer}</p>
              </div>
              <span className="text-2xl font-black text-slate-900">₹{selectedMedicine.price.toFixed(2)}</span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Description</h4>
                <p className="leading-relaxed">{selectedMedicine.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Recommended Usage & Dosage</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedMedicine.usage}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Branch Stock Availability</h4>
                <p className="text-emerald-700 font-semibold">✓ {selectedMedicine.stockStatus}</p>
              </div>

              {selectedMedicine.type === "Rx" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">
                  <span className="font-bold">⚠️ Note:</span> This medicine requires a valid doctor's prescription. You can upload your prescription under the "Upload Prescription" tab before ordering.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart(selectedMedicine);
                    setSelectedMedicine(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={() => {
                    if (onPlaceOrder) onPlaceOrder(selectedMedicine);
                    setSelectedMedicine(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
