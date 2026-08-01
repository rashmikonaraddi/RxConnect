"use client";

import React, { useState, useEffect } from "react";

export default function MedicineManagementView({ branches = [] }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    dosage: "500mg Tablet",
    manufacturer: "RxConnect Certified Pharma",
    price: "",
    description: "",
    prescriptionRequired: false,
    imageUrl: "https://placehold.co/600x400/0b193c/emerald?text=Medicine+Scan",
    branchId: "",
    initialStock: "50",
  });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/medicines");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.medicines)) {
          setMedicines(data.medicines);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      const res = await fetch("http://localhost:5001/api/admin/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Medicine '${formData.name}' successfully added to database!`);
        setShowAddModal(false);
        setFormData({
          name: "",
          category: "General",
          dosage: "500mg Tablet",
          manufacturer: "RxConnect Certified Pharma",
          price: "",
          description: "",
          prescriptionRequired: false,
          imageUrl: "https://placehold.co/600x400/0b193c/emerald?text=Medicine+Scan",
          branchId: "",
          initialStock: "50",
        });
        fetchMedicines();
      } else {
        alert(data.message || "Failed to add medicine.");
      }
    } catch (err) {
      console.error("Error creating medicine:", err);
      alert("Server error adding medicine.");
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" ? true : m.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medicine Catalog & Stock Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add new medicines to the PostgreSQL database, configure prices, prescription requirements, and initial branch inventory.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2 cursor-pointer hover:scale-105"
        >
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search medicine by name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Chronic Care">Chronic Care</option>
            <option value="Vitamins">Vitamins</option>
            <option value="Blood Pressure">Blood Pressure</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-6">Medicine Details</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Dosage & Manufacturer</th>
                <th className="py-3.5 px-4">Price (INR)</th>
                <th className="py-3.5 px-6 text-right">Branch Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Loading medicine catalog from NeonDB...
                  </td>
                </tr>
              ) : filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No medicines found in database matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((m) => {
                  const totalStock = (m.inventories || []).reduce((acc, inv) => acc + inv.quantity, 0);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.imageUrl || "https://placehold.co/600x400/0b193c/emerald?text=Scan"}
                            alt={m.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{m.description || "Healthcare medication"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold border text-[10px] ${
                            m.prescriptionRequired
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {m.prescriptionRequired ? "Prescription (Rx)" : "OTC Available"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {m.category}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{m.dosage || "Standard"}</p>
                        <p className="text-[10px] text-slate-400">{m.manufacturer}</p>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white text-sm">
                        ₹{m.price?.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-bold text-xs ${totalStock > 20 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {totalStock > 0 ? `${totalStock} units` : "Out of Stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Medicine to Database</h3>
                <p className="text-xs text-slate-500">Form updates `Medicine` & `Inventory` tables in NeonDB.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Azithromycin 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none font-semibold cursor-pointer"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Chronic Care">Chronic Care</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Blood Pressure">Blood Pressure</option>
                    <option value="General">General Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Price (INR ₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Dosage Form</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg Tablet / 10ml Syrup"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Sun Pharma"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Clinical usage and indications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none"
                ></textarea>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Prescription Required (Rx)?</span>
                  <span className="text-[10px] text-slate-500">Requires licensed pharmacist verification before checkout</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.prescriptionRequired}
                  onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Assign to Branch</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none font-medium cursor-pointer"
                  >
                    <option value="">All Active Branches</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Initial Stock (Units)</label>
                  <input
                    type="number"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 outline-none font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>✓ Save Medicine to DB</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
