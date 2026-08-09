import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import RootLayout from './components/shell/RootLayout';
import RouteSkeleton from './components/shell/RouteSkeleton';
import Home from './pages/Home';
import GifStage from './pages/GifStage';
import NotFound from './pages/NotFound';

const Work = lazy(() => import('./pages/Work'));
const AutonomousBugFix = lazy(() => import('./pages/work/AutonomousBugFix'));
const DesignLab = lazy(() => import('./pages/work/DesignLab'));
const Aghf = lazy(() => import('./pages/work/Aghf'));
const SearchEngine = lazy(() => import('./pages/work/SearchEngine'));
const DiffusionPyramid = lazy(() => import('./pages/work/DiffusionPyramid'));
const Mcm = lazy(() => import('./pages/work/Mcm'));
const Cv = lazy(() => import('./pages/Cv'));
const Beyond = lazy(() => import('./pages/Beyond'));

export default function App() {
  return (
    <Routes>
      {/* The capture stage sits outside the layout: no header, no footer. */}
      <Route path="/_gif/:id" element={<GifStage />} />

      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route
          path="work"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <Work />
            </Suspense>
          }
        />
        <Route
          path="work/autonomous-bug-fix"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <AutonomousBugFix />
            </Suspense>
          }
        />
        <Route
          path="work/design-lab"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <DesignLab />
            </Suspense>
          }
        />
        <Route
          path="work/aghf"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <Aghf />
            </Suspense>
          }
        />
        <Route
          path="work/search-engine"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <SearchEngine />
            </Suspense>
          }
        />
        <Route
          path="work/diffusion-pyramid"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <DiffusionPyramid />
            </Suspense>
          }
        />
        <Route
          path="work/mcm-2024"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <Mcm />
            </Suspense>
          }
        />
        <Route
          path="cv"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <Cv />
            </Suspense>
          }
        />
        <Route
          path="beyond"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <Beyond />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
