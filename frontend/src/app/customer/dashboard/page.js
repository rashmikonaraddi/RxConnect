"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/ProfileView";
import DashboardOverview from "@/components/DashboardOverview";
import PharmaciesView from "@/components/PharmaciesView";
import SupportButton from "@/components/SupportButton";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState(null);

useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    const signupUser = JSON.parse(savedUser);

    setUser({
      ...signupUser,
      customerId:
        signupUser.customerId ||
        "RX-" + Math.floor(Math.random() * 1000000),

      preferredPharmacy:
        signupUser.preferredPharmacy || "",

      deliveryAddress:
        signupUser.deliveryAddress || "",

      emergencyContact:
        signupUser.emergencyContact || "",

      joinedDate:
        signupUser.joinedDate ||
        new Date().toLocaleDateString(),
    });
  }
}, []);

 const handleUpdateUser = (updatedUser) => {
  setUser(updatedUser);

  localStorage.setItem(
    "user",
    JSON.stringify(updatedUser)
  );
};
if (!user) {
  return <div>Loading...</div>;
}
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative pb-16">
      {/* Top Navy Header Banner */}
      <Header user={user} />

      {/* Sub Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 mt-6 w-full flex-1">
        {activeTab === "profile" && (
          <ProfileView user={user} onUpdateUser={handleUpdateUser} />
        )}

        {activeTab === "dashboard" && (
          <DashboardOverview />
        )}

        {activeTab === "browseMedicines" && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">
              Browse Medicines
            </h2>
            <p className="text-slate-500 mt-2">
              This feature is under development.
            </p>
          </div>
        )}

        {activeTab === "uploadPrescription" && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">
              Upload Prescription
            </h2>
            <p className="text-slate-500 mt-2">
              This feature is under development.
            </p>
          </div>
        )}

        {activeTab === "placeOrder" && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">
              Place Order
            </h2>
            <p className="text-slate-500 mt-2">
              This feature is under development.
            </p>
          </div>
        )}

        {activeTab === "pharmacies" && (
          <PharmaciesView />
        )}
      </main>

      {/* Floating Support Button */}
      <SupportButton />
    </div>
  );
}