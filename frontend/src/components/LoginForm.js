"use client";

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
  const config = roleConfig[role];

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
      <div className="p-8">

        <h2 className="text-2xl font-bold text-gray-800">
          {role}
        </h2>

        <p className="mt-2 mb-6 text-sm text-gray-500">
          {config.subtitle}
        </p>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        <div className="mb-6 flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              className="accent-blue-600"
            />

            Remember Me

          </label>

          <button className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </button>

        </div>

        <button
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
          "
        >
          Login
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

      </div>

    </div>
  );
}