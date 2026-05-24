import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import gospelCommandmentsData from '../data/commandments.json';
import { getAssetPath } from '../utils';
import { DecorativeDivider } from '../components/DecorativeDivider';

interface InteractiveButtonProps {
  onClick: () => void;
  className: string;
  label: string;
}

function InteractiveButton({ onClick, className, label }: InteractiveButtonProps) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-transparent flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer z-50 ${className}`}
      aria-label={label}
      title={label}
    >
      {/* Dim base border */}
      <div className="absolute inset-0 rounded-[50%] border border-yellow-600/30 pointer-events-none" />

      {/* Main glowing beam moving along the contour */}
      <div className="absolute inset-0 rounded-[50%] overflow-hidden pointer-events-none sparkle-border-mask">
        <motion.div 
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_42%,rgba(250,204,21,0.6)_45%,rgba(255,255,255,1)_50%,rgba(250,204,21,0.6)_55%,transparent_60%,transparent_100%)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Outer blurred glow to create the "thickening" appearance */}
      <div className="absolute inset-[-4px] rounded-[50%] overflow-hidden pointer-events-none sparkle-border-mask blur-[4px] opacity-70">
        <motion.div 
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_38%,rgba(250,204,21,0.8)_45%,rgba(255,255,255,1)_50%,rgba(250,204,21,0.8)_55%,transparent_62%,transparent_100%)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </motion.button>
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
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [commandmentGroups, setCommandmentGroups] = useState<any[][]>([]);

  useEffect(() => {
    const showBeatitudes = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone ||
                           document.referrer.includes('android-app://') ||
                           window.location.search.includes('mode=standalone');
      
      if (!isStandalone) return;

      try {
        const hasSeen = sessionStorage.getItem('beatitudesSeen');
        if (!hasSeen) {
          setShowPopup(true);
          sessionStorage.setItem('beatitudesSeen', 'true');
        }
      } catch (e) {
        console.warn('SessionStorage access failed:', e);
      }
    };

    const checkAndShow = () => {
      // Check both global flag and if needUpdate/offlineReady would be true
      if ((window as any).pwaPopupActive) {
        window.addEventListener('pwa-popup-closed', showBeatitudes, { once: true });
      } else {
        showBeatitudes();
      }
    };

    // Wait longer to allow PWA check to initialize and signal its presence
    const timer = setTimeout(checkAndShow, 2000);

    // Process commandments into groups of 3 individual verses/quotes
    const gospelCommandmentsInput = Array.isArray(gospelCommandmentsData) 
      ? gospelCommandmentsData 
      : (gospelCommandmentsData as any).default || [];
      
    const flattened: any[] = [];
    gospelCommandmentsInput.forEach((section: any) => {
      if (section.content && section.content.trim()) {
        const verses = section.content.split('\n\n')
          .map((v: string) => v.trim())
          .filter((v: string) => v.length > 5); 
        
        verses.forEach((verse: string) => {
          flattened.push({
            title: section.title,
            content: verse
          });
        });
      }
    });

    const groups = [];
    for (let i = 0; i < flattened.length; i += 3) {
      groups.push(flattened.slice(i, i + 3));
    }
    setCommandmentGroups(groups);

    // Select next group in cycle on each mount
    if (groups.length > 0) {
      try {
        const storedIdx = localStorage.getItem('lastCommandmentGroupIdx');
        const lastIdx = storedIdx ? parseInt(storedIdx, 10) : -1;
        const nextIdx = (lastIdx + 1) % groups.length;
        setCurrentGroupIdx(nextIdx);
        localStorage.setItem('lastCommandmentGroupIdx', nextIdx.toString());
      } catch (e) {
        console.warn('LocalStorage access failed:', e);
        setCurrentGroupIdx(0);
      }
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pwa-popup-closed', showBeatitudes);
    };
  }, []);

  const currentGroup = commandmentGroups[currentGroupIdx] || [];

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden">
      {/* Background stardust texture blending over Layout's parchment color */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden mix-blend-multiply opacity-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-parchment)] border-2 border-[var(--color-cinnabar)]/50 p-4 sm:px-6 sm:py-8 rounded-[2rem] max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-4 text-3xl font-light text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] z-10"
            >
              ×
            </button>
            <div className="shrink-0">
              <h2 className="font-izhitsa text-xl sm:text-4xl text-center text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">Заповеди Блаженств</h2>
              <div className="text-center text-sm font-izhitsa italic text-[var(--color-ink)]/70 mb-4">(Мф. 5:3-12)</div>
              <DecorativeDivider />
            </div>
            
            <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col mt-4">
              {/* Top scroll shadow */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[var(--color-ink)]/10 to-transparent z-10 pointer-events-none shadow-[inset_0_10px_10px_-10px_rgba(0,0,0,0.2)]" />
              
              <div className="overflow-y-auto flex-1 pr-1 sm:pr-2 py-4 relative scroll-smooth custom-scrollbar">
                <ul className="space-y-4 px-1 sm:px-2 pb-4">
                  {BEATITUDES.map((cmd, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="font-izhitsa text-[var(--color-cinnabar)] shrink-0">{idx + 1}.</span>
                      <span className="text-sm sm:text-lg text-[var(--color-ink)] text-justify leading-snug">{cmd}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Bottom scroll shadow */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--color-ink)]/10 to-transparent z-10 pointer-events-none shadow-[inset_0_-10px_10px_-10px_rgba(0,0,0,0.2)]" />
            </div>

            <div className="shrink-0 mt-2">
              <DecorativeDivider />
              <div className="mb-4 sm:mb-6" />
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-3 bg-gradient-to-r from-[var(--color-cinnabar)]/90 to-[var(--color-cinnabar)] text-white rounded-2xl font-izhitsa shadow-md hover:brightness-110 transition-all text-lg"
              >
                На главную
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cyclical Commandment Banner */}
      {currentGroup.length > 0 && (
        <div className="w-full relative z-10 shrink-0 h-[147px] flex flex-col items-center justify-center pl-2 pr-4 mt-2">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <DecorativeDivider className="mb-2" />
            
            <div className="relative w-full py-0 text-center">
               <div 
                className="w-full max-h-[71px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#6A3B28]/40 pl-2 pr-6 sm:pl-5 sm:pr-12"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                }}
              >
                <motion.div 
                  key={currentGroupIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="space-y-2"
                >
                  {currentGroup.map((cmd, idx) => (
                    <div key={idx} className="border-l-2 border-[var(--color-cinnabar)]/40 pl-3 py-0.5">
                      <div className="text-[13px] font-izhitsa leading-relaxed text-justify text-[#3A1E12]">
                        {cmd.content}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Minimal Indicators */}
              <div className="flex justify-center gap-1.5 mt-0.5 pointer-events-none">
                {commandmentGroups.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${idx === currentGroupIdx ? 'bg-[var(--color-cinnabar)] w-4' : 'bg-[var(--color-cinnabar)]/30'}`}
                  />
                ))}
              </div>
            </div>

            <DecorativeDivider className="mt-1" />
          </div>
        </div>
      )}

      {/* Main Interactive Image Area */}
      <div className="flex-1 w-full relative flex flex-col items-center justify-center px-9 pb-9 pt-7 overflow-hidden">
        {/* Divine Background Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,220,150,0.15)_0%,transparent_60%)] pointer-events-none mix-blend-screen" />

        <div className="relative w-full h-full flex flex-col items-center justify-center z-20 origin-center">
          <div className="relative flex items-center justify-center" style={{ aspectRatio: '369/500', maxHeight: '100%', maxWidth: '100%' }}>
            
            <img 
              src={getAssetPath("/images/home-bg.webp")} 
              alt="Обложка Помощь кающимся" 
              className="w-full h-full object-contain block"
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

        {/* Floating Interactive Compass Rose (Роза ветров) pointing to the Map of Gospel events */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/gospel-life/route-map')}
          className="absolute bottom-1 right-2 sm:bottom-4 sm:right-6 md:right-10 lg:right-24 xl:right-32 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto z-40 cursor-pointer flex flex-col items-center group touch-manipulation"
        >
          {/* Subtle warm ambient glow behind the compass on hover */}
          <div className="absolute inset-x-0 top-0 bottom-8 rounded-full bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* SVG representation of the historical red-terracotta compass rose */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[25deg]">
            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full drop-shadow-[0_4px_10px_rgba(106,59,40,0.22)]"
            >
              {/* Outer classic dashed & detailed circles matching antique maps */}
              <circle cx="100" cy="100" r="58" fill="none" stroke="var(--color-cinnabar)" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
              <circle cx="100" cy="100" r="53" fill="none" stroke="#6D4130" strokeWidth="0.8" strokeDasharray="6,2" opacity="0.25" />
              <circle cx="100" cy="100" r="12" fill="none" stroke="var(--color-cinnabar)" strokeWidth="0.8" opacity="0.32" />

              {/* Cardinal line markers inside the circle */}
              <line x1="100" y1="42" x2="100" y2="48" stroke="var(--color-cinnabar)" strokeWidth="1.2" opacity="0.75" />
              <line x1="100" y1="152" x2="100" y2="158" stroke="var(--color-cinnabar)" strokeWidth="1.2" opacity="0.75" />
              <line x1="42" y1="100" x2="48" y2="100" stroke="var(--color-cinnabar)" strokeWidth="1.2" opacity="0.75" />
              <line x1="152" y1="100" x2="158" y2="100" stroke="var(--color-cinnabar)" strokeWidth="1.2" opacity="0.75" />
              
              {/* Secondary Diagonal Diamond Points (faded background needles) */}
              {/* NW-SE */}
              <g opacity="0.5">
                <polygon points="100,100 100,94 62,62" fill="#8c764e" />
                <polygon points="100,100 94,100 62,62" fill="#bba683" />
                <polygon points="100,100 100,106 138,138" fill="#8c764e" />
                <polygon points="100,100 106,100 138,138" fill="#bba683" />
              </g>
              {/* NE-SW */}
              <g opacity="0.5">
                <polygon points="100,100 100,94 138,62" fill="#bba683" />
                <polygon points="100,100 106,100 138,62" fill="#8c764e" />
                <polygon points="100,100 100,106 62,138" fill="#bba683" />
                <polygon points="100,100 94,100 62,138" fill="#8c764e" />
              </g>

              {/* Major Cardinal Needles with gorgeous deep bevel shadows (3D look) */}
              {/* North Needle */}
              <polygon points="100,100 100,16 90,100" fill="#b04e43" />
              <polygon points="100,100 100,16 110,100" fill="#852f25" />

              {/* South Needle */}
              <polygon points="100,100 100,184 90,100" fill="#852f25" />
              <polygon points="100,100 100,184 110,100" fill="#b04e43" />

              {/* West Needle */}
              <polygon points="100,100 24,100 100,90" fill="#b04e43" />
              <polygon points="100,100 24,100 100,110" fill="#852f25" />

              {/* East Needle */}
              <polygon points="100,100 176,100 100,90" fill="#852f25" />
              <polygon points="100,100 176,100 100,110" fill="#b04e43" />

              {/* Vintage Center Pin details */}
              <circle cx="100" cy="100" r="5.5" fill="#fdfbf6" stroke="#852f25" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="1.8" fill="#ac2e2e" />

              {/* Slender red label "N" for North exactly like in the reference image */}
              <text 
                x="100" 
                y="9" 
                fill="#ac2e2e" 
                fontFamily="var(--font-sans), sans-serif" 
                fontWeight="900" 
                fontSize="17" 
                textAnchor="middle"
                className="select-none"
              >
                N
              </text>
            </svg>
          </div>

          {/* Letter-spaced antique caption label in the matching font */}
          <span className="mt-0 sm:mt-1.5 text-xs sm:text-sm lg:text-base font-izhitsa text-[#6A3B28] group-hover:text-[var(--color-cinnabar)] tracking-[0.25em] transition-colors duration-300 select-none uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            К А Р Т А
          </span>
        </motion.div>
      </div>
    </div>
  );
}
