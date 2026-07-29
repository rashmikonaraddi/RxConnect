export default function Header({ user, onLogout }) {
  const getInitials = (name) => {
    if (!name) return "CU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-[#0b193c] via-[#102454] to-[#0b193c] text-white pt-8 pb-16 px-6 md:px-12 shadow-xl relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left branding & title */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0 group hover:scale-105 transition-transform duration-300">
            <svg
              className="w-7 h-7 text-emerald-400 group-hover:rotate-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                RxConnect
              </h1>
            </div>

            <p className="text-sm text-slate-300 mt-1 font-normal">
              Connecting You to Better Healthcare.
            </p>
          </div>
        </div>

        {/* Right profile & actions */}
        <div className="flex items-center gap-3.5 self-end md:self-center">
          {/* Notification Bell Button */}
          <button
            aria-label="Notifications"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-200 shadow-sm relative cursor-pointer hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b193c] animate-ping"></span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b193c]"></span>
          </button>

          {/* Profile Avatar */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white flex items-center gap-3 px-3.5 py-1.5 rounded-full text-xs shadow-sm transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-md border border-amber-300/30">
              {getInitials(user?.fullName)}
            </div>

            <div className="text-left hidden sm:block">
              <span className="font-semibold block text-white leading-tight">
                {user?.fullName || "Customer Profile"}
              </span>

              <span className="text-[10px] text-slate-300 block leading-tight">
                Customer
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}