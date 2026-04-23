import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFridgeContext } from "../context/FridgeContext";

const boxColors = [
  { border: "border-red-500", label: "bg-red-500" },
  { border: "border-green-500", label: "bg-green-500" },
  { border: "border-blue-500", label: "bg-blue-500" },
  { border: "border-yellow-500", label: "bg-yellow-500" },
  { border: "border-purple-500", label: "bg-purple-500" },
  { border: "border-pink-500", label: "bg-pink-500" },
];

const boxPositions = [
  { top: "25%", left: "15%", width: "30%", height: "20%" },
  { top: "50%", left: "55%", width: "25%", height: "18%" },
  { top: "35%", left: "50%", width: "28%", height: "22%" },
  { top: "60%", left: "20%", width: "22%", height: "16%" },
  { top: "20%", left: "60%", width: "26%", height: "18%" },
  { top: "55%", left: "35%", width: "24%", height: "20%" },
];

export default function Scanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAnalyzing, analysisData, validationError, error } = useFridgeContext();

  const previewUrls: string[] = location.state?.previewUrls || [];

  const [progress, setProgress] = useState(5);
  const [detectedNames, setDetectedNames] = useState<string[]>([]);

  // Progress animation — ramps up slowly, jumps on completion
  useEffect(() => {
    setProgress(5);
    setDetectedNames([]);

    const timer = setInterval(() => {
      setProgress(p => {
        if (p < 30) return p + Math.random() * 8;
        if (p < 60) return p + Math.random() * 5;
        if (p < 85) return p + Math.random() * 2;
        return p; // sit at 85% until API responds
      });
    }, 600);
    return () => clearInterval(timer);
  }, []);

  // When API returns data, reveal detected ingredient names
  useEffect(() => {
    if (analysisData && !isAnalyzing) {
      setDetectedNames(analysisData.ingredients.map(i => i.name));
    }
  }, [analysisData, isAnalyzing]);

  // Navigate away when analysis completes
  useEffect(() => {
    if (!isAnalyzing) {
      if (validationError || error) {
        navigate("/");
      } else if (analysisData) {
        setProgress(100);
        setTimeout(() => navigate("/report"), 500);
      }
    }
  }, [isAnalyzing, analysisData, validationError, navigate]);

  const detectedItems = detectedNames.map((name, i) => ({
    id: i,
    name,
    color: boxColors[i % boxColors.length],
    position: boxPositions[i % boxPositions.length],
  }));

  const totalValue = analysisData
    ? analysisData.ingredients.reduce((a, b) => a + b.estimated_cost_rm, 0)
    : 0;

  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center sm:p-4">
      <div className="max-w-md w-full mx-auto h-[100dvh] sm:h-[844px] bg-black flex flex-col relative overflow-hidden shadow-2xl sm:rounded-[40px] ring-1 ring-white/10">
        <div className="absolute top-0 w-full h-1/2 left-0 right-0 z-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {previewUrls.map((url: string, index: number) => (
            <div key={index} className="w-full h-full shrink-0 snap-center relative">
              <img
                className="w-full h-full object-cover opacity-90"
                src={url}
                alt={`Scan ${index + 1}`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>

          {detectedItems.map((item) => (
            <div
              key={item.id}
              className={`absolute border-2 ${item.color.border} rounded-sm shadow-sm opacity-80 animate-pulse`}
              style={{ top: item.position.top, left: item.position.left, width: item.position.width, height: item.position.height }}
            >
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 ${item.color.label} text-white font-label-sm text-[10px] rounded-full shadow-md whitespace-nowrap`}>
                {item.name}
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
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Z.AI is analyzing...</h2>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Scanning ingredients with Z.AI Vision...</p>
            </div>
          </div>

          <div className="w-full mt-2">
            <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-primary rounded-full relative transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 font-label-sm text-label-sm text-outline">
              <span>{progress >= 100 ? "Analysis complete!" : "Identifying components..."}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
          </div>

          <div className="bg-surface-bright rounded-2xl p-stack-md flex justify-between items-center border border-surface-variant shadow-sm mt-stack-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed-dim/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex flex-col gap-1 z-10">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Estimated Value</span>
              <span className="font-stat-lg text-stat-lg text-primary text-[24px]">RM {totalValue > 0 ? totalValue.toFixed(2) : "..."}</span>
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
