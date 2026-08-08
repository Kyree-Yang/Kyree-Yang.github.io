import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GIF_REGISTRY } from '@/gif/registry';

const PAD = 20;

/**
 * Capture surface for scripts/export-gifs.mjs. Renders exactly one
 * visualization, no chrome, on a flat opaque background at a deterministic
 * frame `t`. Theme is pinned by query param (default dark) so exported frames
 * don't follow the capture machine's OS preference. Not linked from the site.
 */
export default function GifStage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const t = Number(params.get('t') ?? 0);
  const theme = params.get('theme') === 'light' ? 'light' : 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const render = GIF_REGISTRY[id];
  if (!render) {
    return <div style={{ padding: 24, fontFamily: 'monospace' }}>unknown viz: {id}</div>;
  }

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'var(--bg)',
        padding: PAD,
        boxSizing: 'border-box',
      }}
    >
      {render(t)}
    </div>
  );
}
