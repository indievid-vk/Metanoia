# Универсальное руководство и База Знаний PWA-разработки «Индивид СтудИИя»

Этот документ представляет собой полновесный стандарт и готовое руководство по реализации автономных, надёжных и отказоустойчивых **Progressive Web Applications (PWA)** с подходом **Offline-First**. 

Файл предназначен для интеграции в системные промпты, контекст AI-агентов и передачи между проектами команды «Индивид СтудИИя».

---

## 1. Командная архитектура «Индивид СтудИИя»

Для обеспечения высокого качества кода, дизайна и UX используется ролевая модель из 5 виртуальных специалистов:
1. **[AI Product Owner & BA]**: Интервьюирует пользователя, формирует User Stories, контролирует целостность ТЗ и соблюдение протокола безопасности.
2. **[AI Product Designer]**: Проектирует UX/CJM, создает дизайн-систему, адаптивные интерфейсы и микро-анимации.
3. **[AI Lead Developer]**: Пишет чистый, документированный TypeScript/React код, организует архитектуру и PWA-механики.
4. **[AI QA Engineer]**: Проверяет логику, эмулирует поведение на iOS/Android, тестирует оффлайн-режимы и граничные случаи.
5. **[AI DevOps]**: Отвечает за сборку, работу Service Worker, конфигурацию Workbox, CI/CD и деплой на GitHub Pages/Cloud Run.

---

## 2. ЭТАЛОННАЯ АРХИТЕКТУРА PWA (Universal PWA Implementation Guide)

### 2.1. Механика 1: Установка приложения (Android & iOS)

#### 2.1.1. Глобальный перехват `beforeinstallprompt` (до загрузки React)
Для того чтобы событие возможности установки приложения не было упущено во время гидратации или загрузки JS-бандла, перехватчик устанавливается в `index.html`:

```html
<!-- index.html -->
<script>
  window.deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
  });
  
  window.addEventListener('appinstalled', () => {
    window.deferredPrompt = null;
    localStorage.setItem('pwaPromptedForever_v1', 'true');
  });
</script>
```

#### 2.1.2. Андроид: Автоматический вывод системного окна установки
При открытии приложения по ссылке в браузере Android, если системный эвент `beforeinstallprompt` доступен, автоматически появляется адаптивное модальное окно с кнопкой «Установить». При клике вызывается системный диалог установки Андроид:

```tsx
// Функция вызова системного промпта установки
const handleInstallClick = async () => {
  const promptEvent = deferredPrompt || (window as any).deferredPrompt;
  if (!promptEvent) return;
  
  try {
    setIsInstalling(true);
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Приложение успешно установлено');
      setShow(false);
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
      localStorage.setItem('pwaPromptedForever_v1', 'true');
    }
  } catch (err) {
    console.error('Install prompt error:', err);
  } finally {
    setIsInstalling(false);
  }
};
```

#### 2.1.3. iOS: Плавающая кнопка (FAB) и пошаговая инструкция
Поскольку iOS Safari не поддерживает стандартный JavaScript API `beforeinstallprompt`, для устройств Apple реализуется:
1. **Плавающая кнопка установки (FAB)**: Отображается в нижнем углу экрана со специальным импульсным индикатором.
2. **Инструкция для iOS**: При нажатии открывается аккуратный Bottom Sheet с наглядной пошаговой иллюстрацией:
   - Шаг 1: Нажмите кнопку **«Поделиться»** или **«Меню»** в браузере Safari/Chrome.
   - Шаг 2: Выберите пункт **«На экран "Домой"»** (Add to Home Screen).

#### 2.1.4. Системные приоритеты и координация окон
Чтобы окна установки и обновлений не перекрывали друг друга, используется координация через глобальные флаги:
- `window.pwaPopupActive`: Флаг блокировки, исключающий одновременный показ нескольких модалок.
- `pwa-popup-closed`: Кастомное событие, уведомляющее систему о закрытии текущего окна для возможности вывода следующего промпта.
- **Иерархия приоритетов**:
  1. Окно критического обновления приложения (`UpdatePopup`).
  2. Приветственное окно первого запуска (`WelcomePopup`).
  3. Промпт установки PWA (`InstallPrompt`).

