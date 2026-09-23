'use client';

export interface ProtocolSnapshot {
  protocol: 'zest' | 'bitflow' | 'alex' | 'stacking';
  tvl: number;       // USD
  apy: number;       // percent
  riskScore: number; // 0-100
  utilizationRate: number; // 0-1
  snapshotAt: string;
}

interface ProtocolHealthCardProps {
  snapshot: ProtocolSnapshot;
  onSelectForVault?: (protocol: string) => void;
}

const protocolMeta: Record<string, { label: string; color: string; bg: string; description: string }> = {
  zest:     { label: 'Zest Protocol',  color: 'text-green-700',  bg: 'bg-green-50',  description: 'Bitcoin-backed lending on Stacks' },
  bitflow:  { label: 'Bitflow',        color: 'text-blue-700',   bg: 'bg-blue-50',   description: 'sBTC/STX liquidity & swaps' },
  alex:     { label: 'ALEX Lab',       color: 'text-purple-700', bg: 'bg-purple-50', description: 'DeFi hub — DEX, launchpad, farming' },
  stacking: { label: 'Stacking',       color: 'text-orange-700', bg: 'bg-orange-50', description: 'Native sBTC yield via PoX' },
};

function RiskBar({ score }: { score: number }) {
  const color = score < 40 ? 'bg-green-500' : score < 70 ? 'bg-yellow-500' : 'bg-red-500';
  const label = score < 40 ? 'Low' : score < 70 ? 'Medium' : 'High';
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Risk</span>
        <span className={score < 40 ? 'text-green-600' : score < 70 ? 'text-yellow-600' : 'text-red-600'}>
          {label} ({score})
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function UtilizationBar({ rate }: { rate: number }) {
  const pct = Math.round(rate * 100);
  const color = pct < 70 ? 'bg-blue-500' : pct < 90 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Utilization</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProtocolHealthCard({ snapshot, onSelectForVault }: ProtocolHealthCardProps) {
  const meta = protocolMeta[snapshot.protocol];
  const formatTVL = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

  return (
    <div className={`border border-gray-200 rounded-xl p-5 ${meta.bg} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`font-semibold text-sm ${meta.color}`}>{meta.label}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{meta.description}</p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(snapshot.snapshotAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">TVL</p>
          <p className="text-lg font-bold text-gray-900">{formatTVL(snapshot.tvl)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">APY</p>
          <p className="text-lg font-bold text-green-600">{snapshot.apy.toFixed(2)}%</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <RiskBar score={snapshot.riskScore} />
        <UtilizationBar rate={snapshot.utilizationRate} />
      </div>

      {onSelectForVault && (
        <button
          onClick={() => onSelectForVault(snapshot.protocol)}
          className={`w-full text-xs font-medium py-1.5 rounded-lg border transition-colors ${meta.color} border-current hover:opacity-80`}
        >
          Deploy vault here
        </button>
      )}
    </div>
  );
}
