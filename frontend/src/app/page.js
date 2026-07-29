"use client";

import { useState } from "react";
import {redirect} from "next/navigation";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/ProfileView";
import DashboardOverview from "@/components/DashboardOverview";
import PharmaciesView from "@/components/PharmaciesView";
import BrowseMedicinesView from "@/components/BrowseMedicinesView";
import UploadPrescriptionView from "@/components/UploadPrescriptionView";
import SupportButton from "@/components/SupportButton";
import BrowseMedicines from "@/components/BrowseMedicines";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState({
    fullName: "Customer Name",
    email: "customer@rxconnect.com",
    phone: "+91 98765 43210",
    customerId: "RX-9948201",
    preferredPharmacy: "Downtown Pharmacy - City Center",
    deliveryAddress: "742 Evergreen Terrace, Springfield",
    emergencyContact: "Emergency Contact (+91 98765 99999)",
    joinedDate: "January 15, 2024",
  });

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative pb-16">
      {/* Top Header Banner */}
      <Header user={user} />

      {/* Sub Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 mt-6 w-full flex-1">
        {activeTab === "profile" && (
          <ProfileView user={user} onUpdateUser={handleUpdateUser} />
        )}

        {activeTab === "dashboard" && <DashboardOverview />}

        {activeTab === "browseMedicines" && (
          <BrowseMedicines />
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
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900">Place Order</h2>
            <p className="text-slate-500 text-xs mt-2">
              Select your OTC items or verified prescription items to place an order.
            </p>
          </div>
        )}

        {activeTab === "pharmacies" && <PharmaciesView />}
      </main>

      {/* Floating Support Button */}
      <SupportButton />
    </div>
  );
}