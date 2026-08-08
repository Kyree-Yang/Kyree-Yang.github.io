import { useEffect } from 'react';

const ORIGIN = 'https://kyree-yang.github.io';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * There is no server render here, so head tags are written imperatively on every
 * route. Crawlers that execute JS read the updated tags; the static index.html
 * values stay correct for the home route.
 */
export function Seo({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}) {
  useEffect(() => {
    const url = ORIGIN + path;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertCanonical(url);

    if (!noindex) return;
    upsertMeta('name', 'robots', 'noindex');
    return () => {
      document.head.querySelector('meta[name="robots"]')?.remove();
    };
  }, [title, description, path, noindex]);

  return null;
}

export default Seo;
