import React, { useState, useEffect } from 'react';
import { Settings, Zap } from 'lucide-react';

const AZKAR = [
  "أستغفر الله العظيم وأتوب إليه",
  "سبحان الله وبحمده، سبحان الله العظيم",
  "لا إله إلا الله، محمد رسول الله",
  "اللهم صل وسلم على نبينا محمد",
  "لا حول ولا قوة إلا بالله العلي العظيم",
  "الحمد لله حمداً كثيراً طيباً مباركاً فيه"
];

export const LoadingScreen: React.FC = () => {
  const [zekrIndex, setZekrIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setZekrIndex((prev) => (prev + 1) % AZKAR.length);
    }, 2500); // Change every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col items-center justify-center p-6 select-none" dir="rtl">
      {/* Dark Glass Center Card */}
      <div className="bg-[#121215] border border-white/10 rounded-3xl p-8 md:p-10 max-w-md w-full flex flex-col items-center space-y-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative my-2">
          {/* Animated Engine Gears */}
          <div className="flex items-center gap-1">
            <Settings 
              size={56} 
              className="text-brand-green animate-[spin_3s_linear_infinite]" 
            />
            <Settings 
              size={42} 
              className="text-brand-red animate-[spin_2s_linear_infinite_reverse] -mt-6" 
            />
            <Settings 
              size={48} 
              className="text-white/20 animate-[spin_4s_linear_infinite] -ml-4" 
            />
          </div>
          
          {/* Spark/Zap Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Zap 
              size={22} 
              className="text-amber-400 animate-pulse fill-amber-400" 
            />
          </div>
        </div>

        <div className="text-center space-y-4 w-full">
          <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
            جاري تشغيل المحرك<span className="animate-pulse text-brand-green">...</span>
          </h2>

          {/* Progress Bar */}
          <div className="w-56 h-2 bg-white/10 rounded-full overflow-hidden mx-auto border border-white/5 relative">
            <div className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full animate-[loading_1.8s_ease-in-out_infinite]"></div>
          </div>

          <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em]">
            MARKET AUTO DZ
          </p>
        </div>

        {/* Fully Visible Azkar Box */}
        <div className="w-full pt-2">
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl py-3 px-4 min-h-[52px] flex items-center justify-center shadow-inner">
            <p 
              key={zekrIndex}
              className="text-emerald-300 font-bold text-sm md:text-base text-center leading-normal animate-in fade-in duration-300"
            >
              {AZKAR[zekrIndex]}
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
