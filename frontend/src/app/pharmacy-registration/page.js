"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";

export default function PharmacyRegistration() {
  const router = useRouter();

  const [pharmacyName, setPharmacyName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pharmacistName, setPharmacistName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
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
      // 1. Create Pharmacy Branch Location
      let branchId = null;
      try {
        const branchRes = await fetch("http://localhost:5001/api/admin/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: branchCode || `BR-${Math.floor(100 + Math.random() * 900)}`,
            name: pharmacyName,
            address,
            phone,
            fulfillmentRate: 98.0,
          }),
        });
        const branchData = await branchRes.json();
        if (branchData.success && branchData.data) {
          branchId = branchData.data.id;
        }
      } catch (bErr) {
        console.warn("Branch registration warning:", bErr);
      }

      // 2. Register Pharmacist User Account
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: pharmacistName,
          email,
          phone,
          password,
          role: "PHARMACIST",
          employeeId: licenseNumber || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
          branchId: branchId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Pharmacy registration failed.");
      }

      if (typeof window !== "undefined") {
        if (data.token) localStorage.setItem("rxconnect_token", data.token);
        if (data.user) localStorage.setItem("rxconnect_user", JSON.stringify(data.user));
      }

      router.push("/pharmacist");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b193c] via-[#102454] to-[#0b193c] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 px-8 py-8 text-center text-white">
          <div className="text-5xl mb-3"></div>
          <h1 className="text-3xl font-extrabold">Pharmacy Partner Registration</h1>
          <p className="text-blue-100 text-sm mt-1">
            Register your licensed pharmacy branch & head pharmacist portal on RxConnect
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3.5 border border-red-200 text-xs font-semibold text-red-600">
              ⚠️ {error}
            </div>
          )}

          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
              1. Pharmacy Branch Details
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Pharmacy Branch Name"
                type="text"
                placeholder="e.g. MetroCare Central Pharmacy"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                required
              />

              <Input
                label="Branch Code / Registration ID"
                type="text"
                placeholder="e.g. BR-108"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                required
              />
            </div>

            <Input
              label="Physical Address"
              type="text"
              placeholder="e.g. 104 Medical Boulevard, Suite 2B"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <Input
              label="Branch Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              2. Licensed Head Pharmacist Account
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Pharmacist Full Name"
                type="text"
                placeholder="e.g. Dr. Sarah Jenkins"
                value={pharmacistName}
                onChange={(e) => setPharmacistName(e.target.value)}
                required
              />

              <Input
                label="License / Employee ID"
                type="text"
                placeholder="e.g. PH-2026-881"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>

            <Input
              label="Official Email Address"
              type="email"
              placeholder="pharmacist@rxconnect.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition cursor-pointer text-sm"
          >
            {loading ? "Registering Pharmacy Branch..." : "Submit & Register Pharmacy"}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Already registered?{" "}
            <Link href="/login/pharmacist" className="font-bold text-blue-600 hover:underline">
              Log in to Pharmacist Portal
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}