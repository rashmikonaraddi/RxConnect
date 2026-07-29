"use client";

const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 50,
    stock: 100,
    expiry: "Dec 2027",
  },
  {
    id: 2,
    name: "Azithromycin 500mg",
    price: 150,
    stock: 60,
    expiry: "Sep 2027",
  },
  {
    id: 3,
    name: "Vitamin C Tablets",
    price: 100,
    stock: 75,
    expiry: "Oct 2027",
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    price: 60,
    stock: 120,
    expiry: "Mar 2028",
  },
  {
    id: 5,
    name: "Cetirizine 10mg",
    price: 30,
    stock: 80,
    expiry: "Nov 2027",
  },
  {
    id: 6,
    name: "Omeprazole 20mg",
    price: 90,
    stock: 45,
    expiry: "Jul 2027",
  },
  {
    id: 7,
    name: "Amoxicillin 250mg",
    price: 120,
    stock: 55,
    expiry: "Jan 2028",
  },
  {
    id: 8,
    name: "Dolo 650",
    price: 35,
    stock: 140,
    expiry: "Feb 2028",
  },
];

export default function BrowseMedicines() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search medicines..."
          className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {medicines.map((medicine) => (
          <div
            key={medicine.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Dummy Image */}
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-5xl shadow-md ring-1 ring-slate-100">
                💊
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {medicine.name}
              </h3>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-500">Price</span>
                <p className="text-xl font-bold text-blue-600">₹{medicine.price}</p>
              </div>

              <div className="mt-4 space-y-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  ● In Stock
                </span>

                <p className="text-sm text-slate-600">Quantity: {medicine.stock}</p>

                <p className="text-sm text-slate-600">Expiry: {medicine.expiry}</p>
              </div>

              <button
                type="button"
                aria-label={`Add ${medicine.name} to cart`}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-2.5 font-medium text-white transition-all hover:opacity-90"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}