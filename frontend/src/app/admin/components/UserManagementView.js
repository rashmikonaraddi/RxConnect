"use client";

import React, { useState } from "react";

export default function UserManagementView({ users = [], branches = [], onUpdateUserRole, onAddUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Modals
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("Customer");
  const [assignedBranch, setAssignedBranch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Pharmacist",
    branch: branches[0]?.name || "Downtown Pharmacy",
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.id && u.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenEditRole = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
    setAssignedBranch(user.branch || branches[0]?.name || "Downtown Pharmacy");
  };

  const handleSaveRole = () => {
    if (editingUser) {
      onUpdateUserRole(editingUser.id, newRole, assignedBranch);
      setEditingUser(null);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email) return;

    onAddUser({
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      phone: newUserForm.phone || "+1 (555) 000-0000",
      role: newUserForm.role,
      branch: newUserForm.role === "Customer" ? "-" : newUserForm.branch,
      status: "Active",
      joinedDate: "Just Now",
    });

    setShowAddModal(false);
    setNewUserForm({
      fullName: "",
      email: "",
      phone: "",
      role: "Pharmacist",
      branch: branches[0]?.name || "Downtown Pharmacy",
    });
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pharmacist":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivery Partner":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            User & Role Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View registered users, promote staff members, and assign branch locations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-2"
        >
          <span>➕ Add Staff Member</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search users by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Delivery Partner">Delivery Partner</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">User / Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Branch</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shrink-0">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.fullName}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{u.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold border text-[10px] ${getRoleBadgeStyle(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      {u.branch || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        u.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {u.joinedDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenEditRole(u)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Update Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Update Role: {editingUser.fullName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select System Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Delivery Partner">Delivery Partner</option>
                  <option value="Admin">Admin / Regional Overseer</option>
                </select>
              </div>

              {newRole !== "Customer" && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Assign Pharmacy Branch</label>
                  <select
                    value={assignedBranch}
                    onChange={(e) => setAssignedBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-medium"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                Save Role & Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Add New Staff Member
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Smith"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane.smith@rxconnect.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 345-6789"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold outline-none"
                  >
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Delivery Partner">Delivery Partner</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Branch</label>
                  <select
                    value={newUserForm.branch}
                    onChange={(e) => setNewUserForm({ ...newUserForm, branch: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Create Staff Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
