"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role: "CUSTOMER",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create account.");
      }

      if (typeof window !== "undefined") {
        if (data.token) {
          localStorage.setItem("rxconnect_token", data.token);
        }
        if (data.user) {
          localStorage.setItem("rxconnect_user", JSON.stringify(data.user));
        }
      }

      router.push("/customer");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-8 text-center">

          <div className="text-5xl mb-3">
            🩺
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Your Account
          </h1>

          <p className="text-blue-100 mt-2">
            Join the RxConnect Healthcare Platform
          </p>

        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8">

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3.5 border border-red-200 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">

            <Input
              label="First Name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

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
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex items-start gap-3 mt-2 mb-6">

            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 accent-blue-600 cursor-pointer"
            />

            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>.
            </p>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              text-white
              font-semibold
              hover:bg-blue-700
              transition-all
              duration-300
              shadow-lg
              disabled:opacity-50
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="my-6 flex items-center">

            <div className="flex-1 border-t"></div>

            <span className="px-3 text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 border-t"></div>

          </div>

          <p className="text-center text-sm text-gray-600">

            Already have an account?

            <Link
              href="/login"
              className="ml-1 font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>

          </p>

        </form>

      </div>

    </main>
  );
}