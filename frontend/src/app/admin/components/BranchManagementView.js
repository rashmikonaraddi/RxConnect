"use client";

import React, { useState } from "react";

export default function BranchManagementView({ branches = [], onAddBranch, onUpdateBranch, onToggleBranchStatus }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
    manager: "",
    hours: "8:00 AM - 10:00 PM",
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    onAddBranch({
      id: `br-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      manager: formData.manager || "Unassigned",
      hours: formData.hours,
      fulfillmentRate: 98.0,
      ordersToday: 0,
      stockoutsToday: 0,
      status: "Active",
    });

    setShowAddModal(false);
    setFormData({ code: "", name: "", address: "", phone: "", manager: "", hours: "8:00 AM - 10:00 PM" });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      onUpdateBranch({ ...editingBranch, ...formData });
      setEditingBranch(null);
    }
  };

  const openEdit = (b) => {
    setEditingBranch(b);
    setFormData({
      code: b.code,
      name: b.name,
      address: b.address,
      phone: b.phone,
      manager: b.manager,
      hours: b.hours,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pharmacy Branch Network Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure independent physical branches, branch managers, and operational statuses.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ code: `BR-${branches.length + 101}`, name: "", address: "", phone: "", manager: "", hours: "8:00 AM - 10:00 PM" });
            setShowAddModal(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-2"
        >
          <span>🏥 Register New Branch</span>
        </button>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{b.code}</span>
                  <h3 className="text-base font-extrabold text-slate-900">{b.name}</h3>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  b.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : b.status === "Maintenance"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {b.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 mt-3">
                <p className="flex items-center gap-1.5">
                  <span>📍</span> {b.address}
                </p>
                <p className="flex items-center gap-1.5 font-mono">
                  <span>📞</span> {b.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <span>👤</span> Manager: <span className="font-bold text-slate-800">{b.manager}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <span>🕒</span> {b.hours}
                </p>
              </div>
            </div>

            {/* Performance Stats Sub-bar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Fulfillment</p>
                <p className={`font-bold ${b.fulfillmentRate >= 95 ? "text-emerald-600" : "text-amber-600"}`}>
                  {b.fulfillmentRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Orders Today</p>
                <p className="font-bold text-slate-800">{b.ordersToday}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => openEdit(b)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-lg transition-colors border border-slate-300"
              >
                ✏️ Edit Branch
              </button>
              <button
                onClick={() => onToggleBranchStatus(b.id)}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 transition-colors"
              >
                Toggle Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Register New Pharmacy Branch
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Branch Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Westside Branch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Health Ave, Suite 100"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Manager</label>
                  <input
                    type="text"
                    placeholder="Pharmacist in charge"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg"
              >
                Save Branch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Edit Branch: {editingBranch.name}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Manager</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg"
              >
                Update Branch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
