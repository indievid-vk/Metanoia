import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, BookOpen, Info, Image as ImageIcon, Users, ChevronLeft, ChevronRight, Sparkles, Award, Bell, BellOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getReminderSettings, 
  saveReminderSettings, 
  checkDailyReminders, 
  playBellChime, 
  requestNotificationPermission, 
  getHolidaysForDate, 
  OrthodoxHoliday, 
  ReminderSettings 
} from '../utils/reminderEngine';

type AzbykaResponse = {
  saints: {
    id: number;
    title: string;
    name?: string;
    uri?: string;
    type_of_sanctity?: string;
  }[];
  holidays: {
    id: number;
    title: string;
    uri?: string;
  }[];
  texts: { text: string }[];
  ikons: { title: string; clean_title?: string }[];
  fasting: {
    type: string;
    round_week: string;
    fasting: string;
    description: string | null;
    voice: number;
  };
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Storage write failed. Clearing ortho_cal cache and retrying...", e);
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ortho_cal_')) {
          localStorage.removeItem(k);
          i--;
        }
      }
      localStorage.setItem(key, value);
    } catch (err) {
      console.error("Failed to write to localStorage after cleaning", err);
    }
  }
};

const isFishAllowed = (fasting: { fasting: string; description: string | null } | null) => {
  if (!fasting) return false;
  const textToSearch = `${fasting.fasting || ''} ${fasting.description || ''}`.toLowerCase();
  
  // Checking typical Russian terms suggesting fish is allowed in fast
  if (textToSearch.includes('рыб') && 
      !textToSearch.includes('без рыбы') && 
      !textToSearch.includes('рыба исключается') && 
      !textToSearch.includes('запрещена рыба') && 
      !textToSearch.includes('рыба не разрешается') && 
      !textToSearch.includes('весьма строгий пост')) {
    return true;
  }
  return false;
};

const getJulianPascha = (year: number): Date => {
  const a = (19 * (year % 19) + 15) % 30;
  const b = (2 * (year % 4) + 4 * (year % 7) + 6 * a + 6) % 7;
  const f = a + b;
  let month = 3; // March Julian
  let day = 22 + f;
  if (day > 31) {
    month = 4; // April Julian
    day -= 31;
  }
  const julianDate = new Date(Date.UTC(year, month - 1, day));
  // Convert Julian date to Gregorian: Julian March 22 is Gregorian April 4 (add 13 days)
  const gregorianPascha = new Date(julianDate.getTime() + 13 * 24 * 60 * 60 * 1000);
  return gregorianPascha;
};

