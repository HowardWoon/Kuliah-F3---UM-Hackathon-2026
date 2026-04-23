import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFridgeContext } from "../context/FridgeContext";

export default function Home() {
  const { analysisData, analyzeImages, validationError, error, profileData, loadProfile } = useFridgeContext();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map(f => URL.createObjectURL(f));
      navigate("/scanning", { state: { previewUrls } });
      await analyzeImages(fileArray);
    }
  };

  const expiryAlerts = analysisData?.expiry_alerts || [];
  const savedRM = profileData?.saved_rm || 0;
  const mealsCooked = profileData?.meals_rated || 0;

  return (
    <main className="px-container-margin pt-stack-md pb-[120px] flex flex-col gap-stack-lg max-w-md mx-auto md:max-w-4xl md:px-stack-lg">
      <header className="flex flex-col gap-stack-sm pt-stack-sm">
        <h1 className="font-headline-md text-headline-md text-on-surface">Mindful Abundance</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Here is your weekly summary.</p>
      </header>

      <section className="grid grid-cols-2 gap-gutter">
        <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-t-[4px] border-secondary relative overflow-hidden flex flex-col gap-stack-sm justify-between min-h-[120px]">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[80px] text-secondary">savings</span>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Saved</span>
          </div>
          <div className="relative z-10">
            <span className="font-stat-lg text-stat-lg text-secondary block leading-none">RM {savedRM.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-t-[4px] border-primary relative overflow-hidden flex flex-col gap-stack-sm justify-between min-h-[120px]">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[80px] text-primary">restaurant</span>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Cooked</span>
          </div>
          <div className="relative z-10">
            <span className="font-stat-lg text-stat-lg text-primary block leading-none">
              {mealsCooked}<span className="text-[14px] font-medium ml-1">meals</span>
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-3">
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start text-blue-900 text-[13px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-full">
          <span className="material-symbols-outlined text-[18px] text-blue-500 shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          <p className="leading-relaxed"><strong className="font-semibold text-blue-950 block mb-0.5">Z.AI Pro Tip</strong> Snap clear photos of your fridge shelves or pantry. The more Z.AI sees, the better your savings.</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload fridge photos"
          title="Upload fridge photos"
        />
        <button type="button" onClick={handleScanClick} className="w-full bg-emerald-600 text-on-primary py-[18px] px-6 rounded-xl shadow-[0_8px_24px_rgba(5,150,105,0.25)] flex items-center justify-center gap-stack-sm active:scale-95 transition-all hover:bg-emerald-700 hover:shadow-[0_12px_28px_rgba(5,150,105,0.3)] group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera_front</span>
          <span className="font-label-sm text-label-sm text-on-primary text-[16px] tracking-wide">Scan Your Ingredients !</span>
        </button>

        {validationError && (
          <div className="mt-2 w-full bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-red-600">error</span>
              <div className="flex flex-col">
                <span className="font-bold text-red-800 text-sm">Z.AI Rejected Image(s)</span>
                <span className="text-red-700 text-xs mt-1">{validationError}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 w-full bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-red-600">error</span>
              <div className="flex flex-col">
                <span className="font-bold text-red-800 text-sm">Analysis Failed</span>
                <span className="text-red-700 text-xs mt-1">{error}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {expiryAlerts.length > 0 && (
        <section className="flex flex-col gap-stack-md mt-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="font-semibold text-gray-800 text-[18px] flex items-center gap-2">
              <span className="text-[20px]">&#9888;&#65039;</span> Expiring Watchlist
            </h2>
            <Link to="/report" className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors no-underline">View Report</Link>
          </div>
          <div className="flex flex-col gap-3">
            {expiryAlerts.map((alert, idx: number) => {
              const isUrgent = alert.urgency === 'today';
              return (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isUrgent ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <span className="font-bold text-gray-800 text-[15px]">{alert.ingredient}</span>
                  <span className="text-gray-500 text-[13px] font-medium mt-0.5">
                    {alert.urgency === 'today' ? 'Expires Today' : 'Expires Tomorrow'}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase ${isUrgent ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {isUrgent ? "Urgent" : "Soon"}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </section>
      )}
    </main>
  );
}
