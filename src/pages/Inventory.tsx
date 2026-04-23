import { useFridgeContext, Ingredient } from "../context/FridgeContext";

const freshnessOrder: Record<Ingredient["freshness"], number> = {
  expiring_soon: 0,
  aging: 1,
  fresh: 2,
};

const freshnessLabel: Record<Ingredient["freshness"], { text: string; bg: string; textClass: string }> = {
  expiring_soon: { text: "Urgent", bg: "bg-red-100", textClass: "text-red-700" },
  aging: { text: "Soon", bg: "bg-orange-100", textClass: "text-orange-700" },
  fresh: { text: "OK", bg: "bg-emerald-100", textClass: "text-emerald-700" },
};

const freshnessIcon: Record<Ingredient["freshness"], string> = {
  expiring_soon: "warning",
  aging: "schedule",
  fresh: "check_circle",
};

const freshnessIconClass: Record<Ingredient["freshness"], string> = {
  expiring_soon: "bg-red-50 text-red-500",
  aging: "bg-orange-50 text-orange-500",
  fresh: "bg-emerald-50 text-emerald-500",
};

export default function Inventory() {
  const { analysisData } = useFridgeContext();

  const ingredients: Ingredient[] = analysisData
    ? [...analysisData.ingredients].sort(
        (a, b) => freshnessOrder[a.freshness] - freshnessOrder[b.freshness]
      )
    : [];

  const totalValue = ingredients.reduce((sum, item) => sum + item.estimated_cost_rm, 0);
  const expiringCount = ingredients.filter((i) => i.freshness === "expiring_soon").length;
  const totalSavableRM = analysisData?.meal_decisions.reduce((sum, m) => sum + m.waste_saved_rm, 0) || 0;

  return (
    <main className="px-container-margin pt-stack-md pb-[120px] flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <header className="flex flex-col gap-stack-sm pt-stack-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface text-[24px]">Your Inventory</h2>
        <p className="text-on-surface-variant font-body-md text-body-md">
          {ingredients.length > 0
            ? `${ingredients.length} items tracked • RM ${totalValue.toFixed(2)} total value`
            : "Scan your fridge to populate your inventory."}
        </p>
      </header>

      {ingredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-5 py-10 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant" style={{ fontVariationSettings: "'FILL' 1" }}>kitchen</span>
          <p className="text-on-surface-variant font-body-md text-sm">
            No inventory yet. Scan your fridge on the Home tab to get started.
          </p>
        </div>
      ) : (
        <>
          {expiringCount > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex gap-3 items-start">
              <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <div>
                <span className="font-bold text-red-800 text-sm">Action Needed</span>
                <p className="text-red-700 text-xs mt-1">{expiringCount} item{expiringCount > 1 ? "s" : ""} expiring soon — cook them today to save RM {ingredients.filter(i => i.freshness === "expiring_soon").reduce((s, i) => s + i.estimated_cost_rm, 0).toFixed(2)}!</p>
              </div>
            </div>
          )}

          {totalSavableRM > 0 && (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl shadow-sm flex gap-3 items-center">
              <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
              <div>
                <span className="font-bold text-emerald-800 text-sm">Total Savable: RM {totalSavableRM.toFixed(2)}</span>
                <p className="text-emerald-700 text-xs mt-0.5">Cook the recommended recipes to save this amount from the bin.</p>
              </div>
            </div>
          )}

          <section className="flex flex-col gap-3">
            {ingredients.map((item, idx) => {
              const badge = freshnessLabel[item.freshness];
              return (
                <div key={idx} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${freshnessIconClass[item.freshness]}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{freshnessIcon[item.freshness]}</span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <span className="font-bold text-on-surface text-[15px]">{item.name}</span>
                    <span className="text-on-surface-variant text-[13px] font-medium mt-0.5">{item.quantity}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase ${badge.bg} ${badge.textClass}`}>
                      {badge.text}
                    </div>
                    <span className="text-on-surface-variant text-[12px] font-semibold">RM {item.estimated_cost_rm.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
