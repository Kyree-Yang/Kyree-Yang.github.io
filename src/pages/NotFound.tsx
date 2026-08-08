import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Seo } from '@/components/shell/Seo';
import { Container, Section } from '@/components/ui/primitives';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { notFound, routeDirectory } from '@/content/site';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <>
      <Seo
        title="Not found — Ruikai Yang"
        description="That URL does not exist on this site. Every public route is listed here."
        path="/404"
        noindex
      />

      <Section>
        <Container>
          <Reveal>
            <div className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
              http 404
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {notFound.title}
            </h1>
            <Prose size="lead" className="mt-4">
              <p>{notFound.body}</p>
            </Prose>
            <p className="mt-5 font-mono text-[12px] text-faint">
              requested <code className="break-all text-muted">{pathname}</code>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-12 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
              Everything that does exist
            </h2>
            <nav aria-label="Site directory" className="mt-4 grid gap-3 sm:grid-cols-2">
              {routeDirectory.map((route) => (
                <Link
                  key={route.to}
                  to={route.to}
                  className="card elevate group p-4 transition-colors hover:border-line-strong"
                >
                  <div className="font-mono text-[11px] break-all text-faint">{route.to}</div>
                  <div className="mt-1.5 flex items-start gap-2 text-[15px] font-medium">
                    <span>{route.label}</span>
                    <ArrowRight
                      aria-hidden
                      className="mt-1 size-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{route.description}</p>
                </Link>
              ))}
            </nav>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
