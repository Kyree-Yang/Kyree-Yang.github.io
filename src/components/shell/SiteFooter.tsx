import { Link } from 'react-router-dom';
import { GraduationCap, Github, Linkedin, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';

const CONTACT: { label: string; href: string; icon: LucideIcon; note?: string }[] = [
  { label: 'ryang435@gatech.edu', href: 'mailto:ryang435@gatech.edu', icon: Mail },
  {
    label: 'ruikai@umich.edu',
    href: 'mailto:ruikai@umich.edu',
    icon: Mail,
    note: 'Michigan, through Dec 2026',
  },
  { label: 'Kyree-Yang', href: 'https://github.com/Kyree-Yang', icon: Github },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ruikai-yang-17a940344',
    icon: Linkedin,
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=fXi8G90AAAAJ',
    icon: GraduationCap,
  },
];

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/cv', label: 'CV' },
  { to: '/beyond', label: 'Beyond' },
];

const ENTRIES = [
  { to: '/work/autonomous-bug-fix', label: 'Autonomous Bug-Fix Pipeline' },
  { to: '/work/design-lab', label: 'Design Lab' },
  { to: '/work/aghf', label: 'AGHF trajectory optimization' },
  { to: '/work/search-engine', label: 'Crawler Crew' },
  { to: '/work/diffusion-pyramid', label: 'Diffusion-Pyramid' },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-mono text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
      {children}
    </h2>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-bg-subtle">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="space-y-2.5">
              {CONTACT.map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                    className="inline-flex max-w-full items-center gap-2 text-[15px] text-muted transition-colors hover:text-fg"
                  >
                    <item.icon className="size-4 shrink-0 text-faint" aria-hidden />
                    <span className="break-all">{item.label}</span>
                  </a>
                  {item.note && (
                    <span className="ml-6 block text-[13px] text-faint">{item.note}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-faint">Atlanta, GA</p>
          </div>

          <nav aria-label="Pages">
            <ColumnHeading>Pages</ColumnHeading>
            <ul className="space-y-2.5">
              {PAGES.map((p) => (
                <li key={p.to}>
                  <Link
                    to={p.to}
                    className="text-[15px] text-muted transition-colors hover:text-fg"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Entries">
            <ColumnHeading>Entries</ColumnHeading>
            <ul className="space-y-2.5">
              {ENTRIES.map((e) => (
                <li key={e.to}>
                  <Link
                    to={e.to}
                    className="text-[15px] text-muted transition-colors hover:text-fg"
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
            built {__BUILD_DATE__} · {__BUILD_SHA__}
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
