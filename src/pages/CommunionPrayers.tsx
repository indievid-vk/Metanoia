import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CommunionPrayers() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center mb-6 px-4">
        <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)]">Молитвы ко Святому Причащению</h2>
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => navigate('/prayer-book/communion/warning')}
            className="px-6 py-2 bg-[var(--color-parchment)] border border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] rounded-lg font-kurale text-lg shadow-sm hover:shadow-md transition-shadow"
          >
            Предостережение причащающемуся
          </button>
        </div>
        <div className="ornament-divider mt-6">☩</div>
      </div>

      <div className="grid gap-3 px-4 max-w-xl mx-auto">
        {[
          { path: '/prayer-book/communion/canon-repentance', title: 'Канон покаянный ко Господу нашему Иисусу Христу' },
          { path: '/prayer-book/communion/canon-theotokos', title: 'Канон молебный ко Пресвятой Богородице' },
          { path: '/prayer-book/communion/canon-guardian-angel', title: 'Канон Ангелу-Хранителю' },
          { path: '/prayer-book/communion/communion-prayers', title: 'Последование ко Святому Причащению' },
          { path: '/prayer-book/communion/thanksgiving', title: 'Благодарственные молитвы по Святом Причащении' }
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => navigate(item.path)}
            className="bg-[var(--color-parchment)] border border-[var(--color-ink)]/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <span className="font-kurale text-lg text-[var(--color-ink)]">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