---

### 2.2. Механика 2: Приветственное окно при первом запуске установленного PWA

#### 2.2.1. Надежное определение Standalone-режима
Приложение определяет, что оно запущено как установленный наутивный PWA-клиент, а не в вкладке браузера:

```typescript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
  || (window.navigator as any).standalone 
  || document.referrer.includes('android-app://')
  || window.location.search.includes('mode=standalone');
```

#### 2.2.2. Однократный вывод приветственного модала с салютом
При первом открытии приложения в режиме Standalone запускается праздничный салют из конфетти (`canvas-confetti`) и отображается всплывающее окно:

```tsx
if (isStandalone) {
  const welcomeShown = localStorage.getItem('hasSeenWelcome') || localStorage.getItem('installed_welcome_shown');
  if (!welcomeShown) {
    setShowWelcomeInstalled(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }
}

// При нажатии на «Начать»:
const handleStart = () => {
  localStorage.setItem('hasSeenWelcome', 'true');
  localStorage.setItem('installed_welcome_shown', 'true');
  setShowWelcomeInstalled(false);
};
```

---

### 2.3. Механика 3: Информационное окно «Приложение обновлено» (Без конфликта с оффлайном)

#### 2.3.1. Защита от повреждения оффлайн-кэша (`registerType: 'prompt'`)
**Главное правило**: Никогда не использовать `registerType: 'autoUpdate'` и `skipWaiting: true` в приложениях с тяжелым оффлайн-функционалом. Бесшумное фоновое обновление Service Worker при нестабильной сети ломает локальный кэш и приводит к вылету приложения с ошибкой `ERR_FAILED`.

В `vite.config.ts`:
```typescript
VitePWA({
  registerType: 'prompt',
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: false,
    clientsClaim: true,
    // ...
  }
})
```

#### 2.3.2. Полная изоляция от отсутствия интернета (Strict Online Guards)
Все проверки обновлений и запросы к серверу оборачиваются строгой проверкой сетевого подключения `navigator.onLine`. Если интернет отсутствует, приложение **никогда не пытается запрашивать новые версии или показывать баннеры ошибок**:

