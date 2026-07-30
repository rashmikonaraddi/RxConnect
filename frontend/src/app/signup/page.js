"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";

export default function SignupPage() {
  const router = useRouter();

const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSignup = async () => {
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }),
    });

    const data = await response.json();
if (response.ok) {
  localStorage.setItem("user", JSON.stringify(data.user));
  router.push("/customer/dashboard");
} else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
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
        <div className="p-8">

          <div className="grid md:grid-cols-2 gap-4">

           <Input
  label="First Name"
  type="text"
  placeholder="John"
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
/>
<Input
  label="Last Name"
  type="text"
  placeholder="Doe"
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
/>

          </div>

         <Input
  label="Email Address"
  type="email"
  placeholder="john@example.com"
  name="email"
  value={formData.email}
  onChange={handleChange}
/>

          <Input
  label="Phone Number"
  type="tel"
  placeholder="+91 9876543210"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
/>

         <Input
  label="Password"
  type="password"
  placeholder="Create a password"
  name="password"
  value={formData.password}
  onChange={handleChange}
/>

        <Input
  label="Confirm Password"
  type="password"
  placeholder="Confirm your password"
  name="confirmPassword"
  value={formData.confirmPassword}
  onChange={handleChange}
/>

          <div className="flex items-start gap-3 mt-2 mb-6">

            <input
              type="checkbox"
              className="mt-1 accent-blue-600"
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
  type="button"
  onClick={handleSignup}
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
  "
>
  Create Account
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

        </div>

      </div>

    </main>
  );
}