import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gospelCommandmentsData from '../data/commandments.json';
import { getAssetPath } from '../utils';

interface InteractiveButtonProps {
  onClick: () => void;
  className: string;
  label: string;
}

function InteractiveButton({ onClick, className, label }: InteractiveButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-transparent hover:bg-yellow-500/10 active:bg-yellow-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer z-50 ${className}`}
      aria-label={label}
      title={label}
    >
      {/* Dim base border so the unlit part of the oval is still visible */}
      <div className="absolute inset-0 rounded-[50%] border border-yellow-600/20 pointer-events-none" />

      {/* Outer blurred glow to create "thickening" effect */}
      <div className="absolute inset-[-2px] rounded-[50%] overflow-hidden pointer-events-none sparkle-border-mask blur-[3px] opacity-70">
        <div className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,transparent_30%,rgba(250,204,21,0.5)_40%,rgba(255,255,255,1)_50%,rgba(250,204,21,0.5)_60%,transparent_70%,transparent_100%)]" />
      </div>

      {/* Core sparkle traveling around the border */}
      <div className="absolute inset-0 rounded-[50%] overflow-hidden pointer-events-none sparkle-border-mask">
        <div className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,transparent_35%,rgba(250,204,21,0.4)_44%,rgba(255,255,255,1)_50%,rgba(250,204,21,0.4)_56%,transparent_65%,transparent_100%)]" />
      </div>
    </button>
  );
}

const BEATITUDES = [
  "Блаженны нищие духом, ибо их есть Царство Небесное.",
  "Блаженны плачущие, ибо они утешатся.",
  "Блаженны кроткие, ибо они наследуют землю.",
  "Блаженны алчущие и жаждущие правды, ибо они насытятся.",
  "Блаженны милостивые, ибо они помилованы будут.",
  "Блаженны чистые сердцем, ибо они Бога узрят.",
  "Блаженны миротворцы, ибо они будут наречены сынами Божиими.",
  "Блаженны изгнанные за правду, ибо их есть Царство Небесное.",
  "Блаженны вы, когда будут поносить вас и гнать и всячески неправедно злословить за Меня. Радуйтесь и веселитесь, ибо велика ваша награда на небесах."
];

export default function Home() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [randomCommandment, setRandomCommandment] = useState<{title: string, content: string} | null>(null);

  useEffect(() => {
    // Show beatitudes popup on every new session (app open)
    const hasSeen = sessionStorage.getItem('beatitudesSeen');
    if (!hasSeen) {
      setShowPopup(true);
      sessionStorage.setItem('beatitudesSeen', 'true');
    }

    // Select 1 random gospel commandment
    const gospelCommandments = Array.isArray(gospelCommandmentsData) 
      ? gospelCommandmentsData 
      : (gospelCommandmentsData as any).default || [];
      
    if (gospelCommandments && gospelCommandments.length > 0) {
      const randomIdx = Math.floor(Math.random() * gospelCommandments.length);
      setRandomCommandment(gospelCommandments[randomIdx]);
    }
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center overflow-hidden">
      {/* Full-screen background image */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <img 
          src={getAssetPath("/images/Fon_glav.webp")} 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-parchment)]/80 via-[var(--color-parchment)]/40 to-transparent" />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-[2mm] sm:p-4">
          <div className="bg-[var(--color-parchment)] border-2 border-[var(--color-ink)] p-4 sm:px-6 sm:py-8 rounded-lg max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-4 text-3xl font-light text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] z-10"
            >
              ×
            </button>
            <div className="shrink-0">
              <h2 className="font-kurale text-xl sm:text-3xl text-center text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">Заповеди Блаженств</h2>
              <div className="text-center text-sm font-serif italic text-[var(--color-ink)]/70 mb-4">(Мф. 5:3-12)</div>
              <div className="ornament-divider mb-4 sm:mb-6">☩</div>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-1 sm:pr-2">
              <ul className="space-y-4 px-1 sm:px-2 pb-4">
                {BEATITUDES.map((cmd, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="font-kurale text-[var(--color-cinnabar)] shrink-0">{idx + 1}.</span>
                    <span className="text-sm sm:text-lg text-[var(--color-ink)] text-justify leading-snug">{cmd}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 mt-2">
              <div className="ornament-divider mb-4 sm:mb-6">☩</div>
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-3 bg-[var(--color-parchment)] border border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] rounded-lg font-kurale shadow-sm hover:bg-[var(--color-cinnabar)]/5 transition-colors text-lg"
              >
                Спаси Господи
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Random Commandment Banner */}
      {randomCommandment && (
        <div className="w-full bg-[#fdf5e6]/20 backdrop-blur-md backdrop-saturate-150 border-b border-[#fdf5e6]/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] z-10 shrink-0 max-h-[90px] overflow-y-auto">
          <p className="text-sm text-[var(--color-ink)] font-medium text-center italic leading-snug max-w-sm mx-auto py-3 px-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {randomCommandment.content}
          </p>
        </div>
      )}

      {/* Main Interactive Image Area */}
      <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden p-8 sm:p-12">
        {/* Atmospheric Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-40">
          {/* Texture Overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
        </div>

        <div className="relative w-full h-full flex items-center justify-center z-20">
          <div className="relative" style={{ aspectRatio: '369/500', maxHeight: '100%', maxWidth: '100%' }}>
            <img 
              src={getAssetPath("/images/home-bg.webp")} 
              alt="Обложка Путь спасения" 
              className="w-full h-full object-contain block drop-shadow-2xl"
            />
            
            {/* Transparent overlay buttons positioned over the image ovals */}
            <div className="absolute inset-0 z-30">
              {/* Calendar: Top-Left */}
              <InteractiveButton 
                onClick={() => navigate('/calendar')}
                className="top-[20.5%] left-[25%] w-[24%] h-[23%]"
                label="Календарь"
              />
              
              {/* Prayer: Top-Right */}
              <InteractiveButton 
                onClick={() => navigate('/prayer-book')}
                className="top-[20%] left-[79%] w-[24%] h-[23%]"
                label="Молитва"
              />
              
              {/* Temple: Center */}
              <InteractiveButton 
                onClick={() => navigate('/temple')}
                className="top-[49%] left-[52.5%] w-[35%] h-[34%]"
                label="В Храм"
              />
              
              {/* Gospel: Bottom Center (Horizontal) */}
              <InteractiveButton 
                onClick={() => navigate('/gospel-life')}
                className="top-[81.5%] left-[52%] w-[57.5%] h-[16.5%]"
                label="Жизнь по Евангелию"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
