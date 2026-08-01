"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";
import DeliveryJobsView from "./components/DeliveryJobsView";
import DeliveryHistoryView from "./components/DeliveryHistoryView";
import DeliveryProfileView from "./components/DeliveryProfileView";
import DeliveryDetailsModal from "./components/DeliveryDetailsModal";

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState("activeJobs");
  const [driverStatus, setDriverStatus] = useState("On Duty");
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState("active");

  // User Profile Data
  const [user, setUser] = useState(null);

  // Centralized State
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [historyJobs, setHistoryJobs] = useState([]);

  // Fetch Delivery Data from Backend APIs
  useEffect(() => {
    async function loadDriverAndJobs() {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      const headers = { Authorization: token ? `Bearer ${token}` : "" };

      // 0. Driver Profile
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

      // 1. Available Jobs
      try {
        const resAvail = await fetch("http://localhost:5001/api/delivery/available", { headers });
        if (resAvail.ok) {
          const jsonAvail = await resAvail.json();
          if (jsonAvail.success && Array.isArray(jsonAvail.data)) {
            setAvailableJobs(
              jsonAvail.data.map((j) => ({
                id: j.id,
                status: j.status === "PACKED" ? "Packed" : j.status,
                pickupBranch: j.branch?.name || "RxConnect Pharmacy",
                branchAddress: j.branch?.address || "Medical Drive",
                branchPhone: j.branch?.phone || "+91 98765 43210",
                destination: j.destination,
                customer: j.customer?.fullName || "Customer",
                customerPhone: j.customer?.phone || "+91 98765 12345",
                payout: `₹${j.deliveryPayout || 150}`,
                distance: "2.5 km",
                rxRequired: Boolean(j.isPrescriptionVerified),
                pharmacistName: "Rx Pharmacist",
                notes: j.notes || "Handle with care.",
                items: (j.items || []).map((i) => ({
                  name: i.medicineName,
                  qty: `${i.quantity} Unit(s)`,
                  rx: i.isRx,
                  price: `₹${i.price}`,
                })),
              }))
            );
          }
        }
      } catch (err) {}

      // 2. Active Jobs
      try {
        const resActive = await fetch("http://localhost:5001/api/delivery/active", { headers });
        if (resActive.ok) {
          const jsonActive = await resActive.json();
          if (jsonActive.success && Array.isArray(jsonActive.data)) {
            setActiveJobs(
              jsonActive.data.map((j) => ({
                id: j.id,
                status: j.status === "OUT_FOR_DELIVERY" ? "Out for Delivery" : j.status === "PACKED" ? "Packed" : j.status,
                pickupBranch: j.branch?.name || "RxConnect Pharmacy",
                branchAddress: j.branch?.address || "Healthcare Boulevard",
                branchPhone: j.branch?.phone || "+91 98765 99000",
                destination: j.destination,
                customer: j.customer?.fullName || "Customer",
                customerPhone: j.customer?.phone || "+91 98765 23456",
                payout: `₹${j.deliveryPayout || 150}`,
                distance: "2.5 km",
                rxRequired: Boolean(j.isPrescriptionVerified),
                notes: j.notes || "Ring doorbell twice.",
                items: (j.items || []).map((i) => ({
                  name: i.medicineName,
                  qty: `${i.quantity} Unit(s)`,
                  rx: i.isRx,
                  price: `₹${i.price}`,
                })),
              }))
            );
          }
        }
      } catch (err) {}

      // 3. Delivery History
      try {
        const resHist = await fetch("http://localhost:5001/api/delivery/history", { headers });
        if (resHist.ok) {
          const jsonHist = await resHist.json();
          if (jsonHist.success && Array.isArray(jsonHist.data)) {
            setHistoryJobs(
              jsonHist.data.map((j) => ({
                id: j.id,
                status: "Delivered",
                pickupBranch: j.branch?.name || "RxConnect Pharmacy",
                branchAddress: j.branch?.address || "Healthcare Blvd",
                destination: j.destination,
                customer: j.customer?.fullName || "Customer",
                customerPhone: j.customer?.phone || "+91 98765 65432",
                payout: `₹${j.deliveryPayout || 160}`,
                distance: "2.1 km",
                rxRequired: Boolean(j.isPrescriptionVerified),
                time: j.deliveredAt ? new Date(j.deliveredAt).toLocaleTimeString("en-IN") + " IST" : "Today",
                items: (j.items || []).map((i) => ({
                  name: i.medicineName,
                  qty: `${i.quantity} Unit(s)`,
                  rx: i.isRx,
                  price: `₹${i.price}`,
                })),
              }))
            );
          }
        }
      } catch (err) {}
    }

    loadDriverAndJobs();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Claim Job Backend Integration
  const handleClaimJob = async (jobId) => {
    const jobToClaim = availableJobs.find((j) => j.id === jobId);
    if (!jobToClaim) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      const res = await fetch(`http://localhost:5001/api/delivery/claim/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.message || "Failed to claim order.");
        return;
      }
    } catch (err) {
      console.warn("Claim job error:", err);
    }

    setAvailableJobs(availableJobs.filter((j) => j.id !== jobId));
    setActiveJobs([{ ...jobToClaim, status: "Packed" }, ...activeJobs]);
    showToast(`Order #${jobId} claimed! Moved to Active Deliveries.`);
  };

  // Update Status Backend Integration
  const handleUpdateJobStatus = async (jobId, deliveryNote = "") => {
    const job = activeJobs.find((j) => j.id === jobId);
    if (!job) return;

    const targetStatus = job.status === "Packed" || job.status === "PLACED" ? "OUT_FOR_DELIVERY" : "DELIVERED";

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch(`http://localhost:5001/api/delivery/status/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: targetStatus, notes: deliveryNote || job.notes }),
      });
    } catch (err) {
      console.warn("Status update error:", err);
    }

    if (job.status === "Packed" || job.status === "PLACED") {
      setActiveJobs(
        activeJobs.map((j) => (j.id === jobId ? { ...j, status: "Out for Delivery" } : j))
      );
      showToast(`Order #${jobId} status updated to Out for Delivery!`);
    } else {
      setActiveJobs(activeJobs.filter((j) => j.id !== jobId));
      setHistoryJobs([
        {
          ...job,
          status: "Delivered",
          time: "Just Now",
          notes: deliveryNote || job.notes,
        },
        ...historyJobs,
      ]);
      showToast(`Order #${jobId} successfully delivered! Payout added.`);
    }
  };

  const handleOpenDetails = (job, mode) => {
    setSelectedJob(job);
    setModalMode(mode);
  };

  const totalEarningsToday = historyJobs.reduce((acc, job) => {
    const amount = parseFloat((job.payout || "₹150").replace("₹", "")) || 150;
    return acc + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative pb-16">
      {/* Header */}
      <Header user={user} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Stats Banner */}
      <div className="bg-slate-900 text-white py-8 border-b border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Active Deliveries
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-blue-400">{activeJobs.length}</h3>
              <span className="text-[11px] text-slate-400 font-normal">in progress</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Available to Claim
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-amber-400">{availableJobs.length}</h3>
              <span className="text-[11px] text-slate-400 font-normal">at branches</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Completed & Earned
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-emerald-400">
                ₹{totalEarningsToday.toFixed(2)}
              </h3>
              <span className="text-[11px] text-slate-400 font-normal">({historyJobs.length} orders)</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xs">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Driver Rating
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-amber-300">4.9 ★</h3>
              <span className="text-[11px] text-slate-400 font-normal">98.4% on-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-white shadow-xs border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-6 overflow-x-auto no-scrollbar">
            {[
              { id: "activeJobs", label: "Active Deliveries", count: activeJobs.length },
              { id: "availableJobs", label: "Available Jobs (Claim)", count: availableJobs.length },
              { id: "history", label: "Delivery History", count: historyJobs.length },
              { id: "profile", label: "Driver Profile", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const newStatus = driverStatus === "On Duty" ? "Off Duty" : "On Duty";
              setDriverStatus(newStatus);
              showToast(`Driver status set to ${newStatus}`);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              driverStatus === "On Duty"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-slate-100 text-slate-600 border-slate-300"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${driverStatus === "On Duty" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
            {driverStatus}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 mt-8 w-full flex-1">
        {activeTab === "activeJobs" && (
          <DeliveryJobsView
            jobs={activeJobs}
            mode="active"
            onUpdateStatus={handleUpdateJobStatus}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activeTab === "availableJobs" && (
          <DeliveryJobsView
            jobs={availableJobs}
            mode="available"
            onUpdateStatus={handleClaimJob}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activeTab === "history" && (
          <DeliveryHistoryView
            jobs={historyJobs}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activeTab === "profile" && (
          <DeliveryProfileView
            user={user}
            onUpdateUser={setUser}
            driverStatus={driverStatus}
            onToggleStatus={() => setDriverStatus(driverStatus === "On Duty" ? "Off Duty" : "On Duty")}
          />
        )}
      </main>

      {/* Details & Confirmation Modal */}
      {selectedJob && (
        <DeliveryDetailsModal
          job={selectedJob}
          mode={modalMode}
          onClose={() => setSelectedJob(null)}
          onUpdateStatus={(jobId, note) => {
            if (modalMode === "available") {
              handleClaimJob(jobId);
            } else {
              handleUpdateJobStatus(jobId, note);
            }
          }}
        />
      )}

      <SupportButton />
    </div>
  );
}