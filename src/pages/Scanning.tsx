import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFridgeContext } from "../context/FridgeContext";

export default function Scanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAnalyzing, analysisData, validationError, error, scanProgress, scanStepText } = useFridgeContext();

  const previewUrls: string[] = location.state?.previewUrls || [];
  const scanBackgroundImage = previewUrls[0] || "/fridge_full_demo.jpg";

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
    <>
      <style>{`
        @keyframes deep-scan {
          0% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
        .animate-deep-scan {
          animation: deep-scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
      `}</style>
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
            <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] flex items-center justify-center animate-pulse overflow-hidden">
              <div className="w-16 h-16 border-t-8 border-l-8 border-teal-400 absolute top-0 left-0 rounded-tl-xl z-10" />
              <div className="w-16 h-16 border-t-8 border-r-8 border-teal-400 absolute top-0 right-0 rounded-tr-xl z-10" />
              <div className="w-16 h-16 border-b-8 border-l-8 border-teal-400 absolute bottom-0 left-0 rounded-bl-xl z-10" />
              <div className="w-16 h-16 border-b-8 border-r-8 border-teal-400 absolute bottom-0 right-0 rounded-br-xl z-10" />

              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="w-full h-full relative animate-deep-scan">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-teal-300 shadow-[0_0_15px_rgba(45,212,191,1),0_0_30px_rgba(45,212,191,0.5)] z-50"></div>
                  <div className="absolute top-[2px] left-0 w-full h-24 bg-gradient-to-b from-teal-400/30 to-transparent"></div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-[1px] h-full bg-teal-500/50"></div>
                <div className="w-full h-[1px] absolute bg-teal-500/50"></div>
                <div className="w-4 h-4 border border-teal-400 rounded-full absolute"></div>
              </div>
            </div>
          )}
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
    </>
  );
}
