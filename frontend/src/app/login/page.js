import Link from "next/link";
import RoleCard from "@/components/RoleCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-green-100">

      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

          <Link
            href="/login"
            className="text-3xl font-extrabold text-blue-700"
          >
            RxConnect
          </Link>

         

        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Section */}

        <div>

          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Secure • Fast • Reliable
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900">
            Healthcare
            <span className="text-blue-700"> Made </span>
            Simple
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Access medicines, manage prescriptions, connect with pharmacies,
            and experience seamless healthcare services from one secure
            platform.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <h2 className="text-3xl font-bold text-blue-700">
                24/7
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Healthcare Support
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <h2 className="text-3xl font-bold text-green-600">
                Secure
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Encrypted Platform
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <h2 className="text-3xl font-bold text-purple-600">
                Fast
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Medicine Delivery
              </p>
            </div>

          </div>

        </div>

        {/* Right Section */}

        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">

          <div className="text-center">

            <h2 className="text-3xl font-bold text-gray-800">
              Welcome to RxConnect
            </h2>

            <p className="mt-2 text-gray-500">
              Select your portal to continue
            </p>

          </div>

          <div className="mt-8 space-y-5">

            <RoleCard
              role="Customer"
              description="Order medicines, upload prescriptions and track orders."
              link="/login/customer"
            />

            <RoleCard
              role="Pharmacist"
              description="Manage inventory, prescriptions and pharmacy operations."
              link="/login/pharmacist"
            />

            <RoleCard
              role="Delivery Partner"
              description="Manage assigned deliveries and update delivery status."
              link="/login/delivery"
            />

            <RoleCard
              role="Admin"
              description="Manage users, pharmacies and monitor the platform."
              link="/login/admin"
            />

          </div>

          <div className="mt-8 border-t pt-6 text-center">

            <p className="text-gray-600">

              New to RxConnect?

              <Link
                href="/signup"
                className="ml-2 font-semibold text-blue-600 hover:underline"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </section>

    </main>
  );
}