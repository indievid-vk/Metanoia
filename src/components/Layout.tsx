import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Loader2, Info, Search, Bell } from 'lucide-react';
import { getHolidaysForDate, playBellChime, checkDailyReminders, getReminderSettings } from '../utils/reminderEngine';
import { getAssetPath } from '../utils';
import InstallPrompt from './InstallPrompt';
import UpdatePopup from './UpdatePopup';
import ToastContainer from './Toast';
import SearchOverlay from './SearchOverlay';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const [todayHolidays, setTodayHolidays] = useState<any[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, [location.pathname]);

  useEffect(() => {
    // 1. Run full reminder check (system notification + bell sound if first time today) on app start
    const timer = setTimeout(() => {
      checkDailyReminders(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 2. Load holidays for the in-app banner respecting flexible settings
    const settings = getReminderSettings();
    let active: any[] = [];
    if (settings.enabled) {
      active = checkDailyReminders(true); // Silent check based on user settings
    }
    
    if (active && active.length > 0) {
      setTodayHolidays(active);
    } else {
      // Fallback: if no reminders are enabled/configured or none triggered, show today's holiday by default
      const defaultHolidays = getHolidaysForDate(new Date());
      setTodayHolidays(defaultHolidays);
    }
    
    const lastDismissed = localStorage.getItem('holiday_banner_dismissed_date');
    const todayStr = new Date().toDateString();
    if (lastDismissed === todayStr) {
      setBannerDismissed(true);
    }
  }, [location.pathname]);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('holiday_banner_dismissed_date', new Date().toDateString());
  };

  const handlePlayHolidayBell = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBellChime();
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <UpdatePopup />
      <div className={`h-[100dvh] w-full flex flex-col max-w-md mx-auto bg-[var(--color-parchment)] shadow-2xl relative overflow-hidden`}>
        {/* Header */}
        <header className="shrink-0 relative z-10 bg-[var(--color-parchment)]">
        <div className="flex items-center px-4 py-3">
          {!isHome ? (
            <button 
              onClick={() => navigate(-1)}
              className="mr-3 p-1 rounded-full hover:bg-black/5 transition-colors text-[var(--color-cinnabar)]"
              aria-label="Назад"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="mr-3 p-1 rounded-full hover:bg-black/5 transition-colors text-[var(--color-cinnabar)] cursor-pointer"
              title="Поиск"
              aria-label="Поиск по приложению"
            >
              <Search size={22} />
            </button>
          )}
          <h1 className={`font-izhitsa text-[var(--color-cinnabar)] flex-1 text-center transition-colors z-20 ${isHome ? 'text-3xl uppercase tracking-widest leading-tight drop-shadow-sm' : 'text-2xl'}`}>
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center gap-1">
            {!isHome && (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-1 rounded-full hover:bg-black/5 transition-colors text-[var(--color-cinnabar)] cursor-pointer"
                title="Поиск"
                aria-label="Поиск по приложению"
              >
                <Search size={22} />
              </button>
            )}
            <button 
              onClick={() => navigate('/about')}
              className={`p-1 rounded-full hover:bg-black/5 transition-colors text-[var(--color-cinnabar)] cursor-pointer ${location.pathname === '/about' ? 'opacity-0 pointer-events-none' : ''}`}
              title="О приложении"
            >
              <Info size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Holiday Banner */}
      <AnimatePresence>
        {todayHolidays.length > 0 && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50/95 border-b border-[var(--color-cinnabar)]/20 px-4 py-2 flex items-center justify-between gap-3 relative z-20 shadow-xs overflow-hidden"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <button
                onClick={handlePlayHolidayBell}
                className="p-1.5 rounded-full bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/20 active:scale-95 transition-all cursor-pointer flex-shrink-0 animate-pulse"
                title="Послушать благовест колокола"
              >
                <Bell size={18} className="animate-bounce" />
              </button>
              <div className="text-left leading-tight min-w-0">
                <span className="text-[9px] bg-[var(--color-cinnabar)] text-amber-50 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider font-sans inline-block mb-0.5">
                  {todayHolidays[0].name.startsWith('Накануне') || todayHolidays[0].name.startsWith('За 3 дня') || todayHolidays[0].name.startsWith('За неделю') ? 'Напоминание' : 'Сегодня праздник'}
                </span>
                <h5 className="font-izhitsa text-xs sm:text-sm text-[var(--color-ink)] truncate max-w-[190px] sm:max-w-[240px]">
                  {todayHolidays[0].name}
                </h5>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => navigate('/calendar')}
                className="text-[10px] sm:text-xs font-izhitsa text-[var(--color-cinnabar)] hover:underline cursor-pointer bg-white/60 px-2 py-1 rounded-lg border border-[var(--color-cinnabar)]/10"
              >
                Подробнее
              </button>
              <button
                onClick={handleDismissBanner}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md text-xs cursor-pointer font-sans"
                title="Скрыть"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Dialog */}
      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          <div 
            className={isHome ? "absolute inset-0" : "w-full p-4 pb-[130px]"}
          >
            <Outlet />
          </div>
      </main>

      {!isHome && (
        <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] w-full pointer-events-none z-30 flex justify-center px-4">
          <div className="pointer-events-auto relative p-[6px] w-full max-w-[350px] rounded-[3rem] bg-gradient-to-br from-[#e0b069] via-[#8c6222] to-[#3a270f] shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.5)]">
            {/* Inner Antique Gold Bevel */}
            <div className="absolute inset-[4px] rounded-[2.8rem] border-[2px] border-[#ffd58e]/30 pointer-events-none" />
            <div className="absolute inset-[6px] rounded-[2.7rem] border border-[#2b1b0b]/60 pointer-events-none mix-blend-multiply" />
            
            <nav className="relative bg-[var(--color-parchment)]/85 text-[var(--color-ink)]/70 backdrop-blur-md shadow-[inset_0_4px_15px_rgba(0,0,0,0.3)] flex justify-center items-end gap-1 px-3 pt-2 pb-3 w-full rounded-[2.6rem] transition-colors duration-500 overflow-hidden">
              <NavButton to="/gospel-life" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Evandelie.webp")} label="Евангелие" onClick={() => navigate('/gospel-life')} />
              <NavButton to="/temple" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Hram.webp")} label="В Храм" onClick={() => navigate('/temple')} />
              <NavButton to="/" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Home.webp")} label="Главная" onClick={() => navigate('/')} isCentral />
              <NavButton to="/prayer-book" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Molitva.webp")} label="Молитва" onClick={() => navigate('/prayer-book')} />
              <NavButton to="/calendar" current={location.pathname} imgSrc={getAssetPath("/icons/icon_calendar.webp")} label="Календарь" onClick={() => navigate('/calendar')} />
            </nav>
          </div>
        </div>
      )}
      <InstallPrompt />
      <ToastContainer />
    </div>
    </>
  );
}

