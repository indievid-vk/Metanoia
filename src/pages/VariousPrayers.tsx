import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DecorativeDivider } from '../components/DecorativeDivider';

export default function VariousPrayers() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center mb-6 px-4">
        <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)]">Молитвы на разные случаи жизни</h2>
        <DecorativeDivider className="mt-4" />
      </div>

      <div className="grid gap-3 px-4 max-w-xl mx-auto">
        <button 
          onClick={() => navigate('/prayer-book/sick')}
          className="bg-[var(--color-parchment)] border border-[var(--color-ink)]/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <span className="font-izhitsa text-lg text-[var(--color-ink)] block mb-1">Молитвы о болящих</span>
          <span className="text-sm text-[var(--color-ink)]/70">Молитва Пресвятой Троице, Богородице со святыми и ангелам</span>
        </button>
        <button 
          onClick={() => navigate('/prayer-book/children')}
          className="bg-[var(--color-parchment)] border border-[var(--color-ink)]/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <span className="font-izhitsa text-lg text-[var(--color-ink)] block mb-1">Молитвы о детях</span>
          <span className="text-sm text-[var(--color-ink)]/70">Молитвы ко Господу, Пресвятой Богородице и Ангелу Хранителю</span>
        </button>
        <button 
          onClick={() => navigate('/prayer-book/theotokos-various')}
          className="bg-[var(--color-parchment)] border border-[var(--color-ink)]/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <span className="font-izhitsa text-lg text-[var(--color-ink)] block mb-1">Молитвы ко Пресвятой Богородице</span>
          <span className="text-sm text-[var(--color-ink)]/70">Молитва пред иконой Ея «Избавительница»</span>
        </button>
        <button 
          onClick={() => navigate('/prayer-book/homeland')}
          className="bg-[var(--color-parchment)] border border-[var(--color-ink)]/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <span className="font-izhitsa text-lg text-[var(--color-ink)] block mb-1">Молитвы за Отечество</span>
          <span className="text-sm text-[var(--color-ink)]/70">О спасении России и афонская молитва</span>
        </button>
        <button 
          onClick={() => navigate('/prayer-book/spiritual-warfare')}
          className="bg-[var(--color-parchment)] border border-[var(--color-ink)]/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <span className="font-izhitsa text-lg text-[var(--color-ink)] block mb-1">Молитвы на брань духовную</span>
          <span className="text-sm text-[var(--color-ink)]/70">При искушениях и помыслах, Псалом 90</span>
        </button>
      </div>
    </div>
  );
}
