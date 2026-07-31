"use client";

import { useState } from "react";

export default function CartModal({ cart, userAddress, onUpdateQty, onRemoveItem, onClose, onOrderPlaced }) {
  const [deliveryAddress, setDeliveryAddress] = useState(userAddress || "742 Evergreen Terrace, Springfield, IL 62704");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + (typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      items: cart.map((i) => ({
        medicineName: i.name,
        quantity: i.quantity,
        price: typeof i.price === "number" ? i.price : parseFloat(String(i.price).replace(/[^0-9.]/g, "")) || 0,
        isRx: Boolean(i.prescriptionRequired || i.type === "Rx"),
      })),
      destination: deliveryAddress,
      deliveryNotes,
      paymentMethod,
    };

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rxconnect_token") : null;
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrderSuccess(data.order);
        setTimeout(() => {
          onOrderPlaced();
        }, 1800);
      } else {
        throw new Error(data.message || "Failed to place order.");
      }
    } catch (e) {
      console.error("Order submission error:", e);
      setErrorMsg(e.message || "Could not connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0b193c] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <div>
              <h3 className="font-bold text-base text-white">Your Cart & Checkout</h3>
              <p className="text-xs text-slate-300">{cart.length} item(s) selected</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-sm p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
              ✓
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h4>
            <p className="text-sm text-slate-600 font-mono font-bold">Order ID: #{orderSuccess.id}</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your order has been sent to our partner pharmacy. You will receive live status updates via in-app notifications.
            </p>
          </div>
        ) : cart.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="text-4xl">🛍️</span>
            <p className="text-base font-bold text-slate-800">Your cart is empty</p>
            <p className="text-xs text-slate-500">Browse our medicine catalog to add OTC items or upload your prescription.</p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Browse Medicines
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}
            {/* Cart Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                        {(item.prescriptionRequired || item.type === "Rx") && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                            Rx Required
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">₹{item.price} per unit</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-extrabold text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-[#0b193c] min-w-16 text-right">
                        ₹{item.price * item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 text-xs p-1 cursor-pointer"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Information</h4>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Delivery Destination Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Street, City, Postal Code"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Leave at apartment reception"
                />
              </div>
            </div>

            {/* Payment Workflow Structure */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Workflow</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "CARD", label: "Credit / Debit Card", icon: "💳" },
                  { id: "UPI", label: "UPI / QR Pay", icon: "📱" },
                  { id: "CASH", label: "Cash on Delivery", icon: "💵" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === m.id
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-[11px] leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Gateway Placeholder Note */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <span>🔒</span>
                <span>
                  <strong>Secure Gateway Placeholder:</strong> Real payments sandbox active. Selected method:{" "}
                  <strong className="text-slate-800">{paymentMethod}</strong>.
                </span>
              </div>
            </div>

            {/* Price Summary & Action */}
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Express Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#0b193c] pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-3 bg-[#0b193c] hover:bg-[#13285c] text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <span>Confirm Order • ₹{total.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
