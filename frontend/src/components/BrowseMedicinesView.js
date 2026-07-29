"use client";

import React, { useState } from "react";

export default function BrowseMedicinesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const medicines = [
    {
      id: "med-1",
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      price: "₹185",
      type: "Rx",
      dosage: "500mg Capsule",
      manufacturer: "RxHealth Pharma",
      description: "Broad-spectrum antibiotic used to treat bacterial infections.",
      stockStatus: "In Stock at Downtown & Uptown Branch",
      usage: "Take 1 capsule 3 times daily with food as prescribed.",
    },
    {
      id: "med-2",
      name: "Paracetamol 650mg",
      category: "Pain Relief",
      price: "₹90",
      type: "OTC",
      dosage: "650mg Tablet",
      manufacturer: "HealthCare Ltd",
      description: "Effective fever reducer and mild to moderate pain reliever.",
      stockStatus: "In Stock across all branches",
      usage: "Take 1 tablet every 6 hours as needed. Do not exceed 4g/day.",
    },
    {
      id: "med-3",
      name: "Metformin 500mg",
      category: "Chronic Care",
      price: "₹220",
      type: "Rx",
      dosage: "500mg Sustained Release",
      manufacturer: "BioMed Labs",
      description: "First-line medication for the treatment of type 2 diabetes.",
      stockStatus: "Low Stock at Westside Branch",
      usage: "Take 1 tablet daily with evening meal.",
    },
    {
      id: "med-4",
      name: "Vitamin C 1000mg",
      category: "Vitamins",
      price: "₹120",
      type: "OTC",
      dosage: "1000mg Effervescent Tablet",
      manufacturer: "NutraLife",
      description: "Immune support dietary supplement with bioflavonoids.",
      stockStatus: "In Stock across all branches",
      usage: "Dissolve 1 tablet in 200ml water daily.",
    },
    {
      id: "med-5",
      name: "Ibuprofen 400mg",
      category: "Pain Relief",
      price: "₹80",
      type: "OTC",
      dosage: "400mg Softgel",
      manufacturer: "PainRelief Inc",
      description: "Non-steroidal anti-inflammatory drug (NSAID) for pain & inflammation.",
      stockStatus: "In Stock across all branches",
      usage: "Take 1 softgel with food every 8 hours.",
    },
  ];

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" ? true : m.category === categoryFilter;
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
                <span className="text-base font-extrabold text-slate-900">{m.price}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">{m.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{m.dosage}</p>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">{m.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span>📍</span> {m.stockStatus}
              </p>
              
              {/* Action Button (Issue #22: View Details) */}
              <button
                onClick={() => setSelectedMedicine(m)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors"
              >
                View Medicine Details
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <span className="text-2xl font-black text-slate-900">{selectedMedicine.price}</span>
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

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
