"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header({ user }) {
  const [notifications, setNotifications] = useState([
    {
      id: "notif-001",
      title: "Order Out for Delivery",
      message: "Your prescription order #ord-1048 is out for delivery with Rahul Verma.",
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-002",
      title: "Order Verified & Packed",
      message: "Your prescription order #ord-1048 has been verified by Pharmacist Dr. Sarah Jenkins.",
      isRead: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-003",
      title: "Low Stock Alert: Metformin 500mg",
      message: "MetroCare Pharmacy - Westside stock level (4 units) dropped below safety threshold (20 units).",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications from Backend API (Issue #47)
  useEffect(() => {
    async function fetchNotifications() {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      try {
        const res = await fetch("http://localhost:5001/api/notifications", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-user-id": user?.id || "",
            "x-user-role": user?.role || "CUSTOMER",
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setNotifications(json.data);
          }
        }
      } catch (err) {
        console.warn("Notification API offline, using in-app notification state.");
      }
    }
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
    try {
      await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-user-id": user?.id || "",
          "x-user-role": user?.role || "CUSTOMER",
        },
      });
    } catch (err) {
      console.warn("Backend mark as read failed, updating local state.");
    }
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getInitials = (name) => {
    if (!name) return "CU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const role = user?.role || "Customer";

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case "ADMIN":
      case "Admin":
      case "Regional Admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "DELIVERY_PARTNER":
      case "Delivery Partner":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "PHARMACIST":
      case "Pharmacist":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  const formatIST = (dateStr) => {
    if (!dateStr) return "Just now";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }) + " IST";
  };

  return (
    <header className="bg-gradient-to-r from-[#0b193c] via-[#102454] to-[#0b193c] text-white pt-8 pb-16 px-6 md:px-12 shadow-xl relative overflow-visible z-40">
      {/* Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0 group hover:scale-105 transition-transform duration-300"
          >
            <svg
              className="w-7 h-7 text-emerald-400 group-hover:rotate-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:text-emerald-300 transition-colors">
                  RxConnect
                </h1>
              </Link>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold border ${getRoleBadgeStyle(role)}`}>
                {role} Portal
              </span>
            </div>

            <p className="text-sm text-slate-300 mt-1 font-normal">
              Connecting You to Better Healthcare.
            </p>
          </div>
        </div>

        {/* Right Actions & Notifications */}
        <div className="flex items-center gap-3.5 self-end md:self-center relative">
          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-200 shadow-sm relative cursor-pointer hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0b193c] animate-ping"></span>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border border-white shadow-xs">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* Notification Dropdown Drawer (Issue #47) */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">In-App Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications right now.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs transition-colors flex flex-col justify-between gap-1.5 ${
                          !n.isRead
                            ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-white leading-tight">{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">{formatIST(n.createdAt)}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{n.message}</p>

                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="self-end text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-bold mt-1"
                          >
                            ✓ Mark as Read
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white flex items-center gap-3 px-3.5 py-1.5 rounded-full text-xs shadow-sm transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-md border border-amber-300/30">
              {getInitials(user?.fullName)}
            </div>

            <div className="text-left hidden sm:block">
              <span className="font-semibold block text-white leading-tight">
                {user?.fullName || "User Profile"}
              </span>
              <span className="text-[10px] text-slate-300 block leading-tight">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}