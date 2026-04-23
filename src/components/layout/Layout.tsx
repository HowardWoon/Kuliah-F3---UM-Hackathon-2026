import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  const location = useLocation();
  const hideNavs = location.pathname.startsWith("/scanning") || location.pathname === "/recipe";
  const isProfile = location.pathname.startsWith("/profile");

  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center sm:p-4">
      <div className="max-w-md w-full mx-auto h-[100dvh] sm:h-[844px] bg-gray-50 flex flex-col relative overflow-hidden shadow-2xl sm:rounded-[40px] ring-1 ring-white/10">
        {!hideNavs && (
          <header className="shrink-0 z-40 bg-slate-900 shadow-sm flex justify-between items-center w-full px-5 h-16 font-semibold text-lg">
            <div className="flex items-center gap-2 w-8">
              {/* Removed user icon */}
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-emerald-400 tracking-tight leading-none text-center">Cook.GPT</div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase opacity-80 mt-0.5">Powered by Z.AI</div>
            </div>
            <button className="hover:opacity-80 transition-opacity active:scale-95 transition-transform flex items-center justify-center text-slate-400 w-8">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </header>
        )}
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-gray-50 relative pb-20">
          <Outlet />
        </div>
        
        {!hideNavs && <BottomNav />}
      </div>
    </div>
  );
}
