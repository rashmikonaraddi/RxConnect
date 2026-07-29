export default function SupportButton() {
  return (
    <button
      aria-label="Help and Support"
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#0b193c] hover:bg-[#13285c] text-white flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer z-50 hover:scale-105"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 1118 0z" />
      </svg>
    </button>
  );
}
