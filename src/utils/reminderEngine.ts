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
  soundType: 'blagovest' | 'prazdnichny' | 'trezvon' | 'soft' | 'bilo';
  notifyToday: boolean;
  notify1Day: boolean;
  notify3Days: boolean;
  notify7Days: boolean;
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
  soundType: 'blagovest',
  notifyToday: true,
  notify1Day: true,
  notify3Days: false,
  notify7Days: false,
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
 * Supports different beautiful, authentic sounding presets chosen by the user.
 */
export function playBellChime(customType?: 'blagovest' | 'prazdnichny' | 'trezvon' | 'soft' | 'bilo') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const settings = getReminderSettings();
    const type = customType || settings.soundType || 'blagovest';

    const startAudio = () => {
      const now = ctx.currentTime;

      const playSingleBell = (baseFreq: number, volume: number, startTime: number, duration: number) => {
        const frequencies = [baseFreq, baseFreq * 2, baseFreq * 3, baseFreq * 4.2, baseFreq * 5.4, baseFreq * 6.8];
        const gains = [1.0, 0.8, 0.6, 0.4, 0.2, 0.1];
        const decays = [duration, duration * 0.8, duration * 0.6, duration * 0.4, duration * 0.3, duration * 0.2];

        const bellGain = ctx.createGain();
        bellGain.gain.setValueAtTime(volume * 0.3, startTime);
        bellGain.gain.linearRampToValueAtTime(volume * 0.01, startTime + duration - 0.2);
        bellGain.gain.linearRampToValueAtTime(0, startTime + duration);
        bellGain.connect(ctx.destination);

        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const partialGain = ctx.createGain();

          osc.type = 'sine';
          const detune = (Math.random() - 0.5) * 2;
          osc.frequency.setValueAtTime(freq + detune, startTime);

          partialGain.gain.setValueAtTime(gains[idx], startTime);
          partialGain.gain.linearRampToValueAtTime(0, startTime + decays[idx]);

          osc.connect(partialGain);
          partialGain.connect(bellGain);

          osc.start(startTime);
          osc.stop(startTime + decays[idx]);
        });
      };

      if (type === 'blagovest') {
        // 1. Благовест (Blagovest) - Slow, solemn, deep bells
        playSingleBell(98, 1.0, now, 6.0);
        playSingleBell(98, 0.7, now + 2.5, 4.5);
      } 
      else if (type === 'prazdnichny') {
        // 2. Праздничный перезвон (Festive) - Rhythmic alternation of medium and high-pitched bells
        playSingleBell(130, 0.8, now, 4.0);
        playSingleBell(260, 0.5, now + 0.4, 2.0);
        playSingleBell(390, 0.4, now + 0.8, 1.5);
        
        playSingleBell(130, 0.8, now + 1.2, 4.0);
        playSingleBell(260, 0.5, now + 1.6, 2.0);
        playSingleBell(390, 0.4, now + 2.0, 1.5);

        playSingleBell(98, 0.9, now + 2.5, 5.0);
      }
      else if (type === 'trezvon') {
        // 3. Пасхальный трезвон (Trezvon) - Cascading, rapid joyful peal
        const notes = [440, 554, 659, 880];
        for (let i = 0; i < 12; i++) {
          const time = now + i * 0.25;
          const note = notes[i % notes.length];
          playSingleBell(note / 2, 0.4, time, 1.5);
        }
        playSingleBell(110, 0.9, now + 3.0, 5.0);
      }
      else if (type === 'soft') {
        // 4. Тихий хрустальный перезвон (Soft) - Peaceful, soothing meditative high-pitch chime
        playSingleBell(523.25, 0.6, now, 3.5);
        playSingleBell(659.25, 0.5, now + 0.8, 3.0);
        playSingleBell(783.99, 0.5, now + 1.6, 2.5);
        playSingleBell(1046.5, 0.4, now + 2.4, 2.0);
      }
      else if (type === 'bilo') {
        // 5. Монашеское било (Bilo) - Rhythmic, dry resonant wooden semantron with metallic overtones
        const playBiloStroke = (time: number, vol: number) => {
          // High fundamental, low harmonics, short duration, square-ish/triangle oscillator blend
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(180, time);
          
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(320, time);

          gainNode.gain.setValueAtTime(vol * 0.4, time);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start(time);
          osc1.stop(time + 0.4);
          osc2.start(time);
          osc2.stop(time + 0.4);
        };

        // Play accelerando rhythm
        let accumTime = now;
        let delay = 0.4;
        for (let i = 0; i < 10; i++) {
          playBiloStroke(accumTime, 0.8);
          accumTime += delay;
          delay *= 0.82; // speed up
        }
      }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        startAudio();
      }).catch(err => {
        console.warn("Could not resume AudioContext, playing immediately anyway as fallback", err);
        startAudio();
      });
    } else {
      startAudio();
    }
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
      const parsed = JSON.parse(raw);
      // Migration from old timing field if present
      if ('timing' in parsed) {
        const oldTiming = parsed.timing;
        parsed.notifyToday = oldTiming === 'today' || oldTiming === 'both';
        parsed.notify1Day = oldTiming === 'eve' || oldTiming === 'both';
        parsed.notify3Days = false;
        parsed.notify7Days = false;
        delete parsed.timing;
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
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

  const addRemindersWithOffset = (offsetDays: number, prefix: string) => {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + offsetDays);
    const found = getHolidaysForDate(checkDate);
    const filtered = filterHolidays(found);
    
    filtered.forEach(h => {
      if (offsetDays === 0) {
        activeReminders.push(h);
      } else {
        let label = '';
        if (offsetDays === 1) label = 'Завтра празднуется';
        else if (offsetDays === 3) label = 'Через 3 дня празднуется';
        else if (offsetDays === 7) label = 'Через неделю празднуется';
        
        activeReminders.push({
          ...h,
          name: `${prefix}: ${h.name}`,
          description: `${label}: ${h.description}`
        });
      }
    });
  };

  if (settings.notifyToday) {
    addRemindersWithOffset(0, '');
  }
  if (settings.notify1Day) {
    addRemindersWithOffset(1, 'Накануне (за 1 день)');
  }
  if (settings.notify3Days) {
    addRemindersWithOffset(3, 'За 3 дня');
  }
  if (settings.notify7Days) {
    addRemindersWithOffset(7, 'За неделю');
  }

  // If we should actively trigger alerts and we haven't alerted for today's date yet
  if (!silent && settings.enabled && activeReminders.length > 0 && settings.lastNotifiedDate !== dateStr) {
    // 1. Play sound
    if (settings.soundEnabled) {
      playBellChime();
    }

    // 2. Trigger browser push notifications if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      activeReminders.forEach(async (reminder) => {
        let sentViaServiceWorker = false;
        try {
          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready;
            if (reg && 'showNotification' in reg) {
              await reg.showNotification(reminder.name, {
                body: reminder.description,
                icon: '/icon_192.png',
                badge: '/icon_192.png',
                vibrate: [200, 100, 200],
                data: { url: './#/calendar' }
              } as any);
              sentViaServiceWorker = true;
              console.log("Fired system notification via ServiceWorker:", reminder.name);
            }
          }
        } catch (swErr) {
          console.warn("Failed to send notification via service worker, falling back to legacy Notification", swErr);
        }

        if (!sentViaServiceWorker) {
          try {
            new Notification(reminder.name, {
              body: reminder.description,
              icon: '/icon_192.png',
            });
            console.log("Fired legacy system notification:", reminder.name);
          } catch (e) {
            console.warn("Failed to fire legacy Notification", e);
          }
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

  // Safe iframe check
  try {
    if (window.self !== window.top) {
      console.warn("Notification request blocked: running inside an iframe");
      return false;
    }
  } catch (e) {
    // If we get a security error trying to access window.top, we are definitely in a cross-origin iframe
    console.warn("Notification request blocked due to iframe security constraints:", e);
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    // Fallback to callback-based request (e.g. older Safari or mobile environments)
    return new Promise((resolve) => {
      try {
        Notification.requestPermission((permission) => {
          resolve(permission === 'granted');
        });
      } catch (callbackErr) {
        console.error("Error requesting permission via callback", callbackErr);
        resolve(false);
      }
    });
  }
}
