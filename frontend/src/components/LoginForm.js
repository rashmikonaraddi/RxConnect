"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "./Input";

const roleConfig = {
  Customer: {
    icon: "👤",
    title: "Welcome Back",
    subtitle: "Sign in to manage your medicines, prescriptions and orders.",
  },
  Pharmacist: {
    icon: "💊",
    title: "Pharmacy Portal",
    subtitle: "Manage inventory, prescriptions and pharmacy operations.",
  },
  "Delivery Partner": {
    icon: "🚚",
    title: "Delivery Portal",
    subtitle: "Track deliveries and manage assigned orders.",
  },
  Admin: {
    icon: "⚙️",
    title: "Admin Portal",
    subtitle: "Manage users and monitor the platform securely.",
  },
};

export default function LoginForm({ role }) {
  const router = useRouter();
  const config = roleConfig[role] || roleConfig.Customer;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (typeof window !== "undefined") {
        if (data.token) {
          localStorage.setItem("rxconnect_token", data.token);
        }
        if (data.user) {
          localStorage.setItem("rxconnect_user", JSON.stringify(data.user));
        }
      }

      const defaultRedirect =
        role === "Admin"
          ? "/admin"
          : role === "Pharmacist"
          ? "/pharmacist"
          : role === "Delivery Partner"
          ? "/delivery"
          : "/customer";

      router.push(data.redirectTo || defaultRedirect);
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-8 text-center">

        <div className="mb-3 text-5xl">
          {config.icon}
        </div>

        <h1 className="text-3xl font-bold text-white">
          RxConnect
        </h1>

        <p className="mt-2 text-blue-100">
          {config.title}
        </p>

      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="p-8">

        <h2 className="text-2xl font-bold text-gray-800">
          {role}
        </h2>

        <p className="mt-2 mb-6 text-sm text-gray-500">
          {config.subtitle}
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-6 flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              className="accent-blue-600"
            />

            Remember Me

          </label>

          <button type="button" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </button>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-blue-600
            py-3
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:bg-blue-700
            disabled:opacity-50
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="my-6 flex items-center">

          <div className="flex-1 border-t"></div>

          <span className="px-3 text-sm text-gray-400">
            OR
          </span>

          <div className="flex-1 border-t"></div>

        </div>

        {/* Customer */}
        {role === "Customer" && (
          <p className="text-center text-sm text-gray-600">
            Don't have an account?

            <Link
              href="/signup"
              className="ml-1 font-semibold text-blue-600 hover:underline"
            >
              Create Account
            </Link>
          </p>
        )}

        {/* Pharmacist */}
        {role === "Pharmacist" && (
          <p className="text-center text-sm text-gray-600">
            Want to join as a pharmacy?

            <Link
              href="/pharmacy-registration"
              className="ml-1 font-semibold text-blue-600 hover:underline"
            >
              Request Registration
            </Link>
          </p>
        )}

        {/* Delivery */}
        {role === "Delivery Partner" && (
          <p className="text-center text-sm text-gray-600">
            Interested in becoming a delivery partner?

            <Link
              href="/delivery-registration"
              className="ml-1 font-semibold text-blue-600 hover:underline"
            >
              Apply Now
            </Link>
          </p>
        )}

        {/* Admin */}
        {role === "Admin" && (
          <p className="text-center text-sm text-gray-500 leading-6">
            Administrator accounts are created and managed by the
            system administrator.
          </p>
        )}

      </form>

    </div>
  );
}