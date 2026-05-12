import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { getAssetPath } from '../utils';
import { COMMANDMENTS } from '../data/mock';
import InstallPrompt from './InstallPrompt';
import UpdatePopup from './UpdatePopup';
import ToastContainer from './Toast';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <>
      <div className={`h-full flex flex-col max-w-md mx-auto bg-[var(--color-parchment)] shadow-2xl relative overflow-hidden`}>
        {/* Header */}
        <header className="shrink-0 relative z-10 bg-[var(--color-parchment)]">
        <div className="flex items-center px-4 py-3">
          {!isHome ? (
            <button 
              onClick={() => navigate(-1)}
              className="mr-3 p-1 rounded-full hover:bg-black/5 transition-colors text-[var(--color-cinnabar)]"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="w-8 mr-3" />
          )}
          <h1 className={`font-izhitsa text-[var(--color-cinnabar)] flex-1 text-center transition-colors z-20 ${isHome ? 'text-3xl uppercase tracking-widest leading-tight drop-shadow-sm' : 'text-2xl'}`}>
            {getPageTitle(location.pathname)}
          </h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={isHome ? "absolute inset-0" : "w-full p-4 pb-[100px]"}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isHome && (
        <div className="absolute bottom-4 w-full pointer-events-none z-30 flex justify-center px-4">
          <nav className="pointer-events-auto bg-transparent border border-[var(--color-cinnabar)]/10 text-[var(--color-ink)]/70 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex justify-center items-end gap-1 px-3 pt-2 pb-3 w-full max-w-[340px] rounded-[2.5rem] transition-colors duration-500">
            <NavButton to="/gospel-life" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Evandelie.webp")} label="Евангелие" onClick={() => navigate('/gospel-life')} />
            <NavButton to="/temple" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Hram.webp")} label="В Храм" onClick={() => navigate('/temple')} />
            <NavButton to="/" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Home.webp")} label="Главная" onClick={() => navigate('/')} isCentral />
            <NavButton to="/prayer-book" current={location.pathname} imgSrc={getAssetPath("/icons/icon_Molitva.webp")} label="Молитва" onClick={() => navigate('/prayer-book')} />
            <NavButton to="/calendar" current={location.pathname} imgSrc={getAssetPath("/icons/icon_calendar.webp")} label="Календарь" onClick={() => navigate('/calendar')} />
          </nav>
        </div>
      )}
      <InstallPrompt />
      <UpdatePopup />
      <ToastContainer />
    </div>
    </>
  );
}

function getPageTitle(path: string) {
  if (path === '/') return 'Помощь кающимся';
  if (path.startsWith('/temple/confession')) return 'Исповедь';
  if (path.startsWith('/temple')) return 'В Храм';
  if (path.startsWith('/prayer-book')) return 'Молитва';
  if (path.startsWith('/calendar')) return 'Календарь';
  if (path.startsWith('/gospel-life/catechesis/questions')) return 'Контрольные вопросы';
  if (path.startsWith('/gospel-life/catechesis')) return 'Оглашение';
  if (path.startsWith('/gospel-life')) return 'Жизнь по Евангелию';
  if (path.startsWith('/my-confession')) return 'Моя исповедь';
  if (path === '/angels') return 'Мир Ангелов';
  if (path === '/scripture') return 'Писание';
  if (path === '/spiritual-literature') return 'Библиотека';
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
