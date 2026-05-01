import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Home, Church, BookOpen, Calendar, Book } from 'lucide-react';
import { COMMANDMENTS } from '../data/mock';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <>
      <div className={`h-[100dvh] flex flex-col max-w-md mx-auto ${isHome ? 'bg-transparent' : 'bg-[var(--color-parchment)]'} shadow-2xl relative`}>
        {/* Header */}
        <header className={`shrink-0 z-10 ${isHome ? 'bg-transparent text-shadow-sm' : 'bg-[var(--color-parchment)] border-b border-[var(--color-cinnabar)]/20 shadow-sm'}`}>
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
          <h1 className={`font-kurale text-[var(--color-cinnabar)] flex-1 text-center ${isHome ? 'text-2xl uppercase tracking-widest leading-tight' : 'text-xl'}`}>
            {getPageTitle(location.pathname)}
          </h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <div className={isHome ? "absolute inset-0" : "w-full p-4"}>
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Optional, but good for PWA) */}
      <nav className={`shrink-0 w-full ${isHome ? 'bg-[var(--color-parchment)]/80 backdrop-blur-md border-t-0' : 'bg-[var(--color-parchment)] border-t border-[var(--color-cinnabar)]/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'} flex justify-around py-3 px-2 z-20`}>
        <NavButton to="/" current={location.pathname} icon={<Home size={20} />} label="Главная" onClick={() => navigate('/')} />
        <NavButton to="/temple" current={location.pathname} icon={<Church size={20} />} label="В Храм" onClick={() => navigate('/temple')} />
        <NavButton to="/prayer-book" current={location.pathname} icon={<BookOpen size={20} />} label="Молитва" onClick={() => navigate('/prayer-book')} />
        <NavButton to="/calendar" current={location.pathname} icon={<Calendar size={20} />} label="Календарь" onClick={() => navigate('/calendar')} />
        <NavButton to="/gospel-life" current={location.pathname} icon={<Book size={20} />} label="Евангелие" onClick={() => navigate('/gospel-life')} />
      </nav>
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
  if (path.startsWith('/gospel-life')) return 'Жизнь по Евангелию';
  if (path.startsWith('/my-confession')) return 'Моя исповедь';
  return 'Путь спасения';
}

function NavButton({ to, current, icon, label, onClick }: { to: string, current: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 transition-colors ${isActive ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]'}`}
    >
      <span className="mb-1">{icon}</span>
      <span className="text-[10px] uppercase font-kurale tracking-wider">{label}</span>
    </button>
  );
}