function getPageTitle(path: string) {
  if (path === '/') return 'Помощь кающимся';
  if (path.startsWith('/temple/divine-services/daily')) return 'Суточный круг';
  if (path.startsWith('/temple/divine-services')) return 'Богослужения';
  if (path.startsWith('/temple/liturgy')) return 'Божественная Литургия';
  if (path.startsWith('/temple/confession')) return 'Исповедь';
  if (path.startsWith('/temple')) return 'В Храм';
  if (path.startsWith('/prayer-book')) return 'Молитва';
  if (path.startsWith('/calendar')) return 'Календарь';
  if (path.startsWith('/gospel-life/catechesis/questions')) return 'Контрольные вопросы';
  if (path.startsWith('/gospel-life/catechesis')) return 'Оглашение';
  if (path.startsWith('/gospel-life/repentance-help')) return 'В помощь кающимся';
  if (path.startsWith('/gospel-life/route-map')) return 'Земной путь Христа';
  if (path.startsWith('/gospel-life/literature')) return 'Душеполезная информация';
  if (path.startsWith('/gospel-life/ascetics')) return 'Аскетика дня';
  if (path.startsWith('/gospel-life/commandments')) return 'Евангельские заповеди';
  if (path.startsWith('/gospel-life/dogmas')) return 'Догматы богословия';
  if (path.startsWith('/gospel-life')) return 'Жизнь по Евангелию';
  if (path.startsWith('/my-confession')) return 'Моя исповедь';
  if (path === '/angels') return 'Мир Ангелов';
  if (path === '/scripture') return 'Писание';
  if (path === '/spiritual-literature') return 'Библиотека';
  if (path === '/about') return 'О приложении';
  return 'Помощь кающимся';
}

function NavButton({ to, current, imgSrc, label, onClick, isCentral }: { to: string, current: string, imgSrc: string, label: string, onClick: () => void, isCentral?: boolean }) {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  return (
    <motion.button 
      whileTap={{ scale: 0.8, filter: "brightness(0.75)" }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${isCentral ? 'w-[72px]' : 'w-[54px]'} transition-all transform-gpu`}
    >
      <div className={`relative mb-1 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'opacity-85'}`}>
        <img src={imgSrc} alt={label} className={`${isCentral ? 'w-[48px] h-[48px]' : 'w-9 h-9'} object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]`} />
      </div>
      <span className={`text-[9px] uppercase font-izhitsa tracking-[0.05em] transition-colors ${isActive ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]/70'} ${isCentral ? 'mt-1' : ''}`}>
        {label}
      </span>
    </motion.button>
  );
}
