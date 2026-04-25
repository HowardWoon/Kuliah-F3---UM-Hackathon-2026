import { useRef, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { MealDecision, useFridgeContext } from "../context/FridgeContext";

export default function Recipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rateCookedMeal, mealFeedback, setMealFeedback } = useFridgeContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completedUpTo, setCompletedUpTo] = useState(-1);
  const [isRating, setIsRating] = useState(false);

  const handleStepClick = (idx: number) => {
    setCompletedUpTo(prev => prev === idx ? idx - 1 : idx);
  };

  const stripNumber = (step: string) => step.replace(/^\d+\.\s*/, '');

  const meal = location.state?.meal as MealDecision | undefined;

  const handleCaptureClick = () => {
    if (isRating) return;
    fileInputRef.current?.click();
  };

  const handleSnapForRating = async (recipe: MealDecision, selectedFile?: File) => {
    if (isRating) return;

    setIsRating(true);
    setMealFeedback(null);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const demoFile = selectedFile || new File(["zai-demo"], "zai-rating-demo.jpg", { type: "image/jpeg" });
    await rateCookedMeal(demoFile, recipe.meal_name, recipe.waste_saved_rm);
    setIsRating(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && meal) {
      await handleSnapForRating(meal, e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleFinish = () => {
    setMealFeedback(null);
    navigate("/profile");
  };

  if (!meal) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 shadow-sm flex justify-between items-center w-full px-4 h-12 shrink-0 z-40">
        <button type="button" onClick={() => navigate(-1)} className="text-on-surface-variant hover:opacity-80 active:scale-95 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-semibold text-[16px] text-primary tracking-tight">Adaptive Recipe</h1>
        <div className="w-8" />
      </header>

      <div className="overflow-y-auto flex-1 pb-24 relative">
        {isRating && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl px-6 py-5 shadow-2xl flex items-center gap-3 max-w-sm w-full">
              <span className="material-symbols-outlined animate-spin text-primary">hourglass_top</span>
              <span className="font-body-md text-on-surface">ILMU-GLM-5.1 analyzing final dish presentation...</span>
            </div>
          </div>
        )}
        <div className="relative w-full h-48 overflow-hidden">
          <img src={meal.image_src} alt={meal.meal_name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}></div>
          <div className="absolute bottom-0 left-0 px-container-margin w-full pb-4">
            <h2 className="font-display-sm text-display-sm text-white mb-1">{meal.meal_name}</h2>
            <p className="text-white/80 text-sm">{meal.cuisine}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 text-[11px]">
                <span className="material-symbols-outlined text-[14px]">schedule</span> 15 mins
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full font-label-sm text-label-sm text-[11px]">
                Saves RM {meal.waste_saved_rm.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-container-margin flex flex-col gap-stack-lg mt-4">
          {meal.missing_ingredients.length > 0 && (
            <section className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-stack-md border border-orange-200 shadow-sm relative overflow-hidden flex gap-stack-md items-start">
              <div className="bg-white p-2 rounded-full shadow-sm text-orange-500 z-10 shrink-0 mt-1">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              </div>
              <div className="flex flex-col gap-1 z-10">
                <h3 className="font-label-sm text-label-sm text-orange-800 uppercase tracking-wider opacity-90">Smart Substitution by Z.AI</h3>
                <p className="font-body-md text-body-md text-orange-900">
                  This recipe intelligently leaves out or routes around missing items: <strong>{meal.missing_ingredients.join(", ")}</strong>.
                </p>
              </div>
            </section>
          )}

          <section className="flex flex-col gap-stack-sm">
            <div className="flex items-center gap-2 text-on-surface mb-2">
              <span className="material-symbols-outlined text-primary">shopping_basket</span>
              <h3 className="font-headline-md text-headline-md">Ingredient Mapping</h3>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-variant overflow-hidden flex flex-col">
              <div className="p-stack-md bg-surface-container-low border-b border-surface-variant flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Items to use</span>
                <span className="font-label-sm text-label-sm text-primary">{meal.ingredients_used.length} needed</span>
              </div>
              <div className="flex flex-col p-2 gap-1">
                {meal.ingredients_used.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-stack-md p-stack-sm rounded-lg hover:bg-surface-container transition-colors">
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center bg-primary">
                      <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-body-md text-body-md text-on-surface">{ing}</span>
                      <span className="text-on-surface-variant bg-surface-variant/50 px-2 py-0.5 rounded-full font-label-sm text-label-sm text-[12px]">Available</span>
                    </div>
                  </div>
                ))}
                {meal.missing_ingredients.map((ing, idx) => (
                  <div key={idx + 100} className="flex items-center gap-stack-md p-stack-sm rounded-lg hover:bg-surface-container transition-colors opacity-80">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-orange-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>remove</span>
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-body-md text-body-md text-on-surface">{ing}</span>
                      <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-label-sm text-label-sm text-[12px]">Missing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-stack-sm mt-4">
            <div className="flex items-center gap-2 text-on-surface mb-4">
              <span className="material-symbols-outlined text-primary">restaurant_menu</span>
              <h3 className="font-headline-md text-headline-md">Directions</h3>
              <span className="ml-auto text-[12px] font-semibold text-emerald-600">{completedUpTo + 1}/{meal.recipe_steps.length} done</span>
            </div>

            <div className="flex flex-col gap-stack-md relative pl-2">
              <div className={`absolute left-4 top-6 bottom-8 w-0.5 rounded-full transition-colors duration-500 ${completedUpTo === meal.recipe_steps.length - 1 ? 'bg-emerald-400' : 'bg-surface-variant'}`}></div>

              {meal.recipe_steps.map((step, idx) => {
                const done = idx <= completedUpTo;
                return (
                  <div key={idx} className="flex gap-stack-md relative z-10 cursor-pointer group" onClick={() => handleStepClick(idx)}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm text-label-sm shadow-sm shrink-0 mt-1 ring-4 ring-surface-container-lowest transition-all duration-300 ${done ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-emerald-400'}`}>
                      {done ? (
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className={`rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border p-stack-md flex-1 mb-2 transition-all duration-300 ${done ? 'bg-emerald-50/60 border-emerald-200' : 'bg-surface-container-lowest border-surface-variant hover:bg-gray-50'}`}>
                      <p className={`font-body-md leading-relaxed transition-all duration-300 ${done ? 'text-gray-400 line-through' : 'text-on-surface'}`}>{stripNumber(step)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-surface-container-lowest p-3 border-t border-outline-variant/30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload cooked meal photo"
          title="Upload cooked meal photo"
        />
        <button type="button" disabled={isRating} onClick={handleCaptureClick} className="w-full rounded-xl bg-emerald-600 text-white font-bold py-3.5 transition-all active:scale-95 flex items-center justify-center gap-2">
          {isRating ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
              <span className="text-[14px]">Z.AI Rating in Progress...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              <span className="text-[14px]">Snap Cooked Meal for Z.AI Rating</span>
            </>
          )}
        </button>
      </div>

      {mealFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[32px] p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center shadow-sm border border-yellow-100 mb-4 z-10 text-yellow-600">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>

            <h2 className="font-display-sm text-2xl font-bold text-on-surface mb-1 z-10">Z.AI Rating</h2>
            <div className="text-4xl font-black text-yellow-500 mb-4 z-10">
              {mealFeedback.rating_out_of_10} <span className="text-xl text-yellow-500/50">/ 10</span>
            </div>

            <p className="font-body-md text-on-surface-variant italic mb-6 z-10 leading-relaxed bg-surface-container-low p-4 rounded-xl border border-surface-variant/50 relative">
              <span className="absolute -top-3 -left-2 text-3xl text-primary/20 font-serif">"</span>
              {mealFeedback.zai_feedback}
              <span className="absolute -bottom-5 -right-2 text-3xl text-primary/20 font-serif">"</span>
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-xl py-3 px-6 mb-6 w-full flex flex-col items-center justify-center gap-1">
              <span className="font-label-sm uppercase tracking-wider text-primary text-[10px] font-bold">Reward</span>
              <span className="font-stat-lg text-primary text-xl font-black">+{mealFeedback.xp_gained} XP</span>
            </div>

            <button type="button" onClick={handleFinish} className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold shadow-sm active:scale-95 transition-all">
              Claim XP &amp; Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
