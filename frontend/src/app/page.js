"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/ProfileView";
import DashboardOverview from "@/components/DashboardOverview";
import PharmaciesView from "@/components/PharmaciesView";
import SupportButton from "@/components/SupportButton";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState({
    fullName: "Customer Name",
    email: "customer@rxconnect.com",
    phone: "+1 (555) 234-5678",
    customerId: "RX-9948201",
    preferredPharmacy: "HealthFirst Central Pharmacy - Downtown",
    deliveryAddress: "742 Evergreen Terrace, Springfield, IL 62704",
    emergencyContact: "Emergency Contact (+1 555-987-6543)",
    joinedDate: "January 15, 2024",
  });

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

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