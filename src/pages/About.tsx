import React from 'react';
import { Info, Mail, Github, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/20 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[var(--color-cinnabar)]/10 rounded-xl flex items-center justify-center text-[var(--color-cinnabar)]">
            <Info size={24} />
          </div>
          <h2 className="font-izhitsa text-2xl text-[var(--color-ink)]">О приложении</h2>
        </div>
        
        <div className="prose prose-sm text-[var(--color-ink)]/80 leading-relaxed font-serif">
          <p>
            Приложение Помощь кающимся - это практический помощник для православных христиан, стремящихся к покаянному образу жизни по Евангелию.
          </p>
          <p>
            Приложение объединяет в себе огласительные беседы для правильного понимания православной веры, библиотеку святоотеческих трудов для ежедневного чтения, молитвослов, календарь, дневник кающегося с примерами грехов по 8 страстям для подготовки к Исповеди, борьбы со страстями.
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/10 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Технология PWA</h3>
        <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed font-serif">
          Данное приложение построено на технологии <strong>Progressive Web App (PWA)</strong>, что позволяет установить его прямо из браузера как обычную программу.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-green-700 mb-2">Преимущества</h4>
            <ul className="text-xs space-y-1.5 text-green-800/80 list-disc pl-4">
              <li>Офлайн-доступ: работает без интернета после загрузки.</li>
              <li>Не занимает много места в памяти устройства.</li>
              <li>Мгновенные обновления без необходимости скачивания из магазинов.</li>
              <li>Безопасность: работает только через защищенный протокол HTTPS.</li>
            </ul>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-700 mb-2">Ограничения</h4>
            <ul className="text-xs space-y-1.5 text-amber-800/80 list-disc pl-4">
              <li>Зависимость от возможностей браузера.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/20 p-6 rounded-2xl shadow-sm text-center">
        <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] mb-4">Обратная связь</h2>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a
            href="mailto:indievid_studiio@mail.ru"
            className="flex items-center justify-center gap-2 py-3 bg-[var(--color-ink)]/[0.03] rounded-xl hover:bg-[var(--color-ink)]/[0.06] transition-colors text-[var(--color-ink)]/70 font-medium"
          >
            <Mail size={18} />
            <span>Написать разработчику</span>
          </a>
          <div className="pt-4 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2 text-[var(--color-ink)]/40 text-xs">
              <Heart size={14} className="text-[var(--color-cinnabar)]" />
              <span>Создано нейрокомандой <strong>Индивид СтуИИя</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
