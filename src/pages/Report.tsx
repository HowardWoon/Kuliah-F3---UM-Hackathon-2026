import { Link, useNavigate } from "react-router-dom";
import { useFridgeContext } from "../context/FridgeContext";

export default function Report() {
  const { analysisData, cookMeal } = useFridgeContext();
  const navigate = useNavigate();

  const handleCookThis = async (mealName: string, wasteSavedRm: number) => {
    await cookMeal(mealName, wasteSavedRm);
    navigate("/profile");
  };

  if (!analysisData) {
    // If user refreshes or visits directly without data
    return (
      <main className="p-container-margin flex flex-col gap-stack-lg max-w-2xl mx-auto items-center justify-center h-full">
        <h1 className="font-display-md text-on-surface">No Data Available</h1>
        <p className="text-on-surface-variant font-body-md text-center max-w-sm">
          Please upload a photo of your fridge to generate a decision report.
        </p>
        <Link to="/" className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-xl no-underline font-label-sm shadow-sm hover:scale-105 transition-transform">
          Go to Home
        </Link>
      </main>
    )
  }

  return (
    <main className="p-container-margin flex flex-col gap-stack-lg max-w-2xl mx-auto pb-8">
      <section className="flex flex-col gap-stack-sm pt-4 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "16px 16px" }}></div>
        <h1 className="font-display-lg text-display-lg text-on-surface z-10 relative">Decision Report</h1>
        <p className="text-on-surface-variant z-10 relative">Here's how to maximize your current ingredients.</p>
      </section>

      {analysisData.glm_insight && (
        <section className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-xl shadow-sm mt-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-bold text-primary">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <span>🧠 Z.AI Insight</span>
            </div>
            <p className="font-body-md text-on-surface text-sm italic ml-6">{analysisData.glm_insight}</p>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-stack-md">
        <h2 className="font-headline-md text-headline-md text-on-surface">Ranked Meal Options</h2>
        <div className="flex flex-col gap-stack-md">
          {analysisData.meal_decisions.map((meal, idx) => {
            return (
            <div key={idx} className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-row border border-outline-variant/30 relative items-stretch min-h-[128px]">
              <div className="w-1/3 shrink-0 relative">
                <img src={meal.image_src} alt={meal.meal_name} className="w-full h-full object-cover rounded-l-xl" />
              </div>
              <div className="p-stack-md py-3 flex flex-col gap-1 flex-grow justify-between">
                <div className="flex flex-col items-start gap-1">
                  <span className="bg-secondary-container text-on-secondary-container font-label-sm text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap self-end absolute top-3 right-3 shadow-sm border border-secondary/10">Save RM {meal.waste_saved_rm.toFixed(2)}</span>
                  <h3 className="font-body-lg text-body-lg font-semibold text-on-surface line-clamp-1 pr-16">{idx + 1}. {meal.meal_name}</h3>
                </div>
                <p className="text-on-surface-variant text-xs flex items-start gap-1 line-clamp-3 leading-relaxed">
                  <span className="material-symbols-outlined text-error text-[14px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  <span className="opacity-90"><span className="font-bold text-primary">Z.AI Priority Reason:</span> {meal.zai_priority_reason}</span>
                </p>
                <div className="mt-1 self-start flex gap-2">
                  <button type="button" onClick={() => navigate("/recipe", { state: { meal } })} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-[12px] hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    View Recipe
                  </button>
                  <button type="button" onClick={() => handleCookThis(meal.meal_name, meal.waste_saved_rm)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-[12px] hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                    Cook This
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-stack-md">
        <h2 className="font-headline-md text-headline-md text-on-surface flex items-center justify-between">
          Ingredients Detected
          <span className="font-body-md text-body-md text-on-surface-variant">
            Total: RM {analysisData.ingredients.reduce((acc, curr) => acc + curr.estimated_cost_rm, 0).toFixed(2)}
          </span>
        </h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-stack-md border border-outline-variant/30 flex flex-col gap-unit">
          {analysisData.ingredients.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-surface-container last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant ${item.freshness === "expiring_soon" ? "bg-error-container/30 text-error" : "bg-surface-variant"}`}>
                  <span className="material-symbols-outlined">{item.freshness === "expiring_soon" ? "warning" : "kitchen"}</span>
                </div>
                <span className="font-medium text-on-surface">{item.name} <span className="text-sm font-normal opacity-75">({item.quantity})</span></span>
              </div>
              <span className="text-on-surface-variant font-medium">RM {item.estimated_cost_rm.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
