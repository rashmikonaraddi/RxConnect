"use client";

import { useState, useEffect } from "react";

export default function NotificationDropdown({ onClose, user }) {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      const res = await fetch("http://localhost:5001/api/notifications", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error("Notifications API error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      await fetch("http://localhost:5001/api/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
    } catch (e) {}
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "Recently";
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case "PRESCRIPTION":
        return "📜";
      case "ORDER_STATUS":
        return "";
      case "LOW_STOCK":
        return "⚠️";
      case "DELIVERY":
        return "";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "alerts") return n.type === "LOW_STOCK" || n.type === "PRESCRIPTION";
    return true;
  });

  return (
    <div className="absolute right-0 top-14 z-50 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200/90 text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
      {/* Top Header */}
      <div className="bg-[#0b193c] px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-extrabold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm p-1 cursor-pointer">
            ✕
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50 px-3 pt-2 text-xs font-semibold text-slate-600 space-x-2">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "alerts", label: "Alerts" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
              filter === tab.id
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-500">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="text-3xl">🔕</div>
            <p className="text-xs font-semibold text-slate-600">No notifications found</p>
            <p className="text-[11px] text-slate-400">You're all caught up for now!</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id)}
              className={`p-4 flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                item.isRead ? "bg-white hover:bg-slate-50/70" : "bg-blue-50/40 hover:bg-blue-50/70"
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="text-lg shrink-0 mt-0.5">{getIcon(item.type)}</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{item.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="text-slate-300 hover:text-rose-500 text-xs p-1 cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 p-2.5 text-center border-t border-slate-100">
        <span className="text-[10px] font-semibold text-slate-400">
          RxConnect In-App Alerts • Real-time Pharmacy Updates
        </span>
      </div>
    </div>
  );
}