const getOrthodoxTone = (date: Date): number => {
  const currentYear = date.getFullYear();
  let pascha = getJulianPascha(currentYear);
  if (date.getTime() < pascha.getTime() - 7 * 24 * 60 * 60 * 1000) {
    pascha = getJulianPascha(currentYear - 1);
  }
  const diffDays = Math.floor((date.getTime() - pascha.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return 0; // Holy Week / Special
  if (diffDays < 7) return 1; // Bright Week
  const weekNum = Math.floor(diffDays / 7);
  const tone = ((weekNum - 1) % 8) + 1;
  return tone <= 0 ? tone + 8 : tone;
};

const generateLocalFallbackCalendarData = (date: Date): AzbykaResponse => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dateStr = `${date.getFullYear()}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const pascha = getJulianPascha(date.getFullYear());
  const diffDays = Math.round((date.getTime() - pascha.getTime()) / (24 * 60 * 60 * 1000));

  // Determine fast info
  let fastType = 'no_fast';
  let fastingStr = 'Поста нет (мясоед)';
  let fastDesc: string | null = null;

  // Multi-day fasts
  const isGreatLent = diffDays >= -48 && diffDays <= -1;
  const isApostlesLent = diffDays >= 57 && (m === 6 || (m === 7 && d <= 11));
  const isDormitionLent = m === 8 && d >= 14 && d <= 27;
  const isNativityLent = (m === 11 && d >= 28) || m === 12 || (m === 1 && d <= 6);

  // Fast-free weeks
  const isSvyatki = m === 1 && d >= 7 && d <= 18;
  const isPublicanWeek = diffDays >= -69 && diffDays <= -63;
  const isMaslenitsa = diffDays >= -55 && diffDays <= -49;
  const isBrightWeek = diffDays >= 1 && diffDays <= 6;
  const isTrinityWeek = diffDays >= 50 && diffDays <= 56;
  const isFastFreeWeek = isSvyatki || isPublicanWeek || isBrightWeek || isTrinityWeek;

  if (isGreatLent) {
    fastType = 'fasting';
    fastingStr = 'Великий Пост';
    fastDesc = 'Строгий пост. Воздерживаемся от мясных, молочных продуктов, яиц и рыбы.';
    // Exceptions
    if (diffDays === -7) { // Palm Sunday
      fastingStr = 'Вербное воскресенье (Вход Господень в Иерусалим). Пост ослаблен.';
      fastDesc = 'Разрешается рыба, морепродукты и растительное масло.';
    } else if (diffDays === -8) { // Lazarus Saturday
      fastingStr = 'Лазарева суббота. Пост ослаблен.';
      fastDesc = 'Разрешается икра рыбная, растительное масло, вино.';
    } else if (m === 4 && d === 7) { // Annunciation
      fastingStr = 'Благовещение Пресвятой Богородицы. Пост ослаблен.';
      fastDesc = 'Разрешается рыба, растительное масло.';
    }
  } else if (isApostlesLent) {
    fastType = 'fasting';
    fastingStr = 'Петров пост';
    fastDesc = 'Пост средней строгости. В субботу, воскресенье и праздники разрешена рыба.';
  } else if (isDormitionLent) {
    fastType = 'fasting';
    fastingStr = 'Успенский пост';
    fastDesc = 'Строгий пост. Воздерживаемся от рыбы. Рыба разрешена только в Преображение Господне (19 августа).';
  } else if (isNativityLent) {
    fastType = 'fasting';
    fastingStr = 'Рождественский пост';
    fastDesc = 'Пост средней строгости. До дня свт. Николая (19 декабря) рыба разрешена по субботам, воскресеньям и праздникам.';
  } else if (m === 1 && d === 18) {
    fastType = 'fasting';
    fastingStr = 'Крещенский сочельник (Навечерие Богоявления)';
    fastDesc = 'Строгий однодневный пост перед праздником Крещения Господня.';
  } else if (m === 9 && d === 11) {
    fastType = 'fasting';
    fastingStr = 'Усекновение главы Иоанна Предтечи';
    fastDesc = 'Однодневный пост в память о мученической кончине Крестителя Господня. Разрешается пища с растительным маслом.';
  } else if (m === 9 && d === 27) {
    fastType = 'fasting';
    fastingStr = 'Воздвижение Креста Господня';
    fastDesc = 'Однодневный пост в воспоминание обретения Животворящего Древа Креста. Разрешается пища с растительным маслом.';
  } else if (isFastFreeWeek) {
    fastType = 'no_fast';
    fastingStr = 'Поста нет (Сплошная седмица)';
    fastDesc = 'Пост по средам и пятницам отменяется в связи с праздничной седмицей.';
  } else if (isMaslenitsa) {
    fastType = 'no_fast';
    fastingStr = 'Сырная седмица (Масленица)';
    fastDesc = 'Мясо не вкушается, но во все дни седмицы (включая среду и пятницу) разрешены рыба, яйца и молочные продукты.';
  } else {
    // Regular Wednesday / Friday
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 3 || dayOfWeek === 5) {
      fastType = 'fasting';
      fastingStr = 'Однодневный пост';
      fastDesc = 'Постный день (пост по средам и пятницам в течение всего года).';
    }
  }

  // Construct round_week (Седмица)
  let roundWeek = '';
  const dayNamesShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const dayName = dayNamesShort[date.getDay()];

  if (isGreatLent) {
    const weekNum = Math.floor((diffDays + 48) / 7) + 1;
    if (weekNum === 7) {
      roundWeek = `Страстная седмица. ${dayName}`;
    } else {
      roundWeek = `${weekNum}-я седмица Великого поста. ${dayName}`;
    }
  } else if (diffDays === 0) {
    roundWeek = 'Светлое Христово Воскресение. ПАСХА.';
  } else if (diffDays >= 1 && diffDays <= 48) {
    const weekNum = Math.floor(diffDays / 7) + 1;
    const weekNames = [
      '',
      'Светлая седмица',
      '2-я седмица по Пасхе (Фомина)',
      '3-я седмица по Пасхе (святых жен-мироносиц)',
      '4-я седмица по Пасхе (о расслабленном)',
      '5-я седмица по Пасхе (о самаряныне)',
      '6-я седмица по Пасхе (о слепом)',
      '7-я седмица по Пасхе (святых отцов)'
    ];
    roundWeek = `${weekNames[weekNum] || `${weekNum}-я седмица по Пасхе`}. ${dayName}`;
  } else if (isTrinityWeek) {
    roundWeek = `Седмица 8-я по Пасхе. Троицкая седмица. ${dayName}`;
  } else if (diffDays >= 56) {
    const pWeek = Math.floor((diffDays - 49) / 7) + 1;
    if (pWeek === 1) {
      roundWeek = `Седмица 1-я по Пятидесятнице (Всех святых). ${dayName}`;
    } else {
      roundWeek = `Седмица ${pWeek - 1}-я по Пятидесятнице. ${dayName}`;
    }
  } else if (isSvyatki) {
    roundWeek = `Святки. Сплошная седмица. ${dayName}`;
  } else {
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    roundWeek = `${dayNames[date.getDay()]}`;
  }

  // Find holidays and saints for the day
  const holidaysList: { id: number; title: string; uri?: string }[] = [];
  const saintsList: { id: number; title: string; uri?: string; type_of_sanctity?: string }[] = [];

  // Feasts/saints catalog matching m-d (fixed) or diffDays (movable)
  if (diffDays === 0) {
    holidaysList.push({ id: 20000, title: 'Светлое Христово Воскресение. ПАСХА Христова.', uri: 'https://azbyka.ru/prazdniki/pasha' });
  } else if (diffDays === -7) {
    holidaysList.push({ id: 20001, title: 'Вход Господень в Иерусалим (Вербное воскресенье)', uri: 'https://azbyka.ru/prazdniki/vhod-gospoden-v-ierusalim' });
  } else if (diffDays === 39) {
    holidaysList.push({ id: 20002, title: 'Вознесение Господне', uri: 'https://azbyka.ru/prazdniki/voznesenie-gospodne' });
  } else if (diffDays === 49) {
    holidaysList.push({ id: 20003, title: 'День Святой Троицы. Пятидесятница.', uri: 'https://azbyka.ru/prazdniki/troica' });
  }

  // Fixed feasts
  const fixedFeastsMap: Record<string, string> = {
    '1-7': 'Рождество Господа нашего Иисуса Христа (Рождество Христово)',
    '1-14': 'Обрезание Господне, Свт. Василия Великого, архиеп. Кесарии Каппадокийской',
    '1-19': 'Святое Богоявление. Крещение Господне',
    '2-15': 'Сретение Господне',
    '4-7': 'Благовещение Пресвятой Богородицы',
    '7-7': 'Рождество честного славного Пророка, Предтечи и Крестителя Господня Иоанна',
    '7-12': 'Святых первоверховных апостолов Петра и Павла',
    '8-19': 'Преображение Господне',
    '8-28': 'Успенье Пресвятой Владычицы нашей Богородицы',
    '9-11': 'Усекновение главы Пророка, Предтечи и Крестителя Господня Иоанна',
    '9-21': 'Рождество Пресвятой Владычицы нашей Богородицы',
    '9-27': 'Всемирное Воздвижение Честного и Животворящего Креста Господня',
    '10-14': 'Покров Пресвятой Владычицы нашей Богородицы',
    '12-4': 'Введение во храм Пресвятой Владычицы нашей Богородицы',
    '12-19': 'Иже во святых отца нашего Николая, архиепископа Мир Ликийских, чудотворца',
  };

  const key = `${m}-${d}`;
  if (fixedFeastsMap[key]) {
    holidaysList.push({ id: 10000, title: fixedFeastsMap[key], uri: 'https://azbyka.ru/days/' });
  }

  // High quality saints list per day
  const prominentSaints: Record<string, string[]> = {
    '1-1': ['Мч. Бонифатия Тарсийского', 'Прп. Илии Муромца, Печерского'],
    '1-2': ['Священномученика Игнатия Богоносца', 'Праведного Иоанна Кронштадтского'],
    '1-3': ['Святителя Петра, митрополита Московского', 'Мц. Иулиании девы'],
    '1-7': ['Рождество Христово (праздник)'],
    '1-8': ['Собор Пресвятой Богородицы', 'Сщмч. Евфимия, епископа Сардийского'],
    '1-14': ['Святителя Василия Великого, архиепископа Кесарии', 'Прп. Петра Афонского'],
    '1-15': ['Преподобного Серафима Саровского чудотворца (преставление, второе обретение мощей)'],
    '1-19': ['Крещение Господне. Богоявление (праздник)'],
    '1-25': ['Святой мученицы Татианы Римской', 'Святителя Саввы I, архиепископа Сербского'],
    '1-27': ['Равноапостольной Нины, просветительницы Грузии'],
    '2-1': ['Преподобного Макария Великого, Египетского', 'Свт. Марка, архиепископа Ефесского'],
    '2-6': ['Святой блаженной Ксении Петербургской', 'Святителя Григория Богослова, архиепископа Константинопольского'],
    '2-7': ['Святителя Григория Богослова', 'Сщмч. Владимира, митрополита Киевского'],
    '2-15': ['Сретение Господне (праздник)'],
    '3-2': ['Святителя Ермогена, патриарха Московского и всея Руси', 'Вмч. Феодора Тирона'],
    '3-17': ['Благоверного князя Даниила Московского', 'Прп. Герасима Иорданского'],
    '4-7': ['Благовещение Пресвятой Богородицы (праздник)'],
    '5-6': ['Святого великомученика Георгия Победоносеца', 'Мц. царицы Александры'],
    '5-8': ['Апостола и евангелиста Марка'],
    '5-15': ['Святителя Афанасия Великого', 'Благоверных князей Бориса и Глеба'],
    '5-21': ['Апостола и евангелиста Иоанна Богослова'],
    '5-24': ['Равноапостольных Мефодия и Кирилла, учителей словенских'],
    '6-1': ['Благоверного великого князя Димитрия Донского'],
    '6-3': ['Равноапостольных царя Константина Великого и матери его царицы Елены'],
    '6-14': ['Святого праведного Иоанна Кронштадтского', 'Мч. Иустина Философа'],
    '7-7': ['Иоанна Предтечи, Крестителя Господня (Рождество)'],
    '7-12': ['Святых славных и всехвальных первоверховных апостолов Петра и Павла'],
    '7-14': ['Космы и Дамиана Римских, безсребреников'],
    '7-18': ['Преподобного Сергия Радонежского чудотворца (обретение мощей)'],
    '7-23': ['Прп. Антония Киево-Печерского, начальника всех русских монахов'],
    '7-24': ['Равноапостольной Ольги, великой княгини Российской'],
    '7-28': ['Равноапостольного великого князя Владимира (в крещении Василия)'],
    '8-1': ['Преподобного Серафима Саровского чудотворца (обретение мощей)'],
    '8-2': ['Святого славного пророка Илии Фесвитянина'],
    '8-9': ['Святого великомученика и целителя Пантелеимона'],
    '8-19': ['Преображение Господне (праздник)'],
    '8-28': ['Успенье Пресвятой Богородицы (праздник)'],
    '9-11': ['Усекновение главы Пророка, Предтечи и Крестителя Господня Иоанна'],
    '9-12': ['Благоверного великого князя Александра Невского (перенесение мощей)'],
    '9-14': ['Преподобного Симеона Столпника (начало церковного новолетия)'],
    '9-21': ['Рождество Пресвятой Богородицы (праздник)'],
    '9-27': ['Воздвижение Честного и Животворящего Креста Господня'],
    '10-8': ['Преподобного Сергия, игумена Радонежского, всея России чудотворца'],
    '10-14': ['Покров Пресвятой Богородицы (праздник)', 'Прп. Романа Сладкопевца'],
    '11-21': ['Собор Архистратига Михаила и прочих Небесных Сил бесплотных'],
    '11-26': ['Святителя Иоанна Златоустого, патриарха Константинопольского'],
    '12-4': ['Введение во храм Пресвятой Богородицы (праздник)'],
    '12-13': ['Святого апостола Андрея Первозванного'],
    '12-17': ['Святой великомученицы Варвары', 'Прп. Иоанна Дамаскина'],
    '12-19': ['Святителя Николая, архиепископа Мир Ликийских, чудотворца'],
    '12-25': ['Святителя Спиридона Тримифунтского, чудотворца'],
  };

  const saintsForToday = prominentSaints[key] || ['Память святых угодников Божиих', 'Святителя Николая Чудотворца', 'Святых апостолов и мучеников Христовых'];
  saintsForToday.forEach((sName, i) => {
    saintsList.push({
      id: 30000 + i,
      title: sName,
      uri: 'https://azbyka.ru/days/'
    });
  });

  const textsList: { text: string }[] = [];
  // Fallback readings texts depending on the day of week or major feast
  if (diffDays === 0) {
    textsList.push({ text: 'И Пасхальные чтения: <b>Деян. 1:1–8</b> (зач. 1), <b>Ин. 1:1–17</b> (зач. 1).' });
  } else if (fixedFeastsMap[key]) {
    textsList.push({ text: `Богослужебные чтения праздника: <b>Флп. 2:5–11</b>, <b>Лк. 10:38–42; 11:27–28</b>.` });
  } else {
    // Basic day of week reading recommendations
    const dow = date.getDay();
    const cycleReadings = [
      '<b>Мф. 6:22–33</b> (Евангелие дня), <b>Рим. 6:18–23</b> (Апостол дня)', // Sun
      '<b>Ин. 1:18–28</b>, <b>Деян. 1:12–17, 21–26</b>', // Mon
      '<b>Ин. 1:35–51</b>, <b>Деян. 2:14–21</b>', // Tue
      '<b>Ин. 2:1–11</b>, <b>Деян. 2:22–36</b>', // Wed
      '<b>Ин. 3:1–15</b>, <b>Деян. 2:38–43</b>', // Thu
      '<b>Ин. 3:22–36</b>, <b>Деян. 3:1–8</b>', // Fri
      '<b>Ин. 3:16–21</b>, <b>Деян. 3:11–16</b>', // Sat
    ];
    textsList.push({
      text: `Рекомендуемые уставные чтения дня: ${cycleReadings[dow]}.`
    });
  }

  return {
    saints: saintsList,
    holidays: holidaysList,
    texts: textsList,
    ikons: [
      { title: 'Икона Божией Матери "Владимирская"', clean_title: 'Владимирская' },
      { title: 'Икона Спаса Вседержителя', clean_title: 'Спас Вседержитель' }
    ],
    fasting: {
      type: fastType,
      round_week: roundWeek,
      fasting: fastingStr,
      description: fastDesc,
      voice: getOrthodoxTone(date)
    }
  };
};

const getFallbackBibleReadingsHTML = (date: Date): string => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const key = `${m}-${d}`;
  const pascha = getJulianPascha(date.getFullYear());
  const diffDays = Math.round((date.getTime() - pascha.getTime()) / (24 * 60 * 60 * 1000));
  
  if (diffDays === 0) {
    return `
      <h2>Светлое Христово Воскресение. ПАСХА.</h2>
      <div class="bible_text">
        <p><b>Из Деяний святых апостолов (Деян. 1:1–8):</b></p>
        <p><span class="verse">1</span> Первую книгу написал я к тебе, Феофил, о всем, что Иисус делал и чему учил от начала <span class="verse">2</span> до того дня, в который Он вознесся, дав Святым Духом повеления Апостолам, которых Он избрал...</p>
        <p><b>Из Евангелия от Иоанна (Ин. 1:1–17):</b></p>
        <p><span class="verse">1</span> В начале было Слово, и Слово было у Бога, и Слово было Бог. <span class="verse">2</span> Оно было в начале у Бога. <span class="verse">3</span> Все чрез Него начало быть, и без Него ничто не начало быть, что начало быть...</p>
      </div>
    `;
  }

  // General readings
  const dow = date.getDay();
  const readingsTextMap = [
    // Sun
    `<h2>Воскресное чтение (Евангелие от Матфея 6:22–33)</h2>
     <div class="bible_text">
       <p><span class="verse">22</span> Светильник для тела есть око. Итак, если око твое будет чисто, то всё тело твое будет светло; <span class="verse">23</span> если же око твое будет худо, то всё тело твое будет темно...</p>
       <p><span class="verse">33</span> Ищите же прежде Царства Божия и правды Его, и это всё приложится вам.</p>
     </div>`,
    // Mon
    `<h2>Литургическое чтение (Евангелие от Иоанна 1:18–28)</h2>
     <div class="bible_text">
       <p><span class="verse">18</span> Бога не видел никто никогда; Единородный Сын, сущий в недре Отчем, Он явил...</p>
     </div>`,
    // Tue
    `<h2>Литургическое чтение (Евангелие от Иоанна 1:35–51)</h2>
     <div class="bible_text">
       <p><span class="verse">35</span> На другой день опять стоял Иоанн и двое из учеников его. <span class="verse">36</span> И, увидев идущего Иисуса, сказал: вот Агнец Божий.</p>
     </div>`,
    // Wed
    `<h2>Литургическое чтение (Евангелие от Иоанна 2:1–11)</h2>
     <div class="bible_text">
       <p><span class="verse">1</span> На третий день был брак в Кане Галилейской, и Матерь Иисуса была там. <span class="verse">2</span> Был также зван Иисус и ученики Его на брак...</p>
     </div>`,
    // Thu
    `<h2>Литургическое чтение (Евангелие от Иоанна 3:1–15)</h2>
     <div class="bible_text">
       <p><span class="verse">1</span> Между фарисеями был некто, именем Никодим, один из начальников Иудейских. <span class="verse">2</span> Он пришел к Иисусу ночью...</p>
     </div>`,
    // Fri
    `<h2>Литургическое чтение (Евангелие от Иоанна 3:22–36)</h2>
     <div class="bible_text">
       <p><span class="verse">22</span> После сего пришел Иисус с учениками Своими в землю Иудейскую и там жил с ними и крестил...</p>
     </div>`,
    // Sat
    `<h2>Литургическое чтение (Евангелие от Иоанна 3:16–21)</h2>
     <div class="bible_text">
       <p><span class="verse">16</span> Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.</p>
     </div>`
  ];

  return readingsTextMap[dow];
};

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

const fetchWithProxyFallback = async (originalUrl: string): Promise<string> => {
  let lastError: Error | null = null;
  
  // Try direct fetch first (without proxies). In some environments (e.g., cordova, capacitor, or relaxed CORS), this works perfectly.
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds limit for direct fetch
    const res = await fetch(originalUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 100 && !text.includes('id="root"')) {
        return text;
      }
    }
  } catch (e) {
    console.warn(`Direct fetch to ${originalUrl} failed or was blocked by CORS. Resorting to proxies:`, e);
  }

  for (const getProxyUrl of PROXIES) {
    const proxyUrl = getProxyUrl(originalUrl);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout for proxy calls

      const res = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 100 && !text.includes('Too Many Requests') && !text.includes('Rate limit exceeded')) {
          return text;
        }
      }
    } catch (e) {
      console.warn(`Proxy failed for ${originalUrl} via ${proxyUrl}:`, e);
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError || new Error('Все доступные CORS-прокси вернули ошибку или недоступны.');
};

export default function Calendar() {
  const [data, setData] = useState<AzbykaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Fasting tab selection
  const [fastingTab, setFastingTab] = useState<'multiday' | 'oneday' | 'weeks'>('multiday');
  
  // Orthodox Holidays tab selection
  const [holidayTab, setHolidayTab] = useState<'easter' | 'twelve' | 'great' | 'traditions'>('easter');
  
  // Selected saint or holiday modal state
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    url: string;
  } | null>(null);

  // Bible readings state
  const [bibleContent, setBibleContent] = useState<string | null>(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState<string | null>(null);

  // Reminders States
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [reminderSettings, setReminderSettingsState] = useState<ReminderSettings>(getReminderSettings());
  const [permissionStatus, setPermissionStatus] = useState<string>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [upcomingReminders, setUpcomingReminders] = useState<OrthodoxHoliday[]>([]);

  // Load upcoming week's reminders on mount
  useEffect(() => {
    const today = new Date();
    const list: OrthodoxHoliday[] = [];
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayHolidays = getHolidaysForDate(futureDate);
      const filtered = dayHolidays.filter(h => {
        if (h.type === 'twelve' && reminderSettings.twelveFeasts) return true;
        if (h.type === 'great' && reminderSettings.greatFeasts) return true;
        if (h.type === 'fast' && reminderSettings.fasts) return true;
        return false;
      });

      filtered.forEach(h => {
        if (!list.some(existing => existing.name.includes(h.name))) {
          const dateStr = futureDate.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
          list.push({
            ...h,
            name: `${dateStr}: ${h.name}`
          });
        }
      });
    }
    setUpcomingReminders(list);
  }, [reminderSettings]);

  // Handle setting updates
  const handleToggleSetting = (key: keyof ReminderSettings, value: any) => {
    const updated = { ...reminderSettings, [key]: value };
    setReminderSettingsState(updated);
    saveReminderSettings(updated);
  };

  // Test notification & sound
  const handleTestBell = () => {
    playBellChime();
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Тестовое уведомление: Пасхальное благословение', {
          body: 'Система напоминаний о праздниках работает исправно! Слышен колокольный звон.',
          icon: '/icon.png'
        });
      } catch (e) {
        console.warn("Could not trigger test desktop notification", e);
      }
    }
  };

  // Request browser permissions
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      handleToggleSetting('enabled', true);
    }
  };

  // Run the reminder check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkDailyReminders(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentDate]);

  useEffect(() => {
    const fetchCalendar = async () => {
      setIsOfflineMode(false);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const cacheKeyDay = `ortho_cal_v2_day_${dateStr}`;
      const cacheKeyBible = `ortho_cal_v3_bible_${dateStr}`;

      const cachedDay = localStorage.getItem(cacheKeyDay);
      const cachedBible = localStorage.getItem(cacheKeyBible);

      let isDayLoaded = false;
      let isBibleLoaded = false;

      // 1. Try loading calendar data from cache
      if (cachedDay) {
        try {
          setData(JSON.parse(cachedDay));
          setLoading(false);
          setError(null);
          isDayLoaded = true;
        } catch (e) {
          console.warn("Error parsing cached calendar data:", e);
          localStorage.removeItem(cacheKeyDay);
        }
      }

      // 2. Try loading bible readings content from cache
      if (cachedBible) {
        setBibleContent(cachedBible);
        setBibleLoading(false);
        setBibleError(null);
        isBibleLoaded = true;
      }

      // If both blocks were perfectly restored from the cache, we don't need any network hits!
      if (isDayLoaded && isBibleLoaded) {
        return;
      }

      // Initialize missing states for network fetch
      if (!isDayLoaded) {
        setLoading(true);
        setError(null);
      }
      if (!isBibleLoaded) {
        setBibleLoading(true);
        setBibleError(null);
        setBibleContent(null);
      }

      try {
        let currentDayData = data;

        // Fetch calendar data if not cached
        if (!isDayLoaded) {
          let json: any = null;
          try {
            const res = await fetch(`/api/calendar?date=${dateStr}`);
            if (!res.ok) {
              throw new Error(`Ошибка сервера: ${res.status}`);
            }
            const contentType = res.headers.get("content-type");
            if (contentType && !contentType.includes("application/json")) {
              throw new Error("Ответ сервера не содержит JSON. Возможно, бэкенд отсутствует (статический хостинг).");
            }
            const textResult = await res.text();
            if (textResult.includes("<!DOCTYPE html") || textResult.includes("<html")) {
              throw new Error("Запрос API вернул HTML-страницу. Вероятно, активный Node.js сервер недоступен.");
            }
            json = JSON.parse(textResult);
            if (!json || typeof json !== 'object') {
              throw new Error("Неверный формат ответа.");
            }
          } catch (apiError) {
            console.warn("Failed to fetch calendar from server API, attempting client-side fallback proxy:", apiError);
            try {
              const calendarHtml = await fetchWithProxyFallback(`https://azbyka.ru/days/api/day/${dateStr}.json`);
              json = JSON.parse(calendarHtml);
            } catch (fallbackError) {
              console.error("Both server API and client-side proxies failed to fetch calendar. Activating local liturgical calendar engine:", fallbackError);
              json = generateLocalFallbackCalendarData(currentDate);
              setIsOfflineMode(true);
            }
          }

          setData(json);
          currentDayData = json;
          safeLocalStorageSet(cacheKeyDay, JSON.stringify(json));
          setLoading(false);
        }

        // Fetch bible readings if not cached
        if (!isBibleLoaded) {
          try {
            const isToday = (date: Date) => {
              const today = new Date();
              return date.getDate() === today.getDate() &&
                     date.getMonth() === today.getMonth() &&
                     date.getFullYear() === today.getFullYear();
            };
            const isSelectedToday = isToday(currentDate);

            // Fetch Bible readings with proxy fallback
            let html = '';
            try {
              const res = await fetch(`/api/bible?date=${dateStr}&today=${isSelectedToday ? 'true' : 'false'}`);
              if (!res.ok) {
                throw new Error(`Ошибка сервера: ${res.status}`);
              }
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("text/html")) {
                const text = await res.text();
                if (text.includes('id="root"')) {
                  throw new Error("Запрос API вернул HTML нашей SPA-системы. Вероятно, активный Node.js сервер недоступен.");
                }
                html = text;
              } else {
                html = await res.text();
              }
            } catch (apiError) {
              console.warn("Failed to fetch Bible readings from server API, attempting client-side fallback proxy", apiError);
              try {
                const bibleUrl = `https://azbyka.ru/biblia/days/${dateStr}`;
                html = await fetchWithProxyFallback(bibleUrl);
              } catch (fallbackError) {
                console.warn("Both server API and client-side proxies failed to fetch Bible readings. Engaging local Scripture fallbacks:", fallbackError);
                const localHtml = getFallbackBibleReadingsHTML(currentDate);
                setBibleContent(localHtml);
                setBibleLoading(false);
                setIsOfflineMode(true);
                // Return to skip parsing process and standard state assignment
                return;
              }
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const titleDivs = doc.querySelectorAll('.days__book-title[id^="reading-"]');
            
            if (titleDivs.length > 0) {
              const readingBlocks: string[] = [];
              titleDivs.forEach((titleDiv) => {
                const h2 = titleDiv.querySelector('h2');
                if (!h2) return;
                
                let titleText = '';
                let subtitleText = '';
                
                const h2Clone = h2.cloneNode(true) as HTMLElement;
                const subtitleSpan = h2Clone.querySelector('.h2-subtitle');
                if (subtitleSpan) {
                  subtitleText = subtitleSpan.textContent?.trim() || '';
                  subtitleSpan.remove();
                }
                titleText = h2Clone.textContent?.trim() || '';
                
                const versesHtml: string[] = [];
                let sibling = titleDiv.nextElementSibling;
                while (sibling && !sibling.classList.contains('days__book-title')) {
                  if (sibling.classList.contains('tbl-content') || sibling.querySelector('.verse')) {
                    const russianVerses = sibling.querySelectorAll('.verse[data-lang="r"]');
                    russianVerses.forEach((verseEl) => {
                      // Remove checkmark checkboxes and icons
                      verseEl.querySelectorAll('.checkbox, .icon-check').forEach(el => el.remove());
                      // Expand and inline inner links (like theological lexicon terms) to avoid breaking styles
                      verseEl.querySelectorAll('a').forEach(link => {
                        const span = doc.createElement('span');
                        span.innerHTML = link.innerHTML;
                        link.parentNode?.replaceChild(span, link);
                      });
                      
                      const lineNum = verseEl.getAttribute('data-line') || '';
                      const verseText = verseEl.innerHTML.replace(/\s+/g, ' ').trim();
                      versesHtml.push(`
                        <p class="mb-3 leading-relaxed text-[var(--color-ink)]/90 text-sm sm:text-base">
                          <sup class="text-[var(--color-cinnabar)] font-mono font-bold mr-1.5 text-xs align-super">${lineNum}</sup>
                          <span>${verseText}</span>
                        </p>
                      `);
                    });
                  }
                  sibling = sibling.nextElementSibling;
                }
                
                if (versesHtml.length > 0) {
                  readingBlocks.push(`
                    <div class="bg-[#fdfbf6] p-5 rounded-2xl border border-[var(--color-cinnabar)]/10 shadow-sm mb-6 space-y-3 hover:shadow-md transition-shadow">
                      <div class="border-b border-[var(--color-cinnabar)]/10 pb-2 mb-4">
                        <h4 class="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] leading-tight">
                          ${titleText}
                        </h4>
                        <p class="font-sans text-xs text-[var(--color-ink)]/50 uppercase tracking-wider font-semibold mt-1">
                          ${subtitleText}
                        </p>
                      </div>
                      <div class="space-y-2 font-sans">
                        ${versesHtml.join('')}
                      </div>
                    </div>
                  `);
                }
              });
              
              if (readingBlocks.length > 0) {
                const finalBibleContent = readingBlocks.join('');
                setBibleContent(finalBibleContent);
                safeLocalStorageSet(cacheKeyBible, finalBibleContent);
              } else {
                setBibleError('Тексты чтений на текущий день не найдены в русском Синодальном переводе.');
              }
            } else {
              setBibleError('Не удалось выделить разделы богослужебных чтений на текущий день.');
            }
          } catch (e) {
            console.error('Error fetching bible text:', e);
            setBibleError(e instanceof Error ? e.message : 'Ошибка при разборе текста чтений');
          } finally {
            setBibleLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching calendar day data:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке календаря');
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const oldStyleDate = new Date(currentDate);
  oldStyleDate.setDate(currentDate.getDate() - 13);
  
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const handleOpenItem = (title: string, type: 'holiday' | 'saint', uri?: string) => {
    if (!uri) return;
    const baseUrl = 'https://azbyka.ru/days';
    const fullUrl = type === 'holiday' ? `${baseUrl}/prazdnik-${uri}` : `${baseUrl}/sv-${uri}`;
    setSelectedItem({ title, url: fullUrl });
  };

  return (
    <div className="pb-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-izhitsa text-3xl text-[var(--color-cinnabar)]">Православный календарь</h2>
        <DecorativeDivider className="mb-4" />
        <p className="text-xs text-[var(--color-ink)] opacity-60 mt-1">(по материалам сайта azbyka.ru)</p>
      </div>

      {/* Reminder System Quick Control */}
      <div className="mb-6 bg-amber-50/60 border border-[var(--color-cinnabar)]/15 rounded-2xl p-4 shadow-xs relative overflow-hidden max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${reminderSettings.enabled ? 'bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)]' : 'bg-stone-100 text-stone-400'}`}>
              {reminderSettings.enabled ? <Bell size={22} className="animate-bounce" /> : <BellOff size={22} />}
            </div>
            <div className="text-left">
              <h4 className="font-izhitsa text-base sm:text-lg text-[var(--color-ink)]">Напоминания о праздниках</h4>
              <p className="text-xs text-[var(--color-ink)]/60 font-sans">
                {reminderSettings.enabled ? 'Включены уведомления и звон' : 'Уведомления отключены'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReminderSettings(!showReminderSettings)}
            className="px-4 py-1.5 rounded-xl border border-[var(--color-cinnabar)]/20 text-xs sm:text-sm font-izhitsa text-[var(--color-cinnabar)] bg-white/80 hover:bg-white hover:shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Settings size={15} />
            {showReminderSettings ? 'Свернуть' : 'Настроить'}
          </button>
        </div>

        <AnimatePresence>
          {showReminderSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4 pt-4 border-t border-[var(--color-cinnabar)]/10"
            >
              <div className="space-y-4 font-sans text-xs sm:text-sm text-left">
                {/* Main Switch */}
                <div className="flex items-center justify-between bg-white/50 p-2.5 rounded-xl border border-[var(--color-cinnabar)]/5">
                  <span className="font-semibold text-stone-800">Получать уведомления</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={reminderSettings.enabled} 
                      onChange={(e) => handleToggleSetting('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-cinnabar)]"></div>
                  </label>
                </div>

                {reminderSettings.enabled && (
                  <>
                    {/* Timing Selector */}
                    <div className="space-y-2 bg-white/30 p-3 rounded-xl border border-stone-200/50">
                      <span className="font-semibold text-stone-700 block text-xs uppercase tracking-wider">Когда присылать напоминания:</span>
                      
                      <div className="space-y-2 text-stone-700">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex flex-col text-left">
                            <span>В день праздника</span>
                            <span className="text-[10px] text-stone-500 font-normal">Оповещение непосредственно в день торжества</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.notifyToday} 
                            onChange={(e) => handleToggleSetting('notifyToday', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)] cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex flex-col text-left">
                            <span>Накануне (за 1 день)</span>
                            <span className="text-[10px] text-stone-500 font-normal">Заблаговременное извещение за день до праздника</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.notify1Day} 
                            onChange={(e) => handleToggleSetting('notify1Day', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)] cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex flex-col text-left">
                            <span>За 3 дня до праздника</span>
                            <span className="text-[10px] text-stone-500 font-normal">Полезно для подготовки к великим праздникам</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.notify3Days} 
                            onChange={(e) => handleToggleSetting('notify3Days', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)] cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex flex-col text-left">
                            <span>За неделю (за 7 дней)</span>
                            <span className="text-[10px] text-stone-500 font-normal">Для глубокого планирования постов и поездок</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.notify7Days} 
                            onChange={(e) => handleToggleSetting('notify7Days', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)] cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Sound Option & Test Button */}
                    <div className="bg-white/50 p-2.5 rounded-xl border border-[var(--color-cinnabar)]/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800">Колокольный звон</span>
                          <span className="text-[10px] text-stone-500 font-normal">(при празднике)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleTestBell}
                            title="Проверить звук колокола"
                            className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer"
                          >
                            <Volume2 size={16} />
                          </button>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={reminderSettings.soundEnabled} 
                              onChange={(e) => handleToggleSetting('soundEnabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-cinnabar)]"></div>
                          </label>
                        </div>
                      </div>

                      {reminderSettings.soundEnabled && (
                        <div className="space-y-1.5 mt-2 bg-amber-50/40 p-2 rounded-lg border border-[var(--color-cinnabar)]/5">
                          <span className="font-semibold text-stone-700 block text-[10px] uppercase tracking-wider">Выберите мелодию:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-medium">
                            {[
                              { id: 'blagovest', name: 'Благовест (Торжественный)' },
                              { id: 'prazdnichny', name: 'Праздничный перезвон' },
                              { id: 'trezvon', name: 'Пасхальный трезвон' },
                              { id: 'soft', name: 'Тихий хрустальный' },
                              { id: 'bilo', name: 'Монашеское било' }
                            ].map((soundOpt) => (
                              <button
                                key={soundOpt.id}
                                onClick={() => {
                                  handleToggleSetting('soundType', soundOpt.id);
                                  playBellChime(soundOpt.id as any);
                                }}
                                className={`px-2 py-1.5 rounded-lg text-[10px] text-left transition-all cursor-pointer flex items-center justify-between ${
                                  reminderSettings.soundType === soundOpt.id
                                    ? 'bg-[var(--color-cinnabar)] text-white font-semibold shadow-xs'
                                    : 'bg-white/50 text-stone-700 hover:bg-white border border-stone-200/40'
                                }`}
                              >
                                <span>{soundOpt.name}</span>
                                <Volume2 size={11} className={reminderSettings.soundType === soundOpt.id ? 'opacity-100 animate-pulse' : 'opacity-40'} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Holiday Types Preferences */}
                    <div className="space-y-2 bg-white/30 p-3 rounded-xl border border-stone-200/50">
                      <span className="font-semibold text-stone-700 block text-xs uppercase tracking-wider">Типы событий:</span>
                      
                      <div className="space-y-2 text-stone-700">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Двунадесятые праздники</span>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.twelveFeasts} 
                            onChange={(e) => handleToggleSetting('twelveFeasts', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Великие праздники</span>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.greatFeasts} 
                            onChange={(e) => handleToggleSetting('greatFeasts', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Многодневные и строгие посты</span>
                          <input 
                            type="checkbox" 
                            checked={reminderSettings.fasts} 
                            onChange={(e) => handleToggleSetting('fasts', e.target.checked)}
                            className="rounded border-stone-300 text-[var(--color-cinnabar)] focus:ring-[var(--color-cinnabar)]"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Browser Notification Permission request block */}
                    {permissionStatus !== 'granted' && (
                      <div className="p-3 bg-red-50/50 border border-[var(--color-cinnabar)]/10 rounded-xl text-stone-700 space-y-2 text-left">
                        <p className="text-xs font-semibold text-[var(--color-cinnabar)]">Обратите внимание:</p>
                        <p className="text-[11px] leading-relaxed">
                          Браузер блокирует запрос уведомлений внутри фрейма предварительного просмотра. Для включения уведомлений откройте приложение в <strong>отдельной вкладке</strong> (кнопка сверху справа) и нажмите кнопку ниже снова!
                        </p>
                        <button
                          onClick={handleRequestPermission}
                          className="w-full py-1.5 bg-[var(--color-cinnabar)] hover:bg-[#912525] text-white text-xs font-izhitsa rounded-lg transition-colors cursor-pointer"
                        >
                          Разрешить уведомления в браузере
                        </button>
                      </div>
                    )}

                    {/* Upcoming Week Preview */}
                    {upcomingReminders.length > 0 && (
                      <div className="space-y-1.5 mt-2 text-left">
                        <span className="font-semibold text-stone-700 block text-xs uppercase tracking-wider">Предстоящие на этой неделе:</span>
                        <div className="space-y-1 bg-white/50 p-2.5 rounded-xl border border-stone-200/50 max-h-36 overflow-y-auto">
                          {upcomingReminders.map((r, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 py-1 border-b border-stone-100 last:border-0 text-xs">
                              <span className="text-[var(--color-cinnabar)]">✙</span>
                              <div className="flex-1 text-left">
                                <span className="font-semibold text-stone-800">{r.name}</span>
                                <p className="text-stone-500 text-[10px] sm:text-xs leading-normal mt-0.5">{r.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between gap-2 max-w-xs sm:max-w-sm mx-auto mb-6 bg-white/40 p-1 rounded-full border border-[var(--color-cinnabar)]/10 shadow-sm">
        <button 
          onClick={handlePrevDay}
          className="p-2 rounded-full hover:bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] transition-all active:scale-95"
          title="Предыдущий день"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleToday}
          className="px-4 py-1.5 rounded-full bg-white/80 border border-[var(--color-cinnabar)]/10 text-xs sm:text-sm font-izhitsa text-[var(--color-cinnabar)] hover:bg-white hover:shadow-sm transition-all active:scale-95"
        >
          Сегодня
        </button>
        <button 
          onClick={handleNextDay}
          className="p-2 rounded-full hover:bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] transition-all active:scale-95"
          title="Следующий день"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Date Card */}
      <div className="mb-8 flex flex-col items-center gap-2 font-izhitsa text-lg text-[var(--color-ink)]/90 bg-white/40 p-5 rounded-xl border border-[var(--color-cinnabar)]/10 shadow-sm max-w-xl mx-auto text-center">
        <p className="capitalize font-izhitsa text-2xl text-[var(--color-cinnabar)] tracking-wide">
          {currentDate.toLocaleDateString('ru-RU', { weekday: 'long' })}
        </p>
        <div className="space-y-1.5 text-sm sm:text-base">
          <p>
            <span className="text-[var(--color-ink)]/50 uppercase tracking-widest mr-2 text-xs">Новый стиль:</span>
            <span className="font-sans font-medium">{currentDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
          <p>
            <span className="text-[var(--color-ink)]/50 uppercase tracking-widest mr-2 text-xs">Старый стиль:</span>
            <span className="font-sans font-medium">{oldStyleDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-[var(--color-ink)]/70">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-cinnabar)] mb-3" />
          <span className="font-izhitsa">Получение данных...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center bg-stone-50 border border-[var(--color-cinnabar)]/20 rounded-xl text-[var(--color-ink)] animate-fade-in">
          <p className="font-izhitsa mb-2 text-[var(--color-cinnabar)]">Произошла ошибка при загрузке</p>
          <p className="text-sm font-sans mb-4 opacity-75">{error}</p>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate))}
            className="px-4 py-2 bg-[var(--color-cinnabar)] text-white font-izhitsa rounded-lg hover:bg-red-700 transition-colors"
          >
            Повторить попытку
          </button>
        </div>
      ) : !data ? null : (
        <div className="space-y-8 animate-fade-in">

          {/* Offline Fallback Notice Banner */}
          {isOfflineMode && (
            <div className="bg-amber-50/75 border border-amber-300/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-stone-800 shadow-xs max-w-3xl mx-auto -mt-2 mb-6">
              <div className="flex gap-3">
                <Sparkles className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div className="font-sans text-xs sm:text-sm">
                  <p className="font-semibold text-amber-900 font-izhitsa text-base mb-0.5">Включен автономный богослужебный устав</p>
                  <p className="opacity-80">
                    Не удалось подключиться к серверу Азбука.ру. Были автоматически задействованы локальные расчеты праздников, постов, гласа недели и уставных чтений.
                  </p>
                </div>
              </div>
              <a
                href="https://azbyka.ru/days/"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-izhitsa rounded-lg transition-colors text-xs shadow-xs cursor-pointer"
              >
                Проверить связь ↗
              </a>
            </div>
          )}
          
          {/* Week & Fasting */}
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <Info className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Седмица и Пост</h3>
            </div>
            
            <div className="space-y-4 text-[var(--color-ink)]">
              {data.fasting.round_week && (
                <div className="mb-2">
                  <div 
                    dangerouslySetInnerHTML={{ __html: data.fasting.round_week }} 
                    className="text-lg font-izhitsa leading-relaxed text-[var(--color-cinnabar)]/95 [&_a]:text-[var(--color-cinnabar)] [&_a]:underline hover:[&_a]:text-red-700"
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {data.fasting.voice !== undefined && data.fasting.voice !== null && (
                  <div className="bg-white/40 p-4 rounded-xl border border-[var(--color-ink)]/5 flex items-center justify-between">
                    <div>
                      <span className="text-[var(--color-ink)]/50 text-xs uppercase tracking-widest block mb-1">Глас</span>
                      <span className="font-izhitsa text-3xl text-[var(--color-cinnabar)]">{data.fasting.voice}</span>
                    </div>
                    <span className="text-right text-xs text-[var(--color-ink)]/40 italic font-sans pr-2">песнопения дня</span>
                  </div>
                )}

                <div className="bg-white/40 p-4 rounded-xl border border-[var(--color-ink)]/5 flex flex-col justify-center">
                  <span className="text-[var(--color-ink)]/50 text-xs uppercase tracking-widest block mb-1">Особенности трапезы</span>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {data.fasting.type === 'fasting' ? (
                      <>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                          Постный день
                        </span>
                        {isFishAllowed(data.fasting) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">
                            🐟 Разрешается рыба
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        Поста нет
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-base font-izhitsa text-[var(--color-ink)] leading-tight">
                    {data.fasting.fasting ? (
                      <div className="space-y-1.5">
                        <div dangerouslySetInnerHTML={{ __html: data.fasting.fasting }} className="[&_a]:text-[var(--color-cinnabar)] [&_a]:underline font-izhitsa font-medium text-[var(--color-cinnabar)]" />
                        {data.fasting.type === 'fasting' && isFishAllowed(data.fasting) && !data.fasting.fasting.toLowerCase().includes('рыб') && (
                          <div className="text-amber-800 font-sans text-xs font-medium flex items-center gap-1 mt-1">
                            <span>✦ В этот день разрешается рыба и морепродукты</span>
                          </div>
                        )}
                      </div>
                    ) : data.fasting.type === 'fasting' ? (
                      <div className="space-y-1">
                        <span>Постный день (однодневный пост: среда/пятница)</span>
                        {isFishAllowed(data.fasting) && (
                          <div className="text-amber-800 font-sans text-xs font-medium flex items-center gap-1 mt-0.5">
                            <span>✦ Разрешается рыба</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-[var(--color-ink)]/70">Разрешена любая пища (мясоед)</span>
                    )}
                  </div>
                </div>
              </div>

              {data.fasting.description && (
                <div className="bg-[#fdfcf7] p-4 rounded-xl border border-[var(--color-cinnabar)]/10 italic text-sm text-[var(--color-ink)]/80 leading-relaxed">
                  <p dangerouslySetInnerHTML={{ __html: data.fasting.description }} className="[&_a]:text-[var(--color-cinnabar)] [&_a]:underline font-sans" />
                </div>
              )}
            </div>
          </div>

          {/* Holidays */}
          {data.holidays && data.holidays.length > 0 && (
            <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <CalendarIcon className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Церковные праздники</h3>
              </div>
              <ul className="space-y-3">
                {data.holidays.map((holiday, i) => {
                  const canClick = !!holiday.uri;
                  return (
                    <li key={i} className="border-l-2 border-[var(--color-cinnabar)]/20 pl-4 py-1 leading-tight">
                      {canClick ? (
                        <button
                          onClick={() => handleOpenItem(holiday.title, 'holiday', holiday.uri)}
                          className="font-izhitsa text-[var(--color-cinnabar)] text-lg hover:underline text-left cursor-pointer active:opacity-80 transition-all block focus:outline-none"
                        >
                          {holiday.title}
                        </button>
                      ) : (
                        <span className="font-izhitsa text-[var(--color-ink)] text-lg">{holiday.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Saints */}
          {data.saints && data.saints.length > 0 && (
            <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <Users className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Память святых</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.saints.map((saint, i) => {
                  const canClick = !!saint.uri;
                  return (
                    <button
                      key={i}
                      disabled={!canClick}
                      onClick={() => handleOpenItem(saint.title, 'saint', saint.uri)}
                      className={`px-3 py-1.5 rounded-lg font-izhitsa text-sm border transition-all text-left focus:outline-none ${
                        canClick
                          ? 'bg-white/40 border-[var(--color-cinnabar)]/20 text-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/10 hover:border-[var(--color-cinnabar)]/40 hover:shadow-sm cursor-pointer active:scale-95'
                          : 'bg-stone-100/60 border-stone-200 text-stone-500 cursor-default'
                      }`}
                    >
                      {saint.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Icons */}
          {data.ikons && data.ikons.length > 0 && (
            <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <ImageIcon className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Иконы дня</h3>
              </div>
              <ul className="space-y-2">
                {data.ikons.map((ikon, i) => (
                  <li key={i} className="font-izhitsa text-[var(--color-ink)]/90 italic border-l-2 border-amber-300/60 pl-4 py-1.5 leading-tight">
                    {ikon.title || ikon.clean_title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Readings in a Highly Native design */}
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10 text-[var(--color-ink)]">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <div className="flex items-center gap-3">
                <BookOpen className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Богослужебные чтения дня</h3>
              </div>
              <a 
                href={`https://azbyka.ru/biblia/days/${dateStr}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-cinnabar)] font-izhitsa hover:underline text-xs"
              >
                Читать на Азбука.ру ↗
              </a>
            </div>
            
            {data.texts && data.texts.length > 0 && (
              <ul className="space-y-3 mb-6">
                {data.texts.map((textObj, i) => (
                  <li key={i} className="border-l-2 border-[var(--color-cinnabar)]/20 pl-4 py-1.5 leading-relaxed">
                    <div 
                       className="font-sans text-[var(--color-ink)] text-base [&_a]:text-[var(--color-cinnabar)] [&_a]:underline [&_a]:font-izhitsa hover:[&_a]:text-red-750 [&_a]:transition-colors font-medium prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: textObj.text }}
                    />
                  </li>
                ))}
              </ul>
            )}
            
            {/* Direct Bible Readings Text or Loader */}
            <div className="mt-4 pt-4 border-t border-[var(--color-cinnabar)]/10">
              {bibleLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--color-ink)]/70">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-cinnabar)] mb-3" />
                  <span className="font-izhitsa">Загрузка текстов Писания...</span>
                </div>
              ) : bibleError ? (
                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/50 text-stone-700 text-sm font-sans">
                  <p className="font-semibold mb-1 text-[var(--color-cinnabar)] font-izhitsa">Не удалось загрузить тексты напрямую</p>
                  <p className="opacity-80 mb-3 text-xs">{bibleError}</p>
                  <a 
                    href={`https://azbyka.ru/biblia/days/${dateStr}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--color-cinnabar)] text-white font-izhitsa rounded-lg hover:bg-red-700 transition-colors text-xs"
                  >
                    Читать на Азбука.ру ↗
                  </a>
                </div>
              ) : bibleContent ? (
                <div 
                  className="prose max-w-none text-[var(--color-ink)]/90 font-sans text-base leading-relaxed space-y-4 max-h-[550px] overflow-y-auto pr-2
                    [&_h1]:hidden
                    [&_h2]:font-izhitsa [&_h2]:text-xl [&_h2]:text-[var(--color-cinnabar)] [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-[var(--color-cinnabar)]/10 [&_h2]:pb-2 [&_h2]:font-medium
                    [&_h3]:font-izhitsa [&_h3]:text-lg [&_h3]:text-[var(--color-cinnabar)] [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-medium
                    [&_p]:mb-3 [&_p]:leading-relaxed
                    [&_sup]:text-[var(--color-cinnabar)] [&_sup]:font-mono [&_sup]:font-semibold [&_sup]:mr-1 [&_sup]:text-xs [&_sup]:align-super
                    [&_span.verse]:text-[var(--color-cinnabar)] [&_span.verse]:font-semibold [&_span.verse]:mr-1
                    [&_.bible_text]:bg-white/40 [&_.bible_text]:p-4 [&_.bible_text]:rounded-xl [&_.bible_text]:border [&_.bible_text]:border-stone-100 [&_.bible_text]:mb-4
                    [&_table]:w-full [&_table]:my-4 [&_table]:text-sm [&_td]:p-2 [&_th]:p-2
                    [&_.lexicon]:hidden
                    [&_.lex]:hidden
                    [&_.ch_verses]:mt-2
                  "
                  dangerouslySetInnerHTML={{ __html: bibleContent }}
                />
              ) : (
                <p className="text-sm font-sans text-stone-500 italic">Духовные чтения временно недоступны.</p>
              )}
            </div>
          </div>

          {/* Orthodox Church Holidays section based on Azbyka.ru */}
          <div className="bg-white/60 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <Sparkles className="text-[var(--color-cinnabar)] animate-pulse" size={24} />
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Церковные праздники и традиции</h3>
              <span className="text-[10px] sm:text-xs text-[var(--color-ink)] opacity-55 font-sans ml-auto italic hidden sm:inline">по материалам azbyka.ru</span>
            </div>
            
            <p className="text-xs sm:text-sm text-[var(--color-ink)]/80 leading-relaxed mb-6 font-sans">
              Церковные праздники — это особо выделенные дни богослужебного года, установленные в воспоминание спасительных событий земной жизни Господа Иисуса Христа, Пресвятой Богородицы и памяти великих святых. Главный христианский праздник — <strong>Светлое Христово Воскресение (Пасха)</strong>, за которым следуют 12 великих (двунадесятых) и иные церковные торжества.
            </p>

            {/* Holiday Tabs */}
            <div className="flex border-b border-stone-200 mb-6 gap-2 sm:gap-4 overflow-x-auto pb-1 text-xs sm:text-sm font-izhitsa">
              <button
                onClick={() => setHolidayTab('easter')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all cursor-pointer ${
                  holidayTab === 'easter'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Пасха Христова
              </button>
              <button
                onClick={() => setHolidayTab('twelve')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all cursor-pointer ${
                  holidayTab === 'twelve'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Двунадесятые праздники
              </button>
              <button
                onClick={() => setHolidayTab('great')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all cursor-pointer ${
                  holidayTab === 'great'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Великие праздники
              </button>
              <button
                onClick={() => setHolidayTab('traditions')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all cursor-pointer ${
                  holidayTab === 'traditions'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Традиции и Смысл
              </button>
            </div>

            {/* Holiday Tab Content */}
            <div className="space-y-4">
              {holidayTab === 'easter' && (
                <div className="bg-[#fefcf8] border border-[var(--color-cinnabar)]/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-cinnabar)]/5 rounded-bl-full pointer-events-none flex items-center justify-center">
                    <Award className="text-[var(--color-cinnabar)]/20" size={32} />
                  </div>
                  <div className="border-b border-[var(--color-cinnabar)]/10 pb-2">
                    <span className="text-red-700 bg-red-50 border border-red-100 rounded-full py-0.5 px-3 text-[10px] uppercase font-bold tracking-widest font-sans inline-block mb-1">
                      Праздник Праздников
                    </span>
                    <h4 className="font-izhitsa text-xl sm:text-2xl text-[var(--color-cinnabar)] leading-tight">
                      Светлое Христово Воскресение — Святая Пасха
                    </h4>
                  </div>
                  <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[var(--color-ink)]/90 font-sans">
                    <p>
                      <strong>Пасха</strong> — это величайший христианский праздник, превосходящий все прочие торжества. Он не входит в число двунадесятых праздников, а стоит неизмеримо выше их («Праздников Праздник и Торжество торжеств»). 
                    </p>
                    <p>
                      <strong>Смысл:</strong> В этот день воспоминается победа Господа Иисуса Христа над грехом, смертью и адом. Своим Воскресением Спаситель даровал всему человечеству избавление от вечной погибели, восстановил союз с Богом и открыл врата Царства Небесного: <em>«Христос воскресе из мертвых, смертию смерть поправ, и сущим во гробех живот даровав!»</em>
                    </p>
                    <p>
                      <strong>Датировка:</strong> Праздник является переходящим — вычисляется по сложной формуле (Александрийской пасхалии) и всегда празднуется в первое воскресенье после весеннего полнолуния.
                    </p>
                    <div className="bg-white/70 border border-amber-800/10 p-3 rounded-xl mt-2 text-xs sm:text-sm space-y-1">
                      <strong className="text-[var(--color-cinnabar)] text-xs uppercase block tracking-wider font-semibold">Основные Традиции:</strong>
                      <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
                        <li><strong>Pascha (Пасхальное богослужение)</strong> — совершается ночью с субботы на воскресенье с торжественным Крестным ходом.</li>
                        <li><strong>Приветствие верующих</strong> — возглас радости «Христос Воскресе!», на который отвечают «Воистину Воскресе!» со взаимным троекратным целованием («христосованием»).</li>
                        <li><strong>Праздничный стол</strong> — освящение куличей, творожных пасх и крашеных яиц (символ Гроба Господня и вечной жизни). Разговение после Великого Поста.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {holidayTab === 'twelve' && (
                <div className="space-y-4 font-sans">
                  <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-xl text-xs sm:text-sm text-stone-600">
                    Двунадесятые праздники разделяются на праздники <strong>Господские</strong> (посвященные событиям земной жизни Спасителя) и <strong>Богородичные</strong> (посвященные Пресвятой Богородице). Также они бывают непереходящими (всегда в одну дату) и переходящими (дата зависит от Пасхи).
                  </div>

                  <div className="space-y-3">
                    {/* 1. Рождество Богородицы */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Рождество Пресвятой Богородицы</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Богородичный</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 21 сентября (8 сентября по старому стилю).</p>
                        <p><strong>Суть:</strong> Чудесное рождение Окроковицы Марии от престарелых бесплодных супругов Иоакима и Анны. Начало исполнения пророчеств о пришествии Спасителя мира.</p>
                        <p><strong>Традиция:</strong> Празднуется как день всеобщей надежды и утешения, ослабление скорби.</p>
                      </div>
                    </div>

                    {/* 2. Воздвижение Креста */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Воздвижение Креста Господня</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 27 сентября (14 сентября по старому стилю).</p>
                        <p><strong>Суть:</strong> Воспоминание обретения Животворящего Древа Креста Господня в Иерусалиме в IV веке царицей Еленой у горы Голгофа, и его поднятия («воздвижения») для поклонения верующим.</p>
                        <p><strong>Традиция:</strong> <span className="text-red-700 font-semibold">Строгий однодневный пост</span> (в воспоминание крестных страданий Господа). Вынос Креста духовенством в центр храма для всеобщего целования.</p>
                      </div>
                    </div>

                    {/* 3. Введение во храм */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Введение во храм Пресвятой Богородицы</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Богородичный</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 4 декабря (21 ноября по старому стилю).</p>
                        <p><strong>Суть:</strong> Торжественное посвящение трехлетней Марии Богу. Родители привели Деву в Иерусалимский храм, где Первосвященник по внушению Духа Святого ввел Ее в Святая Святых.</p>
                        <p><strong>Традиция:</strong> Повсеместное начало пения в храмах рождественских ирмосов («Христос раждается, славите!»), поскольку праздник предвосхищает скорое Рождество Христово.</p>
                      </div>
                    </div>

                    {/* 4. Рождество Христово */}
                    <div className="bg-[#fffdf9] border border-[var(--color-cinnabar)]/20 rounded-xl p-4 shadow-3xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] font-semibold">Рождество Господа нашего Иисуса Христа</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-100/80 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 7 января (25 декабря по старому стилю).</p>
                        <p><strong>Суть:</strong> Пришествие в плоти Сына Божия на землю. Рождение Христа в пещере в Вифлееме восстановило связь творения с Творцом.</p>
                        <p><strong>Традиция:</strong> Предваряется 40-дневным постом. Канун праздника — <span className="font-semibold text-amber-800">Сочельник</span> — проводится в строгом посте «до первой звезды». Празднование продолжается Святками (12 праздничных дней до Крещения) со славлением Христа.</p>
                      </div>
                    </div>

                    {/* 5. Крещение Господне */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Крещение Господне (Богоявление)</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 19 января (6 января по старому стилю).</p>
                        <p><strong>Суть:</strong> Принятие Спасителем крещения от Иоанна Предтечи в реке Иордан. Вода освятилась Его телом. Была явлена вся Пресвятая Троица: Отец свидетельствовал гласом, Сын крестился, Дух Святой сошел в виде голубя.</p>
                        <p><strong>Традиция:</strong> Великое водоосвящение в канун (в сочельник) и в сам день праздника. Хранение этой святой воды («великая агиасма») как святыни. Традиция купания в ледяных иорданях.</p>
                      </div>
                    </div>

                    {/* 6. Сретение Господне */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Сретение Господне</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 15 февраля (2 февраля по старому стилю).</p>
                        <p><strong>Суть:</strong> Принесение Младенца Иисуса в храм на 40-й день от рождения, встреча Его («сретение») праведным Симеоном Богоприимцем. Символизирует встречу Ветхого Завета с великим Спасителем Нового Завета.</p>
                        <p><strong>Традиция:</strong> Освящение церковных свечей, символизирующих свет Божественный. Особая благоговейная молитва о вступлении во Храм веры.</p>
                      </div>
                    </div>

                    {/* 7. Благовещение */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Благовещение Пресвятой Богородицы</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Богородичный</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 7 апреля (25 марта по старому стилю).</p>
                        <p><strong>Суть:</strong> Архангел Гавриил принес Деве Марии весть о том, что Ей предстоит непорочно зачать и родить Мессию. Смиренное согласие Марии («Се, Раба Господня») открыло человеку путь к спасению.</p>
                        <p><strong>Традиция:</strong> Великое духовное торжество, на которое обычно ослабляется Великий пост (<span className="text-amber-800 font-semibold">разрешается рыба</span>). Древний обычай выпускать на волю птиц как символ освобождения душ во Христе.</p>
                      </div>
                    </div>

                    {/* 8. Вход Господень в Иерусалим */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Вход Господень в Иерусалим (Вербное воскресенье)</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Переходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> Празднуется ровно за одну неделю до Пасхи, перед Страстной Седмицей.</p>
                        <p><strong>Суть:</strong> Радостное приветствие Христа иудеями, постилавшими пальмовые ветви, за день до предания Его на крестную смерть.</p>
                        <p><strong>Традиция:</strong> В Росии ветви заменяются распускающейся вербой — символом пробуждения новой жизни. Христиане освящают ветви в субботу вечером и стоят с ними на утрени. Разрешается рыба.</p>
                      </div>
                    </div>

                    {/* 9. Вознесение Господне */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Вознесение Господне</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Переходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> Празднуется на 40-й день после Пасхи, всегда в четверг.</p>
                        <p><strong>Суть:</strong> Вознесение Христа во плоти на небо в присутствии апостолов. Спаситель вознес саму обоженную человеческую природу Иисуса Христа и пообещал Свое славное Второе пришествие.</p>
                        <p><strong>Традиция:</strong> Радостное стояние за праздничной трапезой. Спокойствие верующих, ведь Господь открыл путь к небу всем нам.</p>
                      </div>
                    </div>

                    {/* 10. Пятидесятница (Троица) */}
                    <div className="bg-[#fcfdf9] border border-green-200/40 rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-green-700">День Святой Троицы (Пятидесятница)</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Переходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> Воскресенье на 50-й день после Пасхи.</p>
                        <p><strong>Суть:</strong> Сошествие Святого Духа на апостолов в Сионской горнице. Полнота откровения Святой Троицы. День рождения Христовой Церкви как благодатного общества спасения.</p>
                        <p><strong>Традиция:</strong> Храмы и дома обильно украшаются свежими зелеными ветвями березы, травой и благоуханными цветами в знак духовного обновления жизни. Читаются особые коленопреклоненные молитвы.</p>
                      </div>
                    </div>

                    {/* 11. Преображение Господне */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Преображение Господне</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Господский</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 19 августа (6 августа по старому стилю).</p>
                        <p><strong>Суть:</strong> Свидетельство Божественной вечности Христа Его избранным трем ученикам в сиянии нетварного Фаворского Света перед Его добровольными страданиями.</p>
                        <p><strong>Традиция:</strong> Освящение винограда, яблок и прочих садовых плодов нового урожая («Яблочный Спас»).</p>
                      </div>
                    </div>

                    {/* 12. Успенский праздник */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Успение Пресвятой Богородицы</h5>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Богородичный</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Непереходящий</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm space-y-2 text-stone-700">
                        <p><strong>Дата:</strong> 28 августа (15 августа по старому стилю).</p>
                        <p><strong>Суть:</strong> Мирная кончина («успение») Пресвятой Девы Марии, Её восстание из гроба силой Её Божественного Сына и переселение в вечность духом и прославленным телом.</p>
                        <p><strong>Традиция:</strong> Предваряется двухнедельным Успенским постом. Вынос Плащаницы Богородицы в храмах.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {holidayTab === 'great' && (
                <div className="space-y-4 font-sans">
                  <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-xl text-xs sm:text-sm text-stone-600">
                    Недвунадесятые великие праздники — это пять особо торжественных праздников, почитаемых всей полнотой Православной Церкви. Службы этих дней совершаются по чину всенощного бдения.
                  </div>

                  <div className="space-y-3">
                    {/* 1. Обрезание */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Обрезание Господне и память свт. Василия Великого</h5>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">14 января</span>
                      </div>
                      <div className="text-xs sm:text-sm space-y-1.5 text-stone-700">
                        <p><strong>Суть:</strong> Господь принял обрезание на 8-й день после Рождества по закону Моисееву, явив пример великого смирения, и принял имя Иисус (Спаситель). В эту же дату чтится память вселенского учителя Василия Великого.</p>
                      </div>
                    </div>

                    {/* 2. Рождество Иоанна Предтечи */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Рождество честного славного Пророка и Крестителя Иоанна</h5>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">7 июля</span>
                      </div>
                      <div className="text-xs sm:text-sm space-y-1.5 text-stone-700">
                        <p><strong>Суть:</strong> Чудесное рождение Предтечи Христова у престарелых Захарии и Елисаветы. Из рожденных женами святой Иоанн стал величайшим праведником.</p>
                      </div>
                    </div>

                    {/* 3. Петра и Павла */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Святых первоверховных апостолов Петра и Павла</h5>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">12 июля</span>
                      </div>
                      <div className="text-xs sm:text-sm space-y-1.5 text-stone-700">
                        <p><strong>Суть:</strong> Прославление подвигов двух великих апостолов, основателей новозаветного христианского благовестия, мученически скончавшихся в один день в Риме при императоре Нероне.</p>
                        <p><strong>Значение:</strong> Завершает собой Апостольский (Петров) пост.</p>
                      </div>
                    </div>

                    {/* 4. Усекновение главы */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Усекновение главы Пророка и Крестителя Господня Иоанна</h5>
                        <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">11 сентября</span>
                      </div>
                      <div className="text-xs sm:text-sm space-y-1.5 text-stone-700">
                        <p><strong>Суть:</strong> Скорбный день памяти коварного усекновения главы величайшего пророка по прихоти Иродиады и приказу Ирода Антипы во время пира.</p>
                        <p><strong>Традиция:</strong> <span className="text-red-700 font-semibold">Строгий однодневный пост</span> в память скорби и великого воздержания святого Иоанна.</p>
                      </div>
                    </div>

                    {/* 5. Покров */}
                    <div className="bg-white/40 border border-stone-200/50 hover:border-[var(--color-cinnabar)]/20 transition-all rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
                        <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)]">Покров Пресвятой Владычицы нашей Богородицы</h5>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">14 октября</span>
                      </div>
                      <div className="text-xs sm:text-sm space-y-1.5 text-stone-700">
                        <p><strong>Суть:</strong> Чудесное явление Пресвятой Богородицы юродивому Андрею во Влахернском храме в Константинополе во время нашествия врагов. Богородица распростерла Свой сияющий омофор (покров) над всеми молящимися, защитив их.</p>
                        <p><strong>Традиция:</strong> Особо чтимый на Руси осенний праздник. Покровитель семейной жизни.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {holidayTab === 'traditions' && (
                <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                  <div className="bg-[#fefcf8] border border-[var(--color-cinnabar)]/10 p-4 rounded-xl space-y-3">
                    <h5 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] border-b border-stone-100 pb-1">
                      Духовное наполнение христианского праздника
                    </h5>
                    <p>
                      В православной традиции празднование — это не безумное забавление плоти, а обновление духа и благоговейный союз с Господом. Праздничные даты установлены для того, чтобы помочь нам оторваться от земной суеты и устремить ум к Вечности.
                    </p>
                    
                    <div className="space-y-2 mt-2">
                      <p>
                        <strong>1. Участие в Литургии и Таинствах</strong> — это сердце любого церковного праздника. Православный христианин спешит в храм не просто поставить свечу, а исповедаться и причаститься Святых Божественных Таин в день торжества, соединяясь с Воскресшим Христом.
                      </p>
                      <p>
                        <strong>2. Дела милосердия и любви</strong> (<em>«Вера без дел мертва»</em>) — неотъемлемая часть традиций праздника. Принято делиться радостью с бедными, больными, одинокими людьми, помогать нуждающимся и даровать утешение ближним.
                      </p>
                      <p>
                        <strong>3. Отложение тяжелого физического труда</strong> — церковный закон призывает освободить праздничный день от тяжелой житейской работы и бытовой суеты не ради праздности или безделья, а ради того, чтобы уделить время молитве, посещению храма, чтению Священного Писания и духовному общению в семье.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comprehensive Native Fasting Calendar table widget */}
          <div className="bg-white/60 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <Info className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Календарь постов и правила трапезы</h3>
            </div>

            {/* Sub-tabs for detailed native fasting view */}
            <div className="flex border-b border-stone-200 mb-6 gap-2 sm:gap-4 overflow-x-auto pb-1 text-xs sm:text-sm font-izhitsa">
              <button
                onClick={() => setFastingTab('multiday')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all ${
                  fastingTab === 'multiday'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Многодневные посты
              </button>
              <button
                onClick={() => setFastingTab('oneday')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all ${
                  fastingTab === 'oneday'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Однодневные посты
              </button>
              <button
                onClick={() => setFastingTab('weeks')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all ${
                  fastingTab === 'weeks'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Сплошные седмицы
              </button>
            </div>

            {/* Fasting Tables with wider row for Descriptions */}
            <div className="overflow-x-auto">
              {fastingTab === 'multiday' && (
                <table className="min-w-full text-sm text-left text-stone-800 border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 font-izhitsa text-[var(--color-cinnabar)]">
                      <th colSpan={2} className="px-4 py-3 rounded-lg">Пост / Событие и Даты</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {/* Великий пост */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Великий пост</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период в 2026 году: со 2 марта по 18 апреля</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-red-700">Особо строгий пост.</strong> Понедельник–пятница: сухоядение / варёная пища без масла. Суббота и воскресенье: разрешается елей (растительное масло) и вино. Рыба разрешена только в <span className="font-semibold text-amber-800">Благовещение Пресвятой Богородицы</span> (7 апреля) и <span className="font-semibold text-amber-800">Вербное воскресенье</span>. В Лазареву субботу разрешена икра.
                      </td>
                    </tr>
                    {/* Петров пост */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Петров (Апостольский)</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период в 2026 году: с 15 июня по 11 июля</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-amber-800">Менее строгий пост.</strong> Начинается через неделю после Троицы. Рыба разрешается по субботам, воскресеньям, четвергам, вторникам и храмовым праздникам, если они приходятся на эти дни. В среды и пятницы – сухоядение или строгая пища без масла.
                      </td>
                    </tr>
                    {/* Успенский пост */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Успенский пост</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период в 2026 году: с 14 по 27 августа</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-red-700">Строгий пост</strong> (в честь Божией Матери). Строгость трапезы такая же, как в Великий пост: рыба разрешается только в великий праздник <span className="font-semibold text-amber-800">Преображения Господня</span> (19 августа).
                      </td>
                    </tr>
                    {/* Рождественский пост */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Рождественский</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период в 2026 году: с 28 ноября по 6 января</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-orange-850 text-orange-800">Мягкий в начале, строгий в конце.</strong> С 28 ноября до Николая Чудотворца (19 декабря) по субботам, воскресеньям и праздникам разрешается рыба. С 20 декабря до 1 января рыба только в субботу и воскресенье. С 2 по 6 января – максимально строгий пост (рыба запрещена, сочельник – до первой звезды).
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {fastingTab === 'oneday' && (
                <table className="min-w-full text-sm text-left text-stone-800 border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 font-izhitsa text-[var(--color-cinnabar)]">
                      <th colSpan={2} className="px-4 py-3 rounded-lg">Однодневный пост / Событие и Даты</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {/* Каждая среда и пятница */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-stone-800 text-base">Каждая среда и пятница</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период: В течение всего года</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Среда – день предания Господа Иудой. Пятница – день Крестных страданий Спасителя. Пост отменяется только в Сплошные седмицы.
                      </td>
                    </tr>
                    {/* Крещенский сочельник */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Крещенский сочельник</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Дата: 18 января (нов. стиль)</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Навечерие великого праздника Богоявления. Строгий пост, трапеза состоит из сочива (варёной пшеницы с мёдом) после освящения воды.
                      </td>
                    </tr>
                    {/* Усекновение главы */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Усекновение главы Иоанна Предтечи</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Дата: 11 сентября (нов. стиль)</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Пост установлен в воспоминание мученического подвига великого Пророка Иоанна и в знак скорби о безумном пире царя Ирода. 
                      </td>
                    </tr>
                    {/* Воздвижение Креста */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Воздвижение Креста Господня</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Дата: 27 сентября (нов. стиль)</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Пост в память распятия и страданий Спасителя на Голгофе. Разрешается елей (растительное масло), но рыба запрещена.
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {fastingTab === 'weeks' && (
                <table className="min-w-full text-sm text-left text-stone-800 border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 font-izhitsa text-[var(--color-cinnabar)]">
                      <th colSpan={2} className="px-4 py-3 rounded-lg">Сплошная седмица и Период</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {/* Святки */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-green-800 text-base">Святки</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период: с 7 по 17 января</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        От Рождества Христова до Крещенского сочельника. Светлые дни празднования Рождества, когда пост по средам и пятницам полностью упразднён.
                      </td>
                    </tr>
                    {/* Мытаря и фарисея */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-green-800 text-base">Мытаря и фарисея</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период: 2 недели до Великого поста</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Пост упразднён для борьбы с гордыней: дабы христианин не превозносился своим постом подобно евангельскому фарисею.
                      </td>
                    </tr>
                    {/* Сырная */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-green-800 text-base">Сырная (Масленица)</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период: 1 неделя до Великого поста</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Позволяет подготовиться к строгому посту физически и духовно: мясо уже запрещено во всю неделю, но сыр, сливочное масло, молоко, яйца и рыба разрешены во все дни, включая среду и пятницу.
                      </td>
                    </tr>
                    {/* Пасхальная */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-green-800 text-base">Пасхальная (Светлая)</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период: Неделя после Пасхи</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Светлая и всерадостная неделя прославления Христа Воскресшего из мертвых. Любой пост отменён, верующие радуются духовно и телесно.
                      </td>
                    </tr>
                    {/* Троицкая */}
                    <tr className="bg-stone-50/20">
                      <td colSpan={2} className="px-4 pt-3 pb-1">
                        <div className="font-semibold font-izhitsa text-green-800 text-base">Троицкая</div>
                        <div className="text-stone-500 font-sans text-xs sm:text-sm mt-0.5">Период: Неделя после Троицы</div>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Неделя перед началом Петрова поста. Позволяет укрепить силы перед летним подвигом воздержания.
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Educational notes about fasting rigor */}
            <div className="mt-6 border-t border-stone-200/60 pt-4 font-sans text-xs text-stone-500 space-y-2">
              <p className="font-semibold text-stone-700 font-izhitsa text-sm mb-2">💡 Степени воздержания в пище по уставу:</p>
              <p>• <strong className="text-stone-700">Сухоядение:</strong> холодная необработанная растительная пища без масла (фрукты, сухофрукты, орехи, овощи, хлеб, вода).</p>
              <p>• <strong className="text-stone-700">Горячая пища без елея:</strong> варёная растительная пища без добавления растительного масла (супы, каши на воде).</p>
              <p>• <strong className="text-stone-700">Горячая пища с елеем:</strong> разрешаются супы, каши и тушёные овощи с растительным (оливковым/подсолнечным) маслом и натуральное виноградное вино.</p>
              <p>• <strong className="text-stone-700">Разрешение на рыбу:</strong> разрешаются любые рыбные блюда, рыбная икра и морепродукты, горячая пища с растительным маслом и вино.</p>
              <p className="italic text-stone-400 mt-2 font-sans pb-4">Примечание: мера строгости поста устанавливается индивидуально с учётом здоровья, возраста и семейных обстоятельств по благословению духовника.</p>
            </div>

            {/* Comprehensive Fasting Instructions block provided by the user */}
            <div className="mt-6 border-t border-[var(--color-cinnabar)]/20 pt-6 font-sans text-sm text-stone-800 space-y-6">
              <p className="italic text-stone-700 leading-relaxed font-medium">
                В Русской Православной Церкви существует четыре многодневных поста, посты в среду и пятницу в течение всего года (за исключением пяти седмиц, называемых сплошными), три однодневных поста.
              </p>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Великий Пост</h4>
                <p className="leading-relaxed mb-3">
                  Сам Спаситель был поведён Духом в пустыню, сорок дней искушался дьяволом и ничего не ел в эти дни. Великий пост – пост в честь Самого Спасителя, а последняя страстная седмица этого 48-дневного поста установлена в воспоминание о последних днях земной жизни, страданиях и смерти Иисуса Христа.
                </p>
                <p className="leading-relaxed mb-3 font-medium text-[var(--color-cinnabar)]">
                  С особой строгостью соблюдается пост в первую, чётвертую (Крестопоклонную) и страстную седмицы.
                </p>
                <p className="leading-relaxed mb-3">
                  В первые два дня Великого поста, а также в страстную Пятницу Типикон предписывает (монахам) полностью воздерживаться от пищи. В остальное время: среда, пятница – сухоядение (вода, хлеб, фрукты, овощи, компоты); вторник, четверг – горячая пища без масла; суббота, воскресенье – пища с растительным маслом.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  Рыба разрешается в Благовещение Пресвятой Богородицы и в Вербное воскресенье. В Лазареву субботу разрешается рыбная икра. В Страстную пятницу есть традиция не вкушать пищу до выноса плащаницы (обычно эта служба заканчивается в 15-16 часов).
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Апостольский пост</h4>
                <p className="text-stone-600 block mb-1 font-semibold uppercase tracking-wider text-xs">Начало зависит от даты Пасхи</p>
                <p className="leading-relaxed mb-3">
                  Начало Апостольского поста всегда приходится на второй понедельник после Дня Святой Троицы. Заканчивается пост всегда 12 июля – перед праздником апостолов Петра и Павла. Продолжительность поста зависит от даты Пасхи (от 8 до 42 дней.).
                </p>
                <p className="leading-relaxed mb-3">
                  Этот пост установлен в честь Святых апостолов, которые постом и молитвою приготовлялись к всемирной проповеди Евангелия и готовили себе преемников в деле спасительного служения.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  В среду и пятницу горячая пища с маслом. В остальные дни – рыба, грибы, крупы с растительным маслом.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Успенский пост</h4>
                <p className="text-amber-800 block mb-1 font-semibold uppercase tracking-wider text-xs">14 августа – 27 августа</p>
                <p className="leading-relaxed mb-3">
                  Через месяц после Апостольского поста наступает многодневный Успенский пост. Он продолжается две недели – с 14 по 27 августа. Этим постом Церковь призывает нас к подражанию Божьей Матери, которая перед переселением своим на небо непрестанно пребывала в посте и молитве.
                </p>
                <p className="leading-relaxed mb-3">
                  Среда, пятница – сухоядение. Понедельник, вторник, четверг – горячая пища без масла. В субботу и воскресенье разрешается пища с растительным маслом.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  В день праздника Преображения Господня (19 августа) разрешается рыба. Если праздник Успения Пресвятой Богородицы выпадает на среду или пятницу, то устав разрешает рыбу.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Рождественский пост</h4>
                <p className="text-amber-800 block mb-1 font-semibold uppercase tracking-wider text-xs">28 ноября – 6 января</p>
                <p className="leading-relaxed mb-3">
                  В конце осени, за 40 дней до великого праздника Рождества Христова, Церковь призывает нас к зимнему посту. Этот пост установлен для того, чтобы нам достойно подготовиться к благодатному единению с родившимся Спасителем.
                </p>
                <p className="leading-relaxed mb-3">
                  Если праздник Введения во Храм Пресвятой Богородицы (4 декабря) выпадает на среду или пятницу, то уставом разрешается рыба.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  В сочельник не принято вкушать пищу до появления первой звезды, после чего вкушают сочиво – вареные в меду зерна пшеницы или отварной рис с изюмом (символом первой звезды является зажженная свеча, которая выносится в конце Литургии, совершаемой в Навечерие Рождества Христова, и перед которой поётся тропарь и кондак праздника Рождества Христова).
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Сплошные седмицы</h4>
                <p className="leading-relaxed mb-3">
                  Седмица – неделя с понедельника по воскресенье. В эти дни отсутствие поста в среду и пятницу.
                </p>
                <p className="leading-relaxed mb-3 font-semibold text-stone-700">
                  Сплошных седмиц пять:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-stone-700">
                  <li><strong>Святки</strong> – с 7 января до 18 января,</li>
                  <li><strong>Мытаря и фарисея</strong> – завершается за 2 недели до Великого Поста,</li>
                  <li><strong>Сырная (масленица)</strong> – неделя перед Великим Постом (без мяса),</li>
                  <li><strong>Пасхальная (Светлая)</strong> – неделя после Пасхи,</li>
                  <li><strong>Троицкая</strong> – неделя после Троицы.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Среда и пятница</h4>
                <p className="leading-relaxed">
                  Еженедельными постными днями являются среда и пятница (кроме сплошных седмиц). В среду пост установлен в воспоминание предательства Иудой Христа, в пятницу – в память крестных страданий и смерти Спасителя.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Однодневные посты</h4>
                <ul className="list-disc pl-5 space-y-2 mb-3 leading-relaxed text-stone-700">
                  <li><strong>Крещенский сочельник</strong> – 18 января, накануне Крещения Господня.</li>
                  <li><strong>Усекновение главы Иоанна Предтечи</strong> – 11 сентября.</li>
                  <li><strong>Воздвижение Креста Господня</strong> – 27 сентября. Память о страданиях Спасителя на Кресте ради спасения рода человеческого.</li>
                </ul>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  Однодневные посты – дни строгого поста (кроме среды и пятницы). Запрещается рыба, но разрешается пища с растительным маслом.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">О трапезе в праздники</h4>
                <ul className="space-y-3 leading-relaxed text-stone-700">
                  <li className="border-l-2 border-stone-300 pl-3">
                    По церковному Уставу, в праздники Рождества Христова и Богоявления, случившиеся в среду и пятницу, поста нет.
                  </li>
                  <li className="border-l-2 border-stone-300 pl-3">
                    В Рождественский и Крещенский сочельники и в праздники Воздвижения Креста Господня и Усекновения главы Иоанна Предтечи разрешается пища с растительным маслом.
                  </li>
                  <li className="border-l-2 border-[var(--color-cinnabar)]/40 pl-3">
                    В праздники Сретения, Преображения Господня, Успения, Рождества и Покрова Пресвятой Богородицы, Введения Ее во Храм, Рождества Иоанна Предтечи, апостолов Петра и Павла, Иоанна Богослова, случившиеся в среду и пятницу, а также в период от Пасхи до Троицы в среду и пятницу <strong className="text-amber-850 text-amber-900 font-semibold">разрешается рыба</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Item Modal (Native Pop-up Drawer for Azbyka content) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-50 border border-[var(--color-cinnabar)]/20 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-[var(--color-cinnabar)]/10">
              <h4 className="font-izhitsa text-lg text-[var(--color-cinnabar)] truncate pr-4">
                {selectedItem.title}
              </h4>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-500 hover:text-[var(--color-cinnabar)] transition-colors p-1"
                aria-label="Закрыть"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Context Loading and Iframe Container */}
            <div className="flex-1 bg-white relative flex flex-col">
              {/* Educational message and direct website links */}
              <div className="bg-amber-50 text-amber-950 px-4 py-2.5 text-xs border-b border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Информация транслируется с официального источника azbyka.ru. В случае ограничений в браузере, откройте в новой вкладке:</span>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--color-cinnabar)] text-white px-3 py-1 rounded-md text-center hover:bg-red-700 transition-colors font-medium shrink-0 text-xs font-izhitsa"
                >
                  Открыть сайт Азбука.ру
                </a>
              </div>
              
              <iframe
                src={selectedItem.url}
                className="w-full h-full border-0 flex-1"
                title={selectedItem.title}
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
