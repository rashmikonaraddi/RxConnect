"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";

import AdminDashboardOverview from "./components/AdminDashboardOverview";
import UserManagementView from "./components/UserManagementView";
import BranchManagementView from "./components/BranchManagementView";
import AnalyticsView from "./components/AnalyticsView";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);

  // Admin Profile Data
  const [user, setUser] = useState(null);

  // Centralized State
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  // Fetch Real-time Admin Data from Backend APIs
  useEffect(() => {
    async function fetchAdminData() {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      const headers = { Authorization: token ? `Bearer ${token}` : "" };

      // 0. Profile
      try {
        const storedUser = localStorage.getItem("rxconnect_user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const meRes = await fetch("http://localhost:5001/api/auth/me", { headers });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.success && meData.user) {
            setUser(meData.user);
            localStorage.setItem("rxconnect_user", JSON.stringify(meData.user));
          }
        }
      } catch (err) {}

      // 1. Branches
      try {
        const resBranch = await fetch("http://localhost:5001/api/admin/branches", { headers });
        if (resBranch.ok) {
          const jsonBranch = await resBranch.json();
          if (jsonBranch.success && Array.isArray(jsonBranch.data)) {
            setBranches(
              jsonBranch.data.map((b) => ({
                id: b.id,
                code: b.code || `BR-${b.id.slice(0, 4).toUpperCase()}`,
                name: b.name,
                address: b.address || "Main Street",
                phone: b.phone || "+91 98765 43210",
                manager: "Dr. Pharmacy Manager",
                hours: "8:00 AM - 10:00 PM",
                fulfillmentRate: b.fulfillmentRate || 95.0,
                ordersToday: b.activeOrders || 0,
                stockoutsToday: 0,
                status: b.isOperational !== false ? "Active" : "Maintenance",
              }))
            );
          }
        }
      } catch (err) {}

      // 2. Users
      try {
        const resUser = await fetch("http://localhost:5001/api/admin/users", { headers });
        if (resUser.ok) {
          const jsonUser = await resUser.json();
          if (jsonUser.success && Array.isArray(jsonUser.data)) {
            setUsers(
              jsonUser.data.map((u) => ({
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                phone: u.phone || "+91 98765 00000",
                role: u.role,
                branch: u.branch?.name || "—",
                status: "Active",
                joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
              }))
            );
          }
        }
      } catch (err) {}

      // 3. Overview Metrics
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/admin/overview", { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            console.log("Admin Overview fetched from backend:", json.data);
          }
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  // Handler: Restock Trigger
  const handleTriggerRestock = (item) => {
    setLowStockItems(lowStockItems.filter((i) => i.id !== item.id));
  };

  // Handler: Update User Role & Branch Assignment
  const handleUpdateUserRole = async (userId, newRole, assignedBranch) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch(`http://localhost:5001/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ role: newRole, branchId: assignedBranch }),
      });
    } catch (err) {
      console.warn("Backend role patch error:", err);
    }

    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, role: newRole, branch: newRole === "CUSTOMER" ? "—" : assignedBranch }
          : u
      )
    );
  };

  // Handler: Add New Staff Member
  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users]);
  };

  // Handler: Branch Management
  const handleAddBranch = async (newBranch) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch("http://localhost:5001/api/admin/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newBranch),
      });
    } catch (err) {
      console.warn("Backend branch creation error:", err);
    }
    setBranches([...branches, newBranch]);
  };

  const handleUpdateBranch = (updatedBranch) => {
    setBranches(branches.map((b) => (b.id === updatedBranch.id ? updatedBranch : b)));
  };

  const handleToggleBranchStatus = (branchId) => {
    setBranches(
      branches.map((b) => {
        if (b.id === branchId) {
          const nextStatus = b.status === "Active" ? "Maintenance" : "Active";
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative pb-16">
      {/* Top Header */}
      <Header user={user} />

      {/* Sub Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 shadow-xs border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center overflow-x-auto no-scrollbar">
          <div className="flex space-x-6">
            {[
              { id: "dashboard", label: "Dashboard Overview", count: null },
              { id: "users", label: "User Management", count: users.length },
              { id: "branches", label: "Branch Management", count: branches.length },
              { id: "analytics", label: "Sales & Analytics (INR ₹)", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-700 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      activeTab === tab.id ? "bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-300 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800">
            <span>🛡️ Admin Control Portal</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8 w-full flex-1">
        {activeTab === "dashboard" && (
          <AdminDashboardOverview
            branches={branches}
            lowStockItems={lowStockItems}
            onTriggerRestock={handleTriggerRestock}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "users" && (
          <UserManagementView
            users={users}
            branches={branches}
            onUpdateUserRole={handleUpdateUserRole}
            onAddUser={handleAddUser}
          />
        )}

        {activeTab === "branches" && (
          <BranchManagementView
            branches={branches}
            onAddBranch={handleAddBranch}
            onUpdateBranch={handleUpdateBranch}
            onToggleBranchStatus={handleToggleBranchStatus}
          />
        )}

        {activeTab === "analytics" && <AnalyticsView branches={branches} />}
      </main>

      <SupportButton />
    </div>
  );
}
