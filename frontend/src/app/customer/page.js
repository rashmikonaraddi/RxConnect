"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";
import DashboardOverview from "@/components/DashboardOverview";
import BrowseMedicinesView from "@/components/BrowseMedicinesView";
import PrescriptionsView from "@/components/PrescriptionsView";
import OrdersView from "@/components/OrdersView";
import PharmaciesView from "@/components/PharmaciesView";
import ProfileView from "@/components/ProfileView";
import CartModal from "@/components/CartModal";

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);

  // User Profile State
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUserProfile() {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem("rxconnect_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }

      const token = localStorage.getItem("rxconnect_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("rxconnect_user", JSON.stringify(data.user));
          }
        }
      } catch (err) {
        console.warn("Could not sync user profile from backend API");
      }
    }

    loadUserProfile();
  }, []);

  const handleAddToCart = (medicine) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === medicine.id);
      if (existing) {
        return prev.map((i) => (i.id === medicine.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    setShowCart(true);
  };

  const handlePlaceOrderDirect = (medicine) => {
    setCart([{ ...medicine, quantity: 1 }]);
    setShowCart(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative pb-16">
      {/* Top Header */}
      <Header user={user} />

      {/* Navigation Sub-Bar */}
      <div className="bg-white shadow-xs border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center overflow-x-auto no-scrollbar">
          <div className="flex space-x-6">
            {[
              { id: "dashboard", label: "Dashboard Overview" },
              { id: "catalog", label: "Browse Medicines Catalog" },
              { id: "prescriptions", label: "Upload Prescriptions" },
              { id: "orders", label: "My Orders & Summaries" },
              { id: "pharmacies", label: "Nearby Pharmacies" },
              { id: "profile", label: "My Profile" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 bg-[#0b193c] hover:bg-[#13285c] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ml-4 shrink-0"
          >
            <span>🛒 My Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full font-black text-[10px]">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8 w-full flex-1">
        {activeTab === "dashboard" && (
          <DashboardOverview onNavigateToPrescriptions={() => setActiveTab("prescriptions")} />
        )}

        {activeTab === "catalog" && (
          <BrowseMedicinesView onAddToCart={handleAddToCart} onPlaceOrder={handlePlaceOrderDirect} />
        )}

        {activeTab === "prescriptions" && <PrescriptionsView />}

        {activeTab === "orders" && <OrdersView />}

        {activeTab === "pharmacies" && <PharmaciesView />}

        {activeTab === "profile" && <ProfileView user={user} onUpdateUser={setUser} />}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <CartModal
          cart={cart}
          userAddress={user?.deliveryAddress}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClose={() => setShowCart(false)}
          onOrderPlaced={() => {
            setCart([]);
            setShowCart(false);
            setActiveTab("orders");
          }}
        />
      )}

      <SupportButton />
    </div>
  );
}
