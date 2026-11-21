/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';

// Lazy-loaded pages for code splitting and fast initial PWA startup
const Temple = lazy(() => import('./pages/Temple'));
const TempleRules = lazy(() => import('./pages/TempleRules'));
const Sacraments = lazy(() => import('./pages/Sacraments'));
const Confession = lazy(() => import('./pages/Confession'));
const MyConfession = lazy(() => import('./pages/MyConfession'));
const PrayerBook = lazy(() => import('./pages/PrayerBook'));
const PrayerViewer = lazy(() => import('./pages/PrayerViewer'));
const CommunionPrayers = lazy(() => import('./pages/CommunionPrayers'));
const VariousPrayers = lazy(() => import('./pages/VariousPrayers'));
const CommunionWarning = lazy(() => import('./pages/CommunionWarning'));
const Prosphora = lazy(() => import('./pages/Prosphora'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Gospel = lazy(() => import('./pages/Gospel'));
const Catechesis = lazy(() => import('./pages/Catechesis'));
const CatechesisQuestions = lazy(() => import('./pages/CatechesisQuestions'));
const Commandments = lazy(() => import('./pages/Commandments'));
const Treby = lazy(() => import('./pages/Treby'));
const Scripture = lazy(() => import('./pages/Scripture'));
const Liturgy = lazy(() => import('./pages/Liturgy'));
const Death = lazy(() => import('./pages/Death'));
const SpiritualLiterature = lazy(() => import('./pages/SpiritualLiterature'));
const Angels = lazy(() => import('./pages/Angels'));
const RepentanceHelp = lazy(() => import('./pages/RepentanceHelp'));
const About = lazy(() => import('./pages/About'));
const RouteMap = lazy(() => import('./pages/RouteMap'));
const Ascetics = lazy(() => import('./pages/Ascetics'));
const Dogmas = lazy(() => import('./pages/Dogmas'));
const DivineServices = lazy(() => import('./pages/DivineServices'));
const DailyCycle = lazy(() => import('./pages/DailyCycle'));

function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[var(--color-ink)]/60">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-cinnabar)] mb-3" />
      <span className="font-izhitsa text-sm">Загрузка раздела...</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="temple" element={<Temple />} />
              <Route path="temple/rules" element={<TempleRules />} />
              <Route path="temple/sacraments" element={<Sacraments />} />
              <Route path="temple/confession" element={<Confession />} />
              <Route path="temple/divine-services" element={<DivineServices />} />
              <Route path="temple/divine-services/daily" element={<DailyCycle />} />
              <Route path="temple/liturgy" element={<Liturgy />} />
              <Route path="temple/treby" element={<Treby />} />
              <Route path="temple/prosphora" element={<Prosphora />} />
              <Route path="my-confession" element={<MyConfession />} />
              <Route path="prayer-book/communion/warning" element={<CommunionWarning />} />
              <Route path="prayer-book/communion/:id" element={<PrayerViewer />} />
              <Route path="prayer-book/communion" element={<CommunionPrayers />} />
              <Route path="prayer-book/various" element={<VariousPrayers />} />
              <Route path="prayer-book/:id" element={<PrayerViewer />} />
              <Route path="prayer-book" element={<PrayerBook />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="gospel-life" element={<Gospel />} />
              <Route path="gospel-life/route-map" element={<RouteMap />} />
              <Route path="gospel-life/catechesis" element={<Catechesis />} />
              <Route path="gospel-life/catechesis/questions" element={<CatechesisQuestions />} />
              <Route path="gospel-life/repentance-help" element={<RepentanceHelp />} />
              <Route path="gospel-life/commandments" element={<Commandments />} />
              <Route path="gospel-life/ascetics" element={<Ascetics />} />
              <Route path="gospel-life/treby" element={<Treby />} />
              <Route path="gospel-life/scripture" element={<Scripture />} />
              <Route path="gospel-life/dogmas" element={<Dogmas />} />
              <Route path="gospel-life/death" element={<Death />} />
              <Route path="gospel-life/literature" element={<SpiritualLiterature />} />
              <Route path="gospel-life/angels" element={<Angels />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
}
