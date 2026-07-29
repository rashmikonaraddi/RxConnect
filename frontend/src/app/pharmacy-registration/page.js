import Link from "next/link";

export default function PharmacyRegistration() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center">
        <div className="text-6xl mb-4">💊</div>

        <h1 className="text-3xl font-bold text-gray-800">
          Pharmacy Registration
        </h1>

        <p className="mt-4 text-gray-600">
          Pharmacy registration will be available soon.
        </p>

        <Link
          href="/login/pharmacist"
          className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}