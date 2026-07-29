export default function PharmaciesView() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-5">Nearby Partner Pharmacies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">HealthFirst Central Pharmacy</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Open Now</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">123 Medical Center Way • 0.8 miles away</p>
          <div className="mt-4 text-xs font-medium text-[#0b193c] flex items-center gap-1">
            ★ 4.9 (128 reviews) • Express 30-min Delivery
          </div>
        </div>
        <div className="p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">CarePlus Community Pharmacy</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Open Now</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">456 Oak Avenue • 1.4 miles away</p>
          <div className="mt-4 text-xs font-medium text-[#0b193c] flex items-center gap-1">
            ★ 4.8 (94 reviews) • Standard Delivery
          </div>
        </div>
      </div>
    </div>
  );
}
