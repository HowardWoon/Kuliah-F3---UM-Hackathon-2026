import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFridgeContext } from "../context/FridgeContext";

const detectionBoxes = [
  {
    id: "cauliflower",
    className: "absolute border border-teal-400 rounded-sm top-[60%] left-[25%] w-[45%] h-[15%] transition-all duration-700",
    fallbackLabel: "Cauliflower",
  },
  {
    id: "nam-ru",
    className: "absolute border border-teal-400 rounded-sm top-[75%] left-[75%] w-[20%] h-[12%] transition-all duration-700 delay-100",
    fallbackLabel: "Nam Ru",
  },
  {
    id: "eggs",
    className: "absolute border border-teal-400 rounded-sm top-[42%] left-[30%] w-[35%] h-[10%] transition-all duration-700 delay-200",
    fallbackLabel: "Eggs",
  },
  {
    id: "top-shelf",
    className: "absolute border border-teal-400 rounded-sm top-[30%] left-[20%] w-[25%] h-[8%] transition-all duration-700 delay-300",
    fallbackLabel: "Top Shelf",
  },
];

export default function Scanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAnalyzing, analysisData, validationError, error, scanProgress, scanStepText } = useFridgeContext();

  const previewUrls: string[] = location.state?.previewUrls || [];
  const scanBackgroundImage = previewUrls[0] || "/fridge_full_demo.jpg";

  const [detectedNames, setDetectedNames] = useState<string[]>([]);

  // Only reveal ingredient names AFTER loading completes
  useEffect(() => {
    if (analysisData && !isAnalyzing) {
      setDetectedNames(analysisData.ingredients.map(i => i.name));
    } else if (isAnalyzing) {
      setDetectedNames([]);
    }
  }, [analysisData, isAnalyzing]);

  // Navigate away when analysis completes
  useEffect(() => {
    if (!isAnalyzing) {
      if (validationError || error) {
        navigate("/");
      } else if (analysisData) {
        setTimeout(() => navigate("/report"), 500);
      }
    }
  }, [isAnalyzing, analysisData, validationError, navigate]);

  // Only compute total value when NOT loading
  const totalValue = !isAnalyzing && analysisData
    ? analysisData.ingredients.reduce((a, b) => a + b.estimated_cost_rm, 0)
    : 0;

  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center sm:p-4">
      <div className="max-w-md w-full mx-auto h-[100dvh] sm:h-[844px] bg-black flex flex-col relative overflow-hidden shadow-2xl sm:rounded-[40px] ring-1 ring-white/10">
        <div className="absolute top-0 w-full h-1/2 left-0 right-0 z-0 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-90"
            src={scanBackgroundImage}
            alt="Fridge scan background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
          <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center transition-all duration-500 pointer-events-none">
              <div className="relative h-[42%] w-[72%] rounded-xl border border-emerald-300/40 shadow-[0_0_24px_rgba(16,185,129,0.25)] animate-pulse">
                <div className="absolute left-4 right-4 top-1/2 h-[2px] -translate-y-1/2 bg-emerald-300/90 shadow-[0_0_16px_rgba(52,211,153,0.9)] animate-pulse" />
              </div>
            </div>
          )}

          {detectionBoxes.map((box, i) => (
            <div
              key={box.id}
              className={`${box.className} ${isAnalyzing ? "shadow-[0_0_16px_rgba(45,212,191,0.55)] animate-pulse" : "shadow-[0_0_12px_rgba(45,212,191,0.35)] opacity-90"}`}
            >
              <span className={`absolute -top-3 left-0 px-2 py-0.5 bg-teal-500/90 text-white font-label-sm text-[10px] rounded-sm shadow-md whitespace-nowrap ${isAnalyzing ? "animate-pulse" : ""}`}>
                {isAnalyzing ? "Scanning..." : detectedNames[i] || box.fallbackLabel}
              </span>
            </div>
          ))}
        </div>

        <header className="absolute top-0 w-full p-gutter pt-10 flex justify-between items-center z-20">
          <button type="button" onClick={() => navigate("/")} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <button type="button" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">flash_on</span>
          </button>
        </header>

        <div className="absolute bottom-0 w-full bg-surface-container-lowest rounded-t-[32px] p-stack-lg pb-10 z-30 shadow-[0_-12px_40px_rgba(0,0,0,0.2)] flex flex-col gap-stack-md pointer-events-auto">
          <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-stack-sm"></div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-primary relative overflow-hidden">
              <span className="material-symbols-outlined text-[28px] z-10 relative animate-pulse">document_scanner</span>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/10 animate-[bounce_2s_infinite]"></div>
            </div>
            <div className="flex-1">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">ILMU-GLM-5.1 is analyzing...</h2>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{scanStepText || "Initializing ILMU-GLM-5.1 pipeline..."}</p>
            </div>
          </div>

          <div className="w-full mt-2">
            <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-primary rounded-full relative transition-all duration-500 ease-out"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 font-label-sm text-label-sm text-outline">
              <span>{scanProgress >= 100 ? "Analysis complete!" : scanStepText}</span>
              <span>{Math.floor(scanProgress)}%</span>
            </div>
          </div>

          <div className="bg-surface-bright rounded-2xl p-stack-md flex justify-between items-center border border-surface-variant shadow-sm mt-stack-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed-dim/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex flex-col gap-1 z-10">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Estimated Value</span>
              {isAnalyzing ? (
                <span className="font-stat-lg text-stat-lg text-primary text-[24px] animate-pulse">RM [ Calculating... ]</span>
              ) : (
                <span className="font-stat-lg text-stat-lg text-primary text-[24px]">RM {totalValue > 0 ? totalValue.toFixed(2) : "..."}</span>
              )}
            </div>
            <div className="w-12 h-12 bg-surface-container-lowest rounded-full shadow-sm flex items-center justify-center border border-surface-variant z-10 text-primary">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
