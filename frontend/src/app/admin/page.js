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
  const [user, setUser] = useState({
    fullName: "Elena Rostova",
    email: "elena.admin@rxconnect.com",
    phone: "+91 98765 99999",
    role: "ADMIN",
    employeeId: "ADM-001",
  });

  // Centralized State: Pharmacy Branches
  const [branches, setBranches] = useState([
    {
      id: "br-101",
      code: "BR-101",
      name: "Central Health Pharmacy - Downtown",
      address: "742 Evergreen Terrace, Springfield",
      phone: "+91 98765 43210",
      manager: "Dr. Sarah Jenkins",
      hours: "8:00 AM - 10:00 PM",
      fulfillmentRate: 96.5,
      ordersToday: 68,
      stockoutsToday: 1,
      status: "Active",
    },
    {
      id: "br-102",
      code: "BR-102",
      name: "MetroCare Pharmacy - Westside",
      address: "104 Healthcare Blvd, Suite 2B",
      phone: "+91 98765 88112",
      manager: "Dr. Mark Thorne",
      hours: "8:30 AM - 9:00 PM",
      fulfillmentRate: 84.2, // Bottleneck Alert (<90%)
      ordersToday: 42,
      stockoutsToday: 5,
      status: "Active",
    },
    {
      id: "br-103",
      code: "BR-103",
      name: "RxExpress Express - North Depot",
      address: "55 Logistics Hub, North Wing",
      phone: "+91 98765 11990",
      manager: "Dr. Amanda Lee",
      hours: "9:00 AM - 8:00 PM",
      fulfillmentRate: 98.0,
      ordersToday: 56,
      stockoutsToday: 0,
      status: "Active",
    },
  ]);

  // Centralized State: Registered System Users
  const [users, setUsers] = useState([
    {
      id: "USR-9901",
      fullName: "Anita Sharma",
      email: "anita.s@example.com",
      phone: "+91 98765 33333",
      role: "CUSTOMER",
      branch: "—",
      status: "Active",
      joinedDate: "Jan 15, 2024",
    },
    {
      id: "USR-9902",
      fullName: "Dr. Sarah Jenkins",
      email: "sarah.j@rxconnect.com",
      phone: "+91 98765 11111",
      role: "PHARMACIST",
      branch: "Central Health Pharmacy - Downtown",
      status: "Active",
      joinedDate: "Mar 10, 2023",
    },
    {
      id: "USR-9903",
      fullName: "Rahul Verma",
      email: "rahul.v@rxconnect.com",
      phone: "+91 98765 22222",
      role: "DELIVERY_PARTNER",
      branch: "Central Health Pharmacy - Downtown",
      status: "Active",
      joinedDate: "Feb 01, 2024",
    },
    {
      id: "USR-9904",
      fullName: "Elena Rostova",
      email: "elena.admin@rxconnect.com",
      phone: "+91 98765 99999",
      role: "ADMIN",
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
      branch: "MetroCare Pharmacy - Westside",
      currentStock: 4,
      minThreshold: 20,
      rx: true,
    },
    {
      id: "LS-2",
      name: "Amoxicillin 500mg",
      branch: "MetroCare Pharmacy - Westside",
      currentStock: 2,
      minThreshold: 15,
      rx: true,
    },
    {
      id: "LS-3",
      name: "Ibuprofen 400mg",
      branch: "Central Health Pharmacy - Downtown",
      currentStock: 8,
      minThreshold: 25,
      rx: false,
    },
  ]);

  // Fetch Real-time Admin Overview from Backend API
  useEffect(() => {
    async function fetchAdminOverview() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/admin/overview", {
          headers: {
            "x-user-id": "ADM-001",
            "x-user-role": "ADMIN",
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            console.log("Admin Overview fetched from backend:", json.data);
          }
        }
      } catch (err) {
        console.warn("Backend API offline, using pre-seeded state fallback.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdminOverview();
  }, []);

  // Handler: Restock Trigger
  const handleTriggerRestock = (item) => {
    setLowStockItems(lowStockItems.filter((i) => i.id !== item.id));
  };

  // Handler: Update User Role & Branch Assignment (Issue #44)
  const handleUpdateUserRole = async (userId, newRole, assignedBranch) => {
    try {
      await fetch(`http://localhost:5001/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "ADM-001",
          "x-user-role": "ADMIN",
        },
        body: JSON.stringify({ role: newRole, branchId: assignedBranch }),
      });
    } catch (err) {
      console.warn("Backend patch failed, updating local state fallback.");
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

  // Handler: Branch Management (Issue #45)
  const handleAddBranch = async (newBranch) => {
    try {
      await fetch("http://localhost:5001/api/admin/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "ADM-001",
          "x-user-role": "ADMIN",
        },
        body: JSON.stringify(newBranch),
      });
    } catch (err) {
      console.warn("Backend post failed, updating local state fallback.");
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
