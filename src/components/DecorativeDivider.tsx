import React from 'react';

export function DecorativeDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-5 w-full py-1 opacity-80 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--color-cinnabar)]" />
      <span className="text-[var(--color-cinnabar)] text-xl leading-none">❦</span>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--color-cinnabar)]" />
    </div>
  );
}
