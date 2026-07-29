import Link from "next/link";
import Input from "@/components/Input";

export default function SignupPage() {
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
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
            />

          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 9876543210"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
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