```typescript
const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

// Пример защищенного поллинга версии
useEffect(() => {
  const checkVersion = async () => {
    if (!isOnline()) return; // Пропуск проверки при оффлайне
    try {
      const res = await fetch(`./version.json?cache-bust=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.version !== CURRENT_VERSION && isOnline()) {
          setType('new-version');
          setShow(true);
        }
      }
    } catch (err) {
      // Молчаливый отлов ошибок сети
    }
  };

  if (isOnline()) checkVersion();
  const interval = setInterval(checkVersion, 15 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

#### 2.3.3. Пользовательское подтверждение и безопасная перезагрузка
При обнаружении новой версии Service Worker или изменении номера релиза выводится окно с информацией «Приложение обновилось! Пользоваться стало еще удобнее».
При нажатии на кнопку «Начать» выполняется контролируемая активация нового Service Worker и обновлении страницы:

```typescript
const handleUpdate = () => {
  localStorage.setItem('appVersion', CURRENT_VERSION);
  if (needUpdate && typeof updateServiceWorker === 'function') {
    updateServiceWorker(true);
  } else {
    window.location.reload();
  }
  setShow(false);
};
```

---

### 2.4. Механика 4: Гарантированное оффлайн-открытие и работа PWA (Offline-First Architecture)

#### 2.4.1. Полное прекэширование ресурсов (Precaching & High Quota)
В `vite.config.ts` настраивается расширенное кэширование статических файлов и увеличение допустимого размера бандла до 15МБ:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'PWA Application',
        short_name: 'PWA App',
        description: 'Offline-first PWA Application',
        theme_color: '#C33B3B',
        background_color: '#FCFAF7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon_192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon_512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB лимит
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,ttf,woff,woff2,json,webmanifest}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
});
```

#### 2.4.2. SPA Navigation Fallback для ярлыков на рабочем столе
Благодаря параметру `navigateFallback: 'index.html'`, при открытии приложения оффлайн по любому внутреннему маршруту или при клике по иконке на рабочем столе, Service Worker не запрашивает сеть, а мгновенно отдает локальный `index.html`, полностью исключая экран ошибки `ERR_FAILED` или `ERR_INTERNET_DISCONNECTED`.

#### 2.4.3. Автономность пользовательских данных (Zustand + `localStorage`)
Все пользовательские настройки, состояние страниц, дневники и закладки сохраняются локально на устройстве клиента через `localStorage` или Zustand `persist` middleware. При отсутствии интернет-соединения приложение сохраняет 100% своей функциональности.

#### 2.4.4. Защита бинарных ассетов от деградации (`.gitattributes`)
Для предотвращения повреждения шрифтов (`.ttf`, `.woff`), медиафайлов и иконок при экспорте кода и синхронизации с Git создается файл `.gitattributes`:

```gitattributes
* text=auto
*.png binary
*.jpg binary
*.jpeg binary
*.webp binary
*.svg binary
*.ico binary
*.ttf binary
*.woff binary
*.woff2 binary
*.epub binary
*.fb2 binary
```

---

### 2.5. Механика 5: Плавающая кнопка возврата прокрутки (Back-to-Top FAB)

#### 2.5.1. Универсальное отслеживание скролла (`<main>` + `window`)
В современных SPA/PWA приложениях прокрутка часто происходит не в `window`, а внутри контейнера `<main>` с `overflow-y: auto`. Реализуется универсальный слушатель события `scroll`:

```typescript
useEffect(() => {
  const mainElement = document.querySelector('main');
  
  const handleScroll = () => {
    if (mainElement) {
      setShow(mainElement.scrollTop > threshold);
    } else {
      setShow(window.scrollY > threshold);
    }
  };

  const target = mainElement || window;
  target.addEventListener('scroll', handleScroll);
  return () => target.removeEventListener('scroll', handleScroll);
}, [threshold]);
```

#### 2.5.2. Плавная навигация с поддержкой Target ID
Кнопка поддерживает как возврат на самый верх страницы (`top: 0`), так и прокрутку к конкретному элементу (например, к оглавлению `#toc`):

```typescript
const scrollToTop = () => {
  if (targetId) {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
  
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
```

#### 2.5.3. UX, Z-Index и безопасное позиционирование
- **Высокий Z-Index (`z-50`)**: Кнопка размещается поверх основного контента.
- **Отступ от нижней навигации (`bottom-24` / `lg:bottom-28`)**: Располагается выше нижних панелей управления, плавающих таббаров и PWA-уведомлений.
- **Анимации и микро-фидбек**: Выплывающий плавающий анимационный запуск (`animate-in fade-in slide-in-from-bottom-4`), эффект подсвечивания при наведении (`hover:brightness-110`) и сжатия при клике (`active:scale-95`).

---

### 2.6. Механика 6: Раздел «О приложении» (Кнопка `(i)` в шапке Header)

#### 2.6.1. Размещение кнопки вызова `(i)`
Кнопка вызова модального окна `(i)` (Информационный значок) размещается в правом верхнем углу шапки приложения (Header) рядом со статусом приложения/сети:
- Стиль: Компактная круглая или скругленная эстетичная кнопка с иконкой `Info` из `lucide-react`.
- Отклик: Анимация при наведении и нажатии (`hover:bg-accent active:scale-95`).

#### 2.6.2. Структура информационного окна «О приложении»
Интерактивное модальное окно включает в себя следующие обязательные смысловые блоки:

1. **О приложении**: Раскрывается практическая ценность продукта для целевой аудитории (например, быстрый поиск гармоничных пар, калькуляторы пропорций, ИИ-помощники, интерактивные карточки и каталоги).
2. **Технические особенности**: Разъясняется PWA-технология, автономная работа напрямую в браузере и надежное локальное хранение данных без принудительной отправки на сторонние сервера.
3. **Преимущества**:
   - Полный оффлайн-доступ без интернета.
   - Экономия памяти устройства (не требует гигабайтов установки из магазинов).
   - Мгновенное обновление в обход задержек маркетплейсов.
   - Защищенность и HTTPS-безопасность.
