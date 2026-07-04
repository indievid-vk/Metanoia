/**
 * Orthodox Church Holidays Reminder Engine
 * Synthesizes a beautiful bell chime, calculates feasts, manages notifications.
 */

export interface ReminderSettings {
  enabled: boolean;
  twelveFeasts: boolean;
  greatFeasts: boolean;
  fasts: boolean;
  soundEnabled: boolean;
  timing: 'today' | 'eve' | 'both';
  lastNotifiedDate: string; // YYYY-MM-DD
}

export interface OrthodoxHoliday {
  name: string;
  type: 'twelve' | 'great' | 'fast';
  description: string;
  isMoving?: boolean;
}

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: true,
  twelveFeasts: true,
  greatFeasts: true,
  fasts: true,
  soundEnabled: true,
  timing: 'today',
  lastNotifiedDate: '',
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
  return new Date(julianDate.getTime() + 13 * 24 * 60 * 60 * 1000);
};

/**
 * Play a synthesized, rich, multi-harmonic church bell chime using Web Audio API.
 */
export function playBellChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Church bell harmonics frequencies
    // Real bronze bells have sub-tones (hum), octave, and multiple metallic partials
    const frequencies = [120, 240, 360, 480, 600, 720, 840, 960];
    const gains = [0.9, 1.0, 0.7, 0.5, 0.35, 0.2, 0.1, 0.05];
    const decays = [4.5, 3.5, 2.5, 2.0, 1.5, 1.2, 0.9, 0.6];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
    masterGain.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      // Introduce minor organic detuning for a rich acoustic vibe
      const detune = (Math.random() - 0.5) * 1.5;
      osc.frequency.setValueAtTime(freq + detune, now);

      gainNode.gain.setValueAtTime(gains[idx] * 0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(now);
      osc.stop(now + decays[idx]);
    });
  } catch (err) {
    console.warn("Could not play synthesized bell chime", err);
  }
}

/**
 * Calculate all major orthodox holidays for a specific date (Gregorian).
 */
