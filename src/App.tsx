/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Temple from './pages/Temple';
import TempleRules from './pages/TempleRules';
import Confession from './pages/Confession';
import MyConfession from './pages/MyConfession';
import Gospel from './pages/Gospel';
import Catechesis from './pages/Catechesis';
import Scripture from './pages/Scripture';
import Commandments from './pages/Commandments';
import Death from './pages/Death';
import Angels from './pages/Angels';
import SpiritualLiterature from './pages/SpiritualLiterature';
import CatechesisQuestions from './pages/CatechesisQuestions';
import PrayerBook from './pages/PrayerBook';
import CommunionPrayers from './pages/CommunionPrayers';
import CommunionWarning from './pages/CommunionWarning';
import PrayerViewer from './pages/PrayerViewer';
import Calendar from './pages/Calendar';
import Liturgy from './pages/Liturgy';

import Treby from './pages/Treby';
import Prosphora from './pages/Prosphora';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="temple" element={<Temple />} />
          <Route path="temple/rules" element={<TempleRules />} />
          <Route path="temple/treby" element={<Treby />} />
          <Route path="temple/liturgy" element={<Liturgy />} />
          <Route path="temple/prosphora" element={<Prosphora />} />
          <Route path="temple/confession" element={<Confession />} />
          <Route path="my-confession" element={<MyConfession />} />
          <Route path="prayer-book" element={<PrayerBook />} />
          <Route path="prayer-book/communion" element={<CommunionPrayers />} />
          <Route path="prayer-book/communion/warning" element={<CommunionWarning />} />
          <Route path="prayer-book/:id" element={<PrayerViewer />} />
          <Route path="prayer-book/communion/:id" element={<PrayerViewer />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="gospel-life" element={<Gospel />} />
          <Route path="gospel-life/catechesis" element={<Catechesis />} />
          <Route path="gospel-life/catechesis/questions" element={<CatechesisQuestions />} />
          <Route path="gospel-life/scripture" element={<Scripture />} />
          <Route path="gospel-life/commandments" element={<Commandments />} />
          <Route path="gospel-life/death" element={<Death />} />
          <Route path="gospel-life/angels" element={<Angels />} />
          <Route path="gospel-life/literature" element={<SpiritualLiterature />} />
        </Route>
      </Routes>
    </>
  );
}
