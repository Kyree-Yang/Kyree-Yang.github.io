import { PipelineRing } from '@/components/viz/PipelineRing';
import { LayerStack } from '@/components/viz/LayerStack';
import { OutcomeFunnel } from '@/components/viz/OutcomeFunnel';
import { CasRace } from '@/components/viz/CasRace';
import { SignalLatency } from '@/components/viz/SignalLatency';
import { DagFlow } from '@/components/viz/DagFlow';
import { DeltaMtRace } from '@/components/viz/DeltaMtRace';
import { RtlMirror } from '@/components/viz/RtlMirror';
import { NetworkStates } from '@/components/viz/NetworkStates';
import { ShardFanout } from '@/components/viz/ShardFanout';
import { AghfMorph } from '@/components/viz/AghfMorph';
import { DegreeGantt } from '@/components/viz/DegreeGantt';

/**
 * Ids here must match scripts/export-gifs.mjs MANIFEST. Every component is a
 * pure function of `t` when `t` is supplied, which is what makes frame capture
 * reproducible.
 */
export const GIF_REGISTRY: Record<string, (t: number) => React.ReactNode> = {
  'abf-pipeline': (t) => <PipelineRing t={t} bare />,
  'abf-layers': (t) => <LayerStack t={t} bare />,
  'abf-funnel': (t) => <OutcomeFunnel t={t} bare />,
  'abf-cas': (t) => <CasRace t={t} bare />,
  'abf-signal': (t) => <SignalLatency t={t} bare />,
  'designlab-dag': (t) => <DagFlow t={t} bare />,
  'i18n-delta-loop': (t) => <DeltaMtRace t={t} bare />,
  'rtl-mirror': (t) => <RtlMirror t={t} bare />,
  'weak-network': (t) => <NetworkStates t={t} bare />,
  'search-shards': (t) => <ShardFanout t={t} bare />,
  'aghf-morph': (t) => <AghfMorph t={t} bare />,
  'degree-gantt': (t) => <DegreeGantt t={t} bare />,
};
