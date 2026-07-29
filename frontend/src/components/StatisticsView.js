export default function StatisticsView() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-5">Health & Refill Statistics</h2>
      <div className="p-6 bg-slate-50 rounded-xl text-center space-y-2">
        <div className="text-4xl font-extrabold text-[#0b193c]">100%</div>
        <p className="text-sm font-semibold text-slate-700">Prescription Refill Adherence Rate</p>
        <p className="text-xs text-slate-500">You have zero overdue refills for this month.</p>
      </div>
    </div>
  );
}