export function getHolidaysForDate(date: Date): OrthodoxHoliday[] {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  const holidays: OrthodoxHoliday[] = [];

  // 1. Calculate Pascha
  const pascha = getJulianPascha(year);
  const paschaTime = pascha.setHours(0, 0, 0, 0);
  const dateTime = new Date(date).setHours(0, 0, 0, 0);

  const diffDays = Math.round((dateTime - paschaTime) / (24 * 60 * 60 * 1000));

  // --- MOVING FEASTS ---
  if (diffDays === 0) {
    holidays.push({
      name: 'Светлое Христово Воскресение (Пасха)',
      type: 'twelve',
      description: 'Главный праздник православного христианства. Праздник победы жизни над смертью и грехом.',
      isMoving: true,
    });
  } else if (diffDays === -7) {
    holidays.push({
      name: 'Вход Господень в Иерусалим (Вербное Воскресенье)',
      type: 'twelve',
      description: 'Господский двунадесятый праздник. Воспоминание торжественного входа Иисуса Христа в Иерусалим перед Его страданиями.',
      isMoving: true,
    });
  } else if (diffDays === 39) {
    holidays.push({
      name: 'Вознесение Господне',
      type: 'twelve',
      description: 'Господский двунадесятый праздник. Совершается на сороковой день по Пасхе в воспоминание вознесения Господа во плоти на небо.',
      isMoving: true,
    });
  } else if (diffDays === 49) {
    holidays.push({
      name: 'День Святой Троицы (Пятидесятница)',
      type: 'twelve',
      description: 'Двунадесятый праздник. Воспоминание сошествия Святого Духа на апостолов, явившего полноту Триединого Бога.',
      isMoving: true,
    });
  }

  // --- FIXED TWELVE FEASTS ---
  // Рождество Пресвятой Богородицы — 21 сентября
  if (month === 9 && day === 21) {
    holidays.push({
      name: 'Рождество Пресвятой Богородицы',
      type: 'twelve',
      description: 'Богородичный двунадесятый праздник. День рождения Девы Марии, Матери Спасителя мира.',
    });
  }
  // Воздвижение Креста Господня — 27 сентября
  if (month === 9 && day === 27) {
    holidays.push({
      name: 'Воздвижение Честного и Животворящего Креста Господня',
      type: 'twelve',
      description: 'Господский двунадесятый праздник в память обретения Креста Господня в Иерусалиме святой царицей Еленой.',
    });
  }
  // Введение во храм Пресвятой Богородицы — 4 декабря
  if (month === 12 && day === 4) {
    holidays.push({
      name: 'Введение во храм Пресвятой Богородицы',
      type: 'twelve',
      description: 'Богородичный двунадесятый праздник. Посвящение трехлетней Марии на служение Богу в Иерусалимском храме.',
    });
  }
  // Рождество Христово — 7 января
  if (month === 1 && day === 7) {
    holidays.push({
      name: 'Рождество Господа Бога и Спаса нашего Иисуса Христа',
      type: 'twelve',
      description: 'Величайший двунадесятый праздник. Пришествие в мир Бога во плоти ради спасения человечества.',
    });
  }
  // Крещение Господне (Богоявление) — 19 января
  if (month === 1 && day === 19) {
    holidays.push({
      name: 'Крещение Господне (Богоявление)',
      type: 'twelve',
      description: 'Двунадесятый праздник. Крещение Иисуса Христа в Иордане Иоанном Предтечей и явление Пресвятой Троицы.',
    });
  }
  // Сретение Господне — 15 февраля
  if (month === 2 && day === 15) {
    holidays.push({
      name: 'Сретение Господне',
      type: 'twelve',
      description: 'Двунадесятый праздник в память встречи Богомладенца Христа в Иерусалимском храме праведным Симеоном и Анной.',
    });
  }
  // Благовещение Пресвятой Богородицы — 7 апреля
  if (month === 4 && day === 7) {
    holidays.push({
      name: 'Благовещение Пресвятой Богородицы',
      type: 'twelve',
      description: 'Богородичный двунадесятый праздник. Архангел Гавриил возвещает Марии благую весть о воплощении Сына Божия.',
    });
  }
  // Преображение Господне — 19 августа
  if (month === 8 && day === 19) {
    holidays.push({
      name: 'Преображение Господне (Яблочный Спас)',
      type: 'twelve',
      description: 'Господский двунадесятый праздник. Христос явил Свою Божественную славу ученикам на горе Фавор.',
    });
  }
  // Успенье Пресвятой Богородицы — 28 августа
  if (month === 8 && day === 28) {
    holidays.push({
      name: 'Успение Пресвятой Владычицы нашей Богородицы',
      type: 'twelve',
      description: 'Богородичный двунадесятый праздник. Мирная кончина Девы Марии и Ее прославленное вознесение на небо.',
    });
  }

  // --- OTHER GREAT FEASTS ---
  // Обрезание Господне — 14 января
  if (month === 1 && day === 14) {
    holidays.push({
      name: 'Обрезание Господне',
      type: 'great',
      description: 'Великий праздник. Воспоминание принятия Христом обрезания по закону Моисееву и наречения Его именем Иисус.',
    });
  }
  // Рождество Иоанна Предтечи — 7 июля
  if (month === 7 && day === 7) {
    holidays.push({
      name: 'Рождество честного славного Пророка и Крестителя Иоанна',
      type: 'great',
      description: 'Великий праздник. Рождение величайшего пророка, предсказавшего пришествие Мессии и крестившего Его.',
    });
  }
  // Петра и Павла — 12 июля
  if (month === 7 && day === 12) {
    holidays.push({
      name: 'Святых первоверховных апостолов Петра и Павла',
      type: 'great',
      description: 'Великий праздник в память мученической кончины основателей новозаветного христианского благовещения в Риме.',
    });
  }
  // Усекновение главы Иоанна Предтечи — 11 сентября
  if (month === 9 && day === 11) {
    holidays.push({
      name: 'Усекновение главы Пророка и Крестителя Господня Иоанна',
      type: 'great',
      description: 'Скорбный великий праздник. День строгого однодневного поста в память мученической кончины Предтечи от царя Ирода.',
    });
  }
  // Покров Пресвятой Богородицы — 14 октября
  if (month === 10 && day === 14) {
    holidays.push({
      name: 'Покров Пресвятой Богородицы',
      type: 'great',
      description: 'Великий праздник в память чудесного явления Богоматери во Влахернском храме и Ее заступничества за людей.',
    });
  }

  // --- FASTING DAYS (Major starts/ends or strict days) ---
  const isGreatLent = diffDays >= -48 && diffDays <= -1;
  const isApostlesLent = diffDays >= 57 && (month === 6 || (month === 7 && day <= 11));
  const isDormitionLent = month === 8 && day >= 14 && day <= 27;
  const isNativityLent = (month === 11 && day >= 28) || month === 12 || (month === 1 && day <= 6);

  // Mark the start of multi-day fasts
  if (diffDays === -48) {
    holidays.push({
      name: 'Начало Великого Поста',
      type: 'fast',
      description: 'Начало самого строгого и важного сорокадневного поста в году перед Пасхой.',
    });
  }
  if (diffDays === 57) {
    holidays.push({
      name: 'Начало Петрова (Апостольского) поста',
      type: 'fast',
      description: 'Начало летнего многодневного поста в честь трудов и подвигов святых апостолов.',
    });
  }
  if (month === 8 && day === 14) {
    holidays.push({
      name: 'Начало Успенского поста',
      type: 'fast',
      description: 'Начало двухнедельного строгого поста перед праздником Успения Пресвятой Богородицы.',
    });
  }
  if (month === 11 && day === 28) {
    holidays.push({
      name: 'Начало Рождественского поста',
      type: 'fast',
      description: 'Начало сорокадневного поста перед Рождеством Христовым.',
    });
  }

  // Single-day strict fasts
  if (month === 1 && day === 18) {
    holidays.push({
      name: 'Крещенский сочельник (Навечерие Богоявления)',
      type: 'fast',
      description: 'Однодневный строгий пост перед праздником Крещения Господня.',
    });
  }
  if (month === 9 && day === 27) {
    holidays.push({
      name: 'Воздвижение Креста Господня (Пост)',
      type: 'fast',
      description: 'Однодневный строгий пост в знак поклонения Кресту Господню и воспоминания страданий Христа.',
    });
  }

  return holidays;
}

