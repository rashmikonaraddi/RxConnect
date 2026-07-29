"use client";

import { useState } from "react";

export default function OrdersView() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: "RX-88412",
      date: "July 28, 2026",
      pharmacy: "HealthFirst Central Pharmacy - Downtown",
      status: "Out For Delivery",
      statusColor: "bg-amber-100 text-amber-800 border-amber-200",
      totalAmount: "$34.50",
      estimatedDelivery: "Today by 5:30 PM",
      items: [
        { name: "Amoxicillin 500mg (Capsules)", qty: 1, price: "$18.50" },
        { name: "Multivitamin Daily Formula", qty: 1, price: "$16.00" },
      ],
      deliveryAddress: "742 Evergreen Terrace, Springfield, IL 62704",
      paymentMethod: "Visa ending in 4242",
    },
    {
      id: "RX-77290",
      date: "July 12, 2026",
      pharmacy: "CarePlus Community Pharmacy",
      status: "Delivered",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      totalAmount: "$22.00",
      estimatedDelivery: "Delivered on Jul 12, 2:15 PM",
      items: [
        { name: "Lisinopril 10mg (30 Tablets)", qty: 1, price: "$22.00" },
      ],
      deliveryAddress: "742 Evergreen Terrace, Springfield, IL 62704",
      paymentMethod: "Visa ending in 4242",
    },
    {
      id: "RX-65104",
      date: "June 25, 2026",
      pharmacy: "HealthFirst Central Pharmacy - Downtown",
      status: "Completed",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      totalAmount: "$45.99",
      estimatedDelivery: "Delivered on Jun 25, 11:40 AM",
      items: [
        { name: "Omeprazole 20mg (Delayed Release)", qty: 2, price: "$30.00" },
        { name: "First Aid Antiseptic Bandages", qty: 1, price: "$15.99" },
      ],
      deliveryAddress: "742 Evergreen Terrace, Springfield, IL 62704",
      paymentMethod: "Mastercard ending in 8819",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Order Summaries & History</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track active deliveries and review previous prescription orders
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    Order #{order.id}
                  </span>
                  <span className={`px-3 py-0.5 text-xs font-bold rounded-full border ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">
                  {order.pharmacy}
                </h4>
                <p className="text-xs text-slate-500">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""} • Placed on {order.date}
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block uppercase font-medium">
                    Total
                  </span>
                  <span className="text-base font-extrabold text-[#0b193c]">
                    {order.totalAmount}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 bg-[#0b193c] hover:bg-[#13285c] text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
                >
                  View Summary
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0b193c] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Order Summary — #{selectedOrder.id}</h3>
                <span className="text-xs text-slate-300">Placed on {selectedOrder.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-300 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Status</span>
                  <span className="font-bold text-slate-800">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Delivery Info</span>
                  <span className="font-bold text-slate-800">{selectedOrder.estimatedDelivery}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2 text-xs uppercase tracking-wider text-slate-400">
                  Items Ordered
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl px-4 py-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 block">{item.name}</span>
                        <span className="text-[11px] text-slate-400">Qty: {item.qty}</span>
                      </div>
                      <span className="font-bold text-slate-800">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>Pharmacy</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.pharmacy}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Address</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Method</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2">
                  <span>Total Paid</span>
                  <span className="text-[#0b193c]">{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl text-xs hover:bg-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
