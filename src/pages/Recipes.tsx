import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFridgeContext, MealDecision } from "../context/FridgeContext";

export default function Recipes() {
  const navigate = useNavigate();
  const { savedMeals, loadSavedMeals } = useFridgeContext();

  useEffect(() => {
    loadSavedMeals();
  }, []);

  return (
    <main className="px-container-margin pt-stack-md flex flex-col gap-stack-lg max-w-2xl mx-auto pb-[120px]">
      <header className="flex flex-col gap-stack-sm pt-stack-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface text-[24px]">Your Z.AI Menu Library</h2>
        <p className="text-on-surface-variant font-body-md text-body-md">A beautiful collection of your past adaptive meals.</p>
      </header>

      {savedMeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-5 py-10 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
          <p className="text-on-surface-variant font-body-md text-sm">No recipes yet. Scan your fridge to generate your first Z.AI meal.</p>
        </div>
      ) : (
        <section className="flex flex-col gap-stack-md">
          {savedMeals.map((recipe, idx) => {
            const meal: MealDecision = {
              meal_name: recipe.meal_name,
              cuisine: recipe.cuisine,
              ingredients_used: recipe.ingredients_used,
              missing_ingredients: recipe.missing_ingredients,
              zai_priority_reason: recipe.zai_priority_reason,
              waste_saved_rm: recipe.waste_saved_rm,
              recipe_steps: recipe.recipe_steps,
              image_src: recipe.image_src,
            };

            return (
              <div key={recipe.id || idx} className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-row border border-outline-variant/30 relative items-stretch h-32 group">
                <div className="w-1/3 shrink-0 relative">
                  <img src={recipe.image_src} alt={recipe.meal_name} className="w-full h-full object-cover rounded-l-xl group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="p-stack-md py-3 flex flex-col gap-1 flex-grow justify-between overflow-hidden relative">
                  <div className="flex flex-col items-start gap-1">
                    <span className="bg-slate-100 text-slate-600 font-medium text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap self-end absolute top-3 right-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">savings</span>
                      RM {recipe.waste_saved_rm.toFixed(2)}
                    </span>
                    <h3 className="font-bold text-gray-900 text-[16px] line-clamp-1 pr-20">{recipe.meal_name}</h3>
                  </div>
                  <p className="text-on-surface-variant text-xs line-clamp-1 leading-tight opacity-80 mt-1">
                    {recipe.cuisine} &bull; {recipe.ingredients_used.length} ingredients
                  </p>
                  <div className="mt-1 self-start">
                    <button
                      type="button"
                      onClick={() => navigate("/recipe", { state: { meal } })}
                      className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary px-4 py-1.5 rounded-lg font-label-sm text-[12px] active:scale-95 transition-all shadow-sm flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
                      Cook Again
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
