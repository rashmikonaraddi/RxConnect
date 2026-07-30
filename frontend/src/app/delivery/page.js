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
  const [user, setUser] = useState({
    fullName: "Alex Rivera",
    email: "alex.rivera@rxconnect.com",
    phone: "+91 9876543210",
    role: "DELIVERY_PARTNER",
    employeeId: "DEL-002",
    vehicle: "Honda Activa 6G (KA-19-EX-1234)",
    zone: "Downtown & Central District",
  });

  // Centralized State
  const [availableJobs, setAvailableJobs] = useState([
    {
      id: "ord-1048",
      status: "Packed",
      pickupBranch: "Central Health Pharmacy - East Branch",
      branchAddress: "402 Medical Drive, Suite 10",
      branchPhone: "+91 98765 43210",
      destination: "882 Park Avenue, Apt 12B",
      customer: "Emily Watson",
      customerPhone: "+91 98765 12345",
      payout: "₹180",
      distance: "4.1 km",
      rxRequired: true,
      pharmacistName: "Dr. Robert Vance",
      notes: "Fragile medication - handle with care.",
      items: [
        { name: "Metformin 500mg", qty: "1 Bottle", rx: true, price: "₹220" },
        { name: "Multivitamin Daily Plus", qty: "1 Bottle", rx: false, price: "₹145" },
      ],
    },
    {
      id: "ord-1050",
      status: "Packed",
      pickupBranch: "Downtown Pharmacy",
      branchAddress: "104 Healthcare Boulevard",
      branchPhone: "+91 98765 99000",
      destination: "55 West End Street, House 4",
      customer: "Michael Chang",
      customerPhone: "+91 98765 67890",
      payout: "₹120",
      distance: "1.8 km",
      rxRequired: false,
      pharmacistName: "Dr. Sarah Jenkins",
      items: [
        { name: "Ibuprofen 400mg", qty: "2 Packs", rx: false, price: "₹80" },
      ],
    },
  ]);

  const [activeJobs, setActiveJobs] = useState([
    {
      id: "ord-1042",
      status: "Out for Delivery",
      pickupBranch: "Downtown Pharmacy",
      branchAddress: "104 Healthcare Boulevard",
      branchPhone: "+91 98765 99000",
      destination: "123 Main St, Apt 4B",
      customer: "John Doe",
      customerPhone: "+91 98765 23456",
      payout: "₹150",
      distance: "2.5 km",
      rxRequired: true,
      pharmacistName: "Dr. Sarah Jenkins",
      notes: "Ring doorbell twice. Customer is expecting order.",
      items: [
        { name: "Amoxicillin 500mg", qty: "1 Box", rx: true, price: "₹185" },
        { name: "Vitamin C 1000mg Effervescent", qty: "2 Packs", rx: false, price: "₹120" },
      ],
    },
  ]);

  const [historyJobs, setHistoryJobs] = useState([
    {
      id: "ord-0998",
      status: "Delivered",
      pickupBranch: "Downtown Pharmacy",
      branchAddress: "104 Healthcare Boulevard",
      destination: "789 Pine Rd, Apt 2",
      customer: "David Miller",
      customerPhone: "+91 98765 65432",
      payout: "₹160",
      distance: "2.1 km",
      rxRequired: true,
      time: "10:30 AM Today",
      items: [
        { name: "Lisinopril 10mg", qty: "1 Bottle", rx: true, price: "₹150" },
      ],
    },
  ]);

  // Fetch Delivery Data from Backend APIs (Issues #39, #40, #41, #42)
  useEffect(() => {
    async function fetchDeliveryData() {
      const authHeaders = {
        "x-user-id": "DEL-002",
        "x-user-role": "DELIVERY_PARTNER",
      };

      // 1. Available Jobs
      try {
        const resAvail = await fetch("http://localhost:5001/api/delivery/available", { headers: authHeaders });
        if (resAvail.ok) {
          const jsonAvail = await resAvail.json();
          if (jsonAvail.success && jsonAvail.data && jsonAvail.data.length > 0) {
            setAvailableJobs(
              jsonAvail.data.map((j) => ({
                id: j.id,
                status: j.status === "PACKED" ? "Packed" : j.status,
                pickupBranch: j.branch?.name || "Central Health Pharmacy",
                branchAddress: j.branch?.address || "402 Medical Drive",
                branchPhone: j.branch?.phone || "+91 98765 43210",
                destination: j.destination,
                customer: j.customer?.fullName || "Emily Watson",
                customerPhone: j.customer?.phone || "+91 98765 12345",
                payout: `₹${j.deliveryPayout || 150}`,
                distance: "3.2 km",
                rxRequired: j.isPrescriptionVerified,
                pharmacistName: "Dr. Sarah Jenkins",
                notes: j.notes || "Handle with care.",
                items: j.items || [],
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Backend API offline, using in-memory state fallback.");
      }

      // 2. Active Jobs
      try {
        const resActive = await fetch("http://localhost:5001/api/delivery/active", { headers: authHeaders });
        if (resActive.ok) {
          const jsonActive = await resActive.json();
          if (jsonActive.success && jsonActive.data && jsonActive.data.length > 0) {
            setActiveJobs(
              jsonActive.data.map((j) => ({
                id: j.id,
                status: j.status === "OUT_FOR_DELIVERY" ? "Out for Delivery" : j.status === "PACKED" ? "Packed" : j.status,
                pickupBranch: j.branch?.name || "Downtown Pharmacy",
                branchAddress: j.branch?.address || "104 Healthcare Boulevard",
                branchPhone: j.branch?.phone || "+91 98765 99000",
                destination: j.destination,
                customer: j.customer?.fullName || "John Doe",
                customerPhone: j.customer?.phone || "+91 98765 23456",
                payout: `₹${j.deliveryPayout || 150}`,
                distance: "2.5 km",
                rxRequired: j.isPrescriptionVerified,
                notes: j.notes || "Ring doorbell twice.",
                items: j.items || [],
              }))
            );
          }
        }
      } catch (err) {}

      // 3. Delivery History
      try {
        const resHist = await fetch("http://localhost:5001/api/delivery/history", { headers: authHeaders });
        if (resHist.ok) {
          const jsonHist = await resHist.json();
          if (jsonHist.success && jsonHist.data && jsonHist.data.length > 0) {
            setHistoryJobs(
              jsonHist.data.map((j) => ({
                id: j.id,
                status: "Delivered",
                pickupBranch: j.branch?.name || "Downtown Pharmacy",
                branchAddress: j.branch?.address || "104 Healthcare Blvd",
                destination: j.destination,
                customer: j.customer?.fullName || "David Miller",
                customerPhone: j.customer?.phone || "+91 98765 65432",
                payout: `₹${j.deliveryPayout || 160}`,
                distance: "2.1 km",
                rxRequired: j.isPrescriptionVerified,
                time: j.deliveredAt ? new Date(j.deliveredAt).toLocaleTimeString("en-IN") + " IST" : "Today",
                items: j.items || [],
              }))
            );
          }
        }
      } catch (err) {}
    }

    fetchDeliveryData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Issue #40: Claim Job Backend Integration
  const handleClaimJob = async (jobId) => {
    const jobToClaim = availableJobs.find((j) => j.id === jobId);
    if (!jobToClaim) return;

    try {
      const res = await fetch(`http://localhost:5001/api/delivery/claim/${jobId}`, {
        method: "POST",
        headers: {
          "x-user-id": "DEL-002",
          "x-user-role": "DELIVERY_PARTNER",
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.message || "Failed to claim order. Hard gate safety check failed.");
        return;
      }
    } catch (err) {
      console.warn("Backend API offline, claiming locally.");
    }

    setAvailableJobs(availableJobs.filter((j) => j.id !== jobId));
    setActiveJobs([{ ...jobToClaim, status: "Packed" }, ...activeJobs]);
    showToast(`⚡ Order #${jobId} claimed! Moved to Active Deliveries.`);
  };

  // Issue #41: Update Status Backend Integration
  const handleUpdateJobStatus = async (jobId, deliveryNote = "") => {
    const job = activeJobs.find((j) => j.id === jobId);
    if (!job) return;

    const targetStatus = job.status === "Packed" ? "OUT_FOR_DELIVERY" : "DELIVERED";

    try {
      await fetch(`http://localhost:5001/api/delivery/status/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "DEL-002",
          "x-user-role": "DELIVERY_PARTNER",
        },
        body: JSON.stringify({ status: targetStatus, notes: deliveryNote || job.notes }),
      });
    } catch (err) {
      console.warn("Backend API status patch failed, updating locally.");
    }

    if (job.status === "Packed") {
      setActiveJobs(
        activeJobs.map((j) => (j.id === jobId ? { ...j, status: "Out for Delivery" } : j))
      );
      showToast(`📦 Order #${jobId} status updated to Out for Delivery!`);
    } else if (job.status === "Out for Delivery") {
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
      showToast(`✅ Order #${jobId} successfully delivered! Payout added.`);
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