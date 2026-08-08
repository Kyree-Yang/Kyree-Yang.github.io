import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Paths the Jekyll site served that no longer exist. */
const PATHS: Record<string, string> = {
  '/about': '/',
  '/about.html': '/',
  '/about/': '/',
};

/** Anchors from the old single-page layout. These never reach the server. */
const HASHES: Record<string, string> = {
  '#about-me': '/',
  '#-publications': '/cv#publications',
  '#-projects': '/work',
  '#-honors-and-awards': '/cv#honors',
  '#-educations': '/cv#education',
  '#-teaching-and-leadership': '/cv#teaching',
  '#-competitions': '/beyond#competitions',
  '#-activities': '/beyond#activities',
};

export function LegacyRedirects() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const byHash = hash ? HASHES[hash.toLowerCase()] : undefined;
    if (byHash) {
      navigate(byHash, { replace: true });
      return;
    }
    const byPath = PATHS[pathname.toLowerCase()];
    if (byPath && byPath !== pathname + hash) {
      navigate(byPath, { replace: true });
    }
  }, [pathname, hash, navigate]);

  return null;
}

export default LegacyRedirects;