/**
 * Get stored settings or default.
 */
export function getReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem('ortho_holiday_reminders_v1');
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error("Failed to parse settings", err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings.
 */
export function saveReminderSettings(settings: ReminderSettings) {
  try {
    localStorage.setItem('ortho_holiday_reminders_v1', JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to save settings", err);
  }
}

/**
 * Checks if there are active reminders for today, triggers Notification, sounds, and returns active reminders.
 */
export function checkDailyReminders(silent = false): OrthodoxHoliday[] {
  const settings = getReminderSettings();
  if (!settings.enabled && !silent) return [];

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const todayHolidays = getHolidaysForDate(today);
  
  // Calculate tomorrow's holidays for "eve" reminders
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowHolidays = getHolidaysForDate(tomorrow);

  const activeReminders: OrthodoxHoliday[] = [];

  // Filter based on user preferences
  const filterHolidays = (list: OrthodoxHoliday[]) => {
    return list.filter(h => {
      if (h.type === 'twelve' && settings.twelveFeasts) return true;
      if (h.type === 'great' && settings.greatFeasts) return true;
      if (h.type === 'fast' && settings.fasts) return true;
      return false;
    });
  };

  const filteredToday = filterHolidays(todayHolidays);
  const filteredTomorrow = filterHolidays(tomorrowHolidays);

  if (settings.timing === 'today' || settings.timing === 'both') {
    activeReminders.push(...filteredToday);
  }
  if (settings.timing === 'eve' || settings.timing === 'both') {
    // Label tomorrow's as "Накануне"
    filteredTomorrow.forEach(h => {
      activeReminders.push({
        ...h,
        name: `Накануне: ${h.name}`,
        description: `Завтра празднуется: ${h.description}`
      });
    });
  }

  // If we should actively trigger alerts and we haven't alerted for today's date yet
  if (!silent && settings.enabled && activeReminders.length > 0 && settings.lastNotifiedDate !== dateStr) {
    // 1. Play sound
    if (settings.soundEnabled) {
      playBellChime();
    }

    // 2. Trigger browser push notifications if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      activeReminders.forEach(reminder => {
        try {
          new Notification(reminder.name, {
            body: reminder.description,
            icon: '/icon.png', // Fallback to icon
          });
        } catch (e) {
          console.warn("Failed to fire Notification", e);
        }
      });
    }

    // Save that we have notified the user today
    settings.lastNotifiedDate = dateStr;
    saveReminderSettings(settings);
  }

  return activeReminders;
}

/**
 * Requests Notification permissions from the browser.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error("Error requesting permission", err);
    return false;
  }
}
