"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";

import AdminDashboardOverview from "./components/AdminDashboardOverview";
import UserManagementView from "./components/UserManagementView";
import BranchManagementView from "./components/BranchManagementView";
import AnalyticsView from "./components/AnalyticsView";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Admin Profile Data
  const [user, setUser] = useState({
    fullName: "Elena Rostova",
    email: "elena.admin@rxconnect.com",
    phone: "+1 (555) 990-1122",
    role: "Regional Admin",
    employeeId: "ADM-001",
  });

  // Centralized State: Pharmacy Branches
  const [branches, setBranches] = useState([
    {
      id: "br-1",
      code: "BR-101",
      name: "Downtown Pharmacy",
      address: "104 Healthcare Boulevard, City Center",
      phone: "+1 (555) 443-9000",
      manager: "Dr. Sarah Jenkins",
      hours: "8:00 AM - 10:00 PM",
      fulfillmentRate: 97.4,
      ordersToday: 68,
      stockoutsToday: 1,
      status: "Active",
    },
    {
      id: "br-2",
      code: "BR-102",
      name: "Uptown Pharmacy",
      address: "789 Metro Plaza, 2nd Floor",
      phone: "+1 (555) 321-6540",
      manager: "Dr. Mark Thorne",
      hours: "8:30 AM - 9:00 PM",
      fulfillmentRate: 98.2,
      ordersToday: 42,
      stockoutsToday: 0,
      status: "Active",
    },
    {
      id: "br-3",
      code: "BR-103",
      name: "Westside Pharmacy",
      address: "550 West End Street",
      phone: "+1 (555) 888-2345",
      manager: "Dr. Amanda Lee",
      hours: "9:00 AM - 8:00 PM",
      fulfillmentRate: 88.5, // Low fulfillment bottleneck warning!
      ordersToday: 32,
      stockoutsToday: 4,
      status: "Active",
    },
  ]);

  // Centralized State: Registered System Users
  const [users, setUsers] = useState([
    {
      id: "USR-9901",
      fullName: "Customer Name",
      email: "customer@rxconnect.com",
      phone: "+1 (555) 234-5678",
      role: "Customer",
      branch: "—",
      status: "Active",
      joinedDate: "Jan 15, 2024",
    },
    {
      id: "USR-9902",
      fullName: "Dr. Sarah Jenkins",
      email: "sarah.j@rxconnect.com",
      phone: "+1 (555) 443-9000",
      role: "Pharmacist",
      branch: "Downtown Pharmacy",
      status: "Active",
      joinedDate: "Mar 10, 2023",
    },
    {
      id: "USR-9903",
      fullName: "Alex Rivera",
      email: "alex.rivera@rxconnect.com",
      phone: "+91 9876543210",
      role: "Delivery Partner",
      branch: "Downtown Pharmacy",
      status: "Active",
      joinedDate: "Feb 01, 2024",
    },
    {
      id: "USR-9904",
      fullName: "Elena Rostova",
      email: "elena.admin@rxconnect.com",
      phone: "+1 (555) 990-1122",
      role: "Admin",
      branch: "Regional HQ",
      status: "Active",
      joinedDate: "Jan 01, 2023",
    },
  ]);

  // Centralized State: Low Stock Items per Branch
  const [lowStockItems, setLowStockItems] = useState([
    {
      id: "LS-1",
      name: "Metformin 500mg",
      branch: "Westside Pharmacy",
      currentStock: 4,
      minThreshold: 20,
      rx: true,
    },
    {
      id: "LS-2",
      name: "Amoxicillin 500mg",
      branch: "Westside Pharmacy",
      currentStock: 2,
      minThreshold: 15,
      rx: true,
    },
    {
      id: "LS-3",
      name: "Ibuprofen 400mg",
      branch: "Downtown Pharmacy",
      currentStock: 8,
      minThreshold: 25,
      rx: false,
    },
  ]);

  // Handler: Restock Trigger
  const handleTriggerRestock = (item) => {
    setLowStockItems(lowStockItems.filter((i) => i.id !== item.id));
  };

  // Handler: Update User Role & Branch Assignment
  const handleUpdateUserRole = (userId, newRole, assignedBranch) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, role: newRole, branch: newRole === "Customer" ? "—" : assignedBranch } : u
      )
    );
  };

  // Handler: Add New Staff Member
  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users]);
  };

  // Handler: Branch Management
  const handleAddBranch = (newBranch) => {
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative pb-16">
      {/* Top Header */}
      <Header user={user} />

      {/* Sub Navigation Bar */}
      <div className="bg-white shadow-xs border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center overflow-x-auto no-scrollbar">
          <div className="flex space-x-6">
            {[
              { id: "dashboard", label: "Dashboard Overview", count: null },
              { id: "users", label: "User Management", count: users.length },
              { id: "branches", label: "Branch Management", count: branches.length },
              { id: "analytics", label: "Sales & Analytics", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      activeTab === tab.id ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-purple-50 text-purple-900 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-200">
            <span>🛡️ Regional Admin Access</span>
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
