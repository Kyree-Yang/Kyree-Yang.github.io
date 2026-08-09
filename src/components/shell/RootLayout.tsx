import { Outlet } from 'react-router-dom';

import { LegacyRedirects } from './LegacyRedirects';
import { PageTransition } from './PageTransition';
import { ScrollManager } from './ScrollManager';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Order matters: a legacy URL is rewritten before the scroll effect reads it. */}
      <LegacyRedirects />
      <ScrollManager />

      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[var(--radius-sm)] focus:border focus:border-line focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <SiteHeader />

      {/* clip, not hidden: hidden would make this a scroll container and break the sticky jump rail */}
      <main id="content" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <SiteFooter />
    </div>
  );
}

export default RootLayout;
