"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";

export default function PharmacistDashboardPage() {
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [rejectingRx, setRejectingRx] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rxconnect_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed) setUser(parsed);
        } catch (e) {}
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      
      // Fetch Prescriptions Queue
      const rxRes = await fetch("http://localhost:5001/api/prescriptions", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const rxData = await rxRes.json();
      if (rxRes.ok && rxData.success) {
        setPrescriptions(
          (rxData.prescriptions || []).map((p) => ({
            id: p.id,
            customerName: p.user?.fullName || "Customer",
            doctorName: p.doctorName || "Doctor",
            notes: p.notes || "No special instructions",
            imageUrl: p.imageUrl
              ? p.imageUrl.startsWith("http")
                ? p.imageUrl
                : `http://localhost:5001${p.imageUrl}`
              : "https://placehold.co/600x400/0b193c/emerald?text=Prescription+Scan",
            status: p.status,
            rejectionReason: p.rejectionReason,
            uploadedAt: p.uploadedAt ? new Date(p.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          }))
        );
      }

      // Fetch Inventory
      const medRes = await fetch("http://localhost:5001/api/medicines");
      const medData = await medRes.json();
      if (medRes.ok && medData.success) {
        setInventory(
          (medData.medicines || []).map((m) => ({
            id: m.id,
            name: m.name,
            stock: m.inventories?.[0]?.quantity || 15,
            threshold: m.inventories?.[0]?.threshold || 10,
            isRx: m.prescriptionRequired,
            status: (m.inventories?.[0]?.quantity || 15) < (m.inventories?.[0]?.threshold || 10) ? "Low Stock Alert" : "Healthy",
          }))
        );
      }
    } catch (e) {
      console.error("Pharmacist data fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRx = async (id) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "APPROVED", rejectionReason: null } : p))
    );
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch(`http://localhost:5001/api/prescriptions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      });
    } catch (e) {}
  };

  const handleConfirmReject = async () => {
    if (!rejectingRx || !rejectionReason.trim()) return;

    const targetId = rejectingRx.id;
    const reasonText = rejectionReason.trim();

    setPrescriptions((prev) =>
      prev.map((p) => (p.id === targetId ? { ...p, status: "REJECTED", rejectionReason: reasonText } : p))
    );

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch(`http://localhost:5001/api/prescriptions/${targetId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "REJECTED", rejectionReason: reasonText }),
      });
    } catch (e) {}

    setRejectingRx(null);
    setRejectionReason("");
  };

  const handleRestockItem = async (medicineId, inventoryId) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === medicineId ? { ...i, stock: i.stock + 20 } : i))
    );
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch("http://localhost:5001/api/inventory/restock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ medicineId, inventoryId, amount: 20 }),
      });
    } catch (e) {
      console.warn("Restock API error:", e);
    }
  };

  const pendingCount = prescriptions.filter((p) => p.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative pb-16">
      {/* Top Header */}
      <Header user={user} />

      {/* Sub Navigation Bar */}
      <div className="bg-white shadow-xs border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center overflow-x-auto no-scrollbar">
          <div className="flex space-x-6">
            {[
              { id: "prescriptions", label: "Prescription Verification Queue", count: pendingCount },
              { id: "inventory", label: "Branch Stock & Thresholds", count: inventory.filter(i => i.stock < i.threshold).length },
              { id: "orders", label: "Rx Order Verification", count: null },
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
                {tab.count !== null && tab.count > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-200">
            <span>Licensed Pharmacist Queue</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8 w-full flex-1">
        {activeTab === "prescriptions" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pharmacist Prescription Verification</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Review customer uploaded doctor prescriptions. Hard gate compliance review before order fulfillment.
                </p>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full">
                Pending Reviews: {pendingCount}
              </span>
            </div>

            {/* Prescriptions Queue Grid */}
            {loading ? (
              <div className="p-8 text-center text-xs font-semibold text-slate-500">Loading prescription queue from database...</div>
            ) : prescriptions.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-slate-500">No prescriptions in verification queue.</div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={rx.imageUrl}
                        alt="Prescription document"
                        className="w-24 h-24 rounded-xl object-cover border border-slate-300 shadow-sm shrink-0 bg-white"
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-slate-900 text-base">{rx.customerName}</h3>
                          <span
                            className={`px-3 py-0.5 text-xs font-bold rounded-full border ${
                              rx.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : rx.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800 border-rose-300"
                                : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                            }`}
                          >
                            {rx.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          Prescribing Doctor: <strong className="text-slate-800">{rx.doctorName}</strong> • Uploaded {rx.uploadedAt}
                        </p>

                        <p className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 mt-2">
                          Notes: {rx.notes}
                        </p>

                        {rx.status === "REJECTED" && rx.rejectionReason && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold mt-2">
                            Rejection Reason: {rx.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {rx.status === "PENDING" && (
                      <div className="flex items-center gap-3 self-end lg:self-center shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200 w-full lg:w-auto justify-end">
                        <button
                          onClick={() => setRejectingRx(rx)}
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Reject Prescription
                        </button>

                        <button
                          onClick={() => handleApproveRx(rx.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span>✓ Approve & Verify</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-5">
              Branch Stock & Low Stock Thresholds
            </h2>
            {loading ? (
              <div className="p-8 text-center text-xs font-semibold text-slate-500">Loading stock levels from database...</div>
            ) : inventory.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-slate-500">No inventory items recorded in database.</div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {inventory.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">
                        Min Threshold: {item.threshold} units • {item.isRx ? "Prescription Required" : "OTC"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-extrabold ${item.stock < item.threshold ? "text-rose-600" : "text-emerald-700"}`}>
                        Current Stock: {item.stock}
                      </span>

                      <button
                        onClick={() => handleRestockItem(item.id)}
                        className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
                      >
                        + Restock 20
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reject Reason Modal */}
      {rejectingRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Reject Prescription</h3>
              <button onClick={() => setRejectingRx(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide a clear rejection reason for <strong className="text-slate-900">{rejectingRx.customerName}</strong>. This reason will be displayed on their customer dashboard.
            </p>

            <textarea
              rows="3"
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Prescription document is missing doctor registration seal / unreadable scan."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none"
            ></textarea>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingRx(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <SupportButton />
    </div>
  );
}