4. **Ограничения**: Понятное описание условий сохранения оффлайн-кэша и локальных данных (зависимость от очистки данных браузера).
5. **Блок «Обратная связь»**:
   - Фоновая плашка с акцентным оформлением.
   - Заголовок бордового/акцентного цвета.
   - Кнопка **«Написать разработчику»** с прямым ссылочным переходом (`mailto:indievid.krd@gmail.com`).
   - Подпись с иконкой сердца: **«Создано нейрокомандой Индивид СтудИИя»**.

---

### 2.7. Механика 7: Обязательные PWA-иконки (256x256 / 192x192, 512x512) и их автогенерация

#### 2.7.1. Критическое требование стандарта установки PWA
Современные браузеры (Google Chrome, Safari, Edge, Android WebSights) **не вызывают событие установки `beforeinstallprompt` и блокируют возможность установки PWA**, если в манифесте (`manifest.json` / `vite.config.ts`) отсутствуют валидные иконки высокого разрешения:
- **Минимальный набор**: иконка со стороной 192x192 или 256x256 пикселей, а также 512x512 пикселей (в формате PNG или SVG).
- **Иконки рабочего стола и браузера**: `apple-touch-icon.png` (180x180) для iOS и `favicon.ico` для вкладки браузера.

#### 2.7.2. Автоматическое создание ИИ при отсутствии ассетов
Если на начальном этапе разработки у заказчика отсутствуют готовые файлы иконок:
1. **Автономная генерация**: Нейрокоманда (`[AI Product Designer]` / `[AI Lead Developer]`) автоматически создаёт красивую тематическую иконку приложения в векторе/растре с корректной геометрией, сохраняет её в форматах `icon_192.png` / `icon_256.png` и `icon_512.png` в директории `public/` и регистрирует в манифесте.
2. **Уведомление заказчика**: В диалоге с пользователем обязательно выводится короткое информационное сообщение:
   > *"Для обеспечения гарантированной установки PWA сгенерированы базовые иконки приложения (256x256 и 512x512). Вы можете в любой момент заменить файлы `icon_256.png` (`icon_192.png`) и `icon_512.png` в папке `public/` на ваши собственные изображения с сохранением названий файлов."*

---

## 3. Инструкция по внедрению в системный промпт нейрокоманды

Для автоматического воспроизведения данного стандарта во всех новых проектах, добавьте следующий фрагмент в системный промпт нейроагентов:

> **[PWA MANDATE]**: При создании PWA строго соблюдать стандарты из `KNOWLEDGE_BASE.md`:
> 1. Установить глобальный перехватчик `beforeinstallprompt` в `index.html`.
> 2. Реализовать `InstallPrompt` с поддержкой автоматической установки на Android, FAB и пошаговым гайдом для iOS.
> 3. Настроить определение Standalone-режима и однократное приветствие с конфетти при первом открытии.
> 4. Настроить `VitePWA` в режиме `registerType: 'prompt'`, `skipWaiting: false`, `navigateFallback: 'index.html'` и лимитом бандла `15MB`.
> 5. Изолировать все проверки обновлений через `navigator.onLine`.
> 6. Добавить плавающую кнопку возврата прокрутки `BackToTopButton` с отслеживанием `<main>`/`window` и плавной прокруткой (`behavior: 'smooth'`).
> 7. Разместить в шапке (Header) кнопку `(i)` с вызовом модального окна «О приложении» (ценность, PWA-технологии, оффлайн-преимущества, ограничения и блок обратной связи `mailto:indievid.krd@gmail.com` с подписью «Создано нейрокомандой Индивид СтудИИя»).
> 8. Обеспечить наличие PWA-иконок (256x256 / 192x192 и 512x512); при отсутствии готовых ассетов ИИ генерирует базовые иконки и информирует заказчика о возможности их замены.
