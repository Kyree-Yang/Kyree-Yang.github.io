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

function TitleBlockCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 border-l border-line px-3 py-2 first:border-l-0">
      <span className="font-mono text-[9px] tracking-[0.14em] text-faint uppercase">{label}</span>
      <span className="truncate font-mono text-[11px] text-muted">{value}</span>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="seam-top mt-auto bg-surface-2">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
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

        {/* Drawing-set title block: the colophon as record-keeping. */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
          <div className="cut-card cut-sm max-w-full">
            <div className="cut-inner flex flex-wrap p-0">
              <TitleBlockCell label="drawn by" value="RY" />
              <TitleBlockCell label="rev" value={__BUILD_DATE__} />
              <TitleBlockCell label="sha" value={__BUILD_SHA__} />
              <TitleBlockCell label="typefaces" value="Besley · JetBrains Mono" />
              <div className="hidden flex-col justify-center border-l border-line px-3 py-2 sm:flex">
                <span className="font-mono text-[9px] tracking-[0.14em] text-faint uppercase">
                  do not scale drawing — verify denominators
                </span>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
