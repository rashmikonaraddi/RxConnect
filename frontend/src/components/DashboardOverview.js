export default function DashboardOverview({ onNavigateToPrescriptions }) {
  return (
    <div className="space-y-6">
      {/* Overview Header & Metrics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Dashboard Overview
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                Live Status
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time account metrics and active prescription order summaries
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-bold rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Account Active
          </span>
        </div>

        {/* Scan & Upload Prescription Banner */}
        <div className="bg-gradient-to-r from-[#0b193c] via-[#102454] to-[#0b193c] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Instant Fulfillment
            </span>
            <h3 className="text-lg font-extrabold text-white">
              Have a doctor's prescription? Scan & Upload Now
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-normal">
              Take a photo or upload your prescription document to get instant quotes from nearby partner pharmacies.
            </p>
          </div>

          <button
            onClick={onNavigateToPrescriptions}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 hover:scale-105 cursor-pointer whitespace-nowrap self-start md:self-center flex items-center gap-2 relative z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Scan / Upload Rx Photo</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Active Prescriptions
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                📜
              </div>
            </div>
            <div className="text-4xl font-black text-[#0b193c] mt-3">4</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span>✓ 2 Refills Ready for Pickup</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 p-6 rounded-2xl border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Active Delivery
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                🚚
              </div>
            </div>
            <div className="text-4xl font-black text-[#0b193c] mt-3">1</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Out for Express Delivery</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-6 rounded-2xl border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Saved Pharmacies
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                🏪
              </div>
            </div>
            <div className="text-4xl font-black text-[#0b193c] mt-3">3</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <span>1 Preferred Partner Nearby</span>
            </div>
          </div>
        </div>

        {/* Recent Order Summary Widget */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Order Summary</h3>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Out for Delivery
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold font-mono text-slate-500">Order #RX-88412</span>
              <h4 className="font-bold text-slate-800 text-sm">HealthFirst Central Pharmacy - Downtown</h4>
              <p className="text-xs text-slate-500">
                Amoxicillin 500mg, Multivitamin Daily Formula • Total: $34.50
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs font-semibold text-slate-500 block">Est. Delivery</span>
              <span className="text-sm font-extrabold text-slate-900">Today, 5:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
