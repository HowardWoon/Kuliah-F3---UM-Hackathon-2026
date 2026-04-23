import { useEffect } from "react";
import { useFridgeContext } from "../context/FridgeContext";

export default function Profile() {
  const { profileData, loadProfile } = useFridgeContext();

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profileData) {
    return (
      <main className="pt-6 pb-32 px-container-margin flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-4 text-emerald-600">
           <span className="material-symbols-outlined animate-spin text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
           <p className="font-semibold text-gray-500 animate-pulse text-sm">Loading Z.AI Profile...</p>
        </div>
      </main>
    );
  }

  const currentXP = profileData.xp || 0;
  const maxXP = 3000;
  const xpPercentage = Math.min((currentXP / maxXP) * 100, 100);
  const rankTitle = currentXP >= 9000 ? "Master of Leftovers" : currentXP >= 6000 ? "Kitchen Alchemist" : currentXP >= 3000 ? "Home Chef" : "Novice Scraper";

  return (
    <main className="pt-6 pb-32 px-container-margin flex flex-col gap-stack-lg max-w-2xl mx-auto">

      <header className="flex flex-col items-center text-center relative mt-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-4 bg-surface-variant z-20">
           <img src="/profile.png" alt="Chef Profile" className="w-full h-full object-cover" />
        </div>
        <h1 className="font-display-md text-on-surface text-2xl font-bold tracking-tight">Your Chef Profile</h1>
        <p className="text-on-surface-variant text-sm mt-1">Culinary Journey</p>
      </header>

      <section className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-6 shadow-[0_8px_24px_rgba(16,185,129,0.3)] flex flex-col relative overflow-hidden mt-2">
        <div className="absolute -right-4 -bottom-4 opacity-20">
           <span className="material-symbols-outlined text-[130px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
        </div>
        <div className="flex justify-between items-end relative z-10 mb-4">
           <div>
              <p className="font-label-md text-emerald-100 font-semibold mb-1 uppercase tracking-widest text-[10px]">Z.AI Culinary Rank</p>
              <h2 className="font-headline-md text-2xl font-bold tracking-tight text-white mb-0">{rankTitle}</h2>
           </div>
           <div className="text-right">
              <span className="font-stat-lg text-2xl font-black">{currentXP}</span>
              <span className="text-emerald-100 text-xs ml-1">/ {maxXP} XP</span>
           </div>
        </div>

        <div className="w-full bg-black/20 rounded-full h-2 relative z-10 overflow-hidden backdrop-blur-sm border border-white/10">
           <div className="bg-emerald-300 h-2 rounded-full relative transition-[width] duration-1000 ease-out" style={{ width: `${xpPercentage}%` }}>
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/40"></div>
           </div>
        </div>
        <p className="text-emerald-50 text-[11px] mt-3 relative z-10 font-medium">{Math.max(maxXP - currentXP, 0)} XP to Next Level</p>
      </section>

      <section className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-1 items-center text-center">
            <span className="material-symbols-outlined text-secondary text-[24px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            <span className="font-stat-lg text-secondary text-2xl font-black">RM {profileData.saved_rm.toFixed(2)}</span>
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">Saved This Month</span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-1 items-center text-center">
            <span className="material-symbols-outlined text-primary text-[24px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            <span className="font-stat-lg text-primary text-2xl font-black">{profileData.meals_rated}</span>
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">Meals Rated</span>
        </div>
      </section>

      <section className="flex flex-col gap-stack-sm mt-4">
        <div className="flex items-center justify-between mb-2">
           <h3 className="font-headline-md text-headline-md text-on-surface">Z.AI Recent Ratings</h3>
           <span className="text-primary font-label-sm text-[12px] bg-primary/10 px-3 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">See All</span>
        </div>

        {(!profileData.recent_ratings || profileData.recent_ratings.length === 0) ? (
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 text-center">
            <span className="material-symbols-outlined text-[40px] text-outline-variant mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            <p className="text-on-surface-variant text-sm">No rated meals yet. Cook a meal and snap it for Z.AI rating!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {profileData.recent_ratings.map((rating: any, idx: number) => (
            <div key={idx} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3 relative overflow-hidden group">
               <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3 relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                      </div>
                      <div>
                          <h4 className="font-body-md font-bold text-on-surface line-clamp-1">{rating.meal_name}</h4>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">{rating.date}</p>
                      </div>
                   </div>
                   <div className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-lg border border-yellow-200 flex items-center gap-1 shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-[13px]">{Number(rating.rating).toFixed(1)}</span>
                   </div>
               </div>

               {rating.feedback && (
                 <div className="bg-surface-container-low p-3 rounded-lg border border-surface-variant relative z-10">
                     <div className="flex items-center gap-1.5 mb-1.5 text-primary">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">Z.AI Feedback</span>
                     </div>
                     <p className="text-on-surface-variant text-[13px] leading-relaxed italic line-clamp-2">"{rating.feedback}"</p>
                 </div>
               )}
            </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
