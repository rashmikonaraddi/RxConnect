"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";

export default function DeliveryRegistration() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role: "DELIVERY_PARTNER",
          vehicle: vehicle || "Hero Splendor (KA-01-EQ-4491)",
          employeeId: employeeId || `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delivery partner registration failed.");
      }

      if (typeof window !== "undefined") {
        if (data.token) localStorage.setItem("rxconnect_token", data.token);
        if (data.user) localStorage.setItem("rxconnect_user", JSON.stringify(data.user));
      }

      router.push("/delivery");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-orange-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-8 py-8 text-center text-white">
          <div className="text-5xl mb-3">🚚</div>
          <h1 className="text-3xl font-extrabold">Delivery Partner Sign Up</h1>
          <p className="text-amber-100 text-sm mt-1">
            Deliver prescription orders, earn payouts, and support healthcare logistics
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3.5 border border-red-200 text-xs font-semibold text-red-600">
              ⚠️ {error}
            </div>
          )}

          <Input
            label="Driver Full Name"
            type="text"
            placeholder="e.g. Alex Rivera"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex.rivera@rxconnect.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grid md:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              label="Driver Badge / Employee ID"
              type="text"
              placeholder="e.g. DEL-008"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          <Input
            label="Vehicle Name & License Plate"
            type="text"
            placeholder="e.g. Honda Activa 6G (KA-05-AB-1234)"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            required
          />

          <div className="grid md:grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition cursor-pointer text-sm"
          >
            {loading ? "Creating Partner Account..." : "Join as Delivery Partner"}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Already registered?{" "}
            <Link href="/login/delivery" className="font-bold text-amber-700 hover:underline">
              Sign in to Delivery Portal
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}