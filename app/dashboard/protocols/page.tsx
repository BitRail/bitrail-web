'use client';

import { useState, useEffect } from 'react';
import { ProtocolHealthCard, type ProtocolSnapshot } from '@/components/dormant/ProtocolHealthCard';
import { useRouter } from 'next/navigation';

const riskLabel = (score: number) =>
  score < 40 ? { text: 'Ecosystem healthy', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
  : score < 70 ? { text: 'Moderate risk detected', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' }
  : { text: 'High risk — review vaults', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };

export default function ProtocolsPage() {
  const router = useRouter();
  const [snapshots, setSnapshots] = useState<ProtocolSnapshot[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/protocols')
      .then(r => r.json())
      .then(data => {
        setSnapshots(data.snapshots || []);
        setLastRefreshed(new Date());
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetch('/api/v1/protocols')
      .then(r => r.json())
      .then(data => {
        setSnapshots(data.snapshots || []);
        setLastRefreshed(new Date());
      })
      .finally(() => setLoading(false));
  };

  const handleSelectForVault = (protocol: string) => {
    router.push(`/dashboard/vaults?protocol=${protocol}`);
  };

  if (loading && snapshots.length === 0) {
    return <div className="max-w-5xl mx-auto"><p className="text-gray-500">Loading protocol data...</p></div>;
  }

  const avgRisk = snapshots.length > 0
    ? Math.round(snapshots.reduce((s, p) => s + p.riskScore, 0) / snapshots.length)
    : 0;
  const ecosystemStatus = riskLabel(avgRisk);
  const totalTVL = snapshots.reduce((s, p) => s + p.tvl, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className={`border rounded-xl p-4 mb-6 flex items-center justify-between ${ecosystemStatus.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${avgRisk < 40 ? 'bg-green-500' : avgRisk < 70 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
          <div>
            <p className={`text-sm font-semibold ${ecosystemStatus.color}`}>{ecosystemStatus.text}</p>
            <p className="text-xs text-gray-500">Avg risk score across all monitored protocols: {avgRisk}/100</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">Updated {lastRefreshed.toLocaleTimeString()}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total TVL monitored</p>
          <p className="text-2xl font-bold text-gray-900">
            ${(totalTVL / 1_000_000).toFixed(0)}M
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Protocols tracked</p>
          <p className="text-2xl font-bold text-blue-600">{snapshots.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Avg ecosystem APY</p>
          <p className="text-2xl font-bold text-green-600">
            {snapshots.length > 0
              ? (snapshots.reduce((s, p) => s + p.apy, 0) / snapshots.length).toFixed(1)
              : '0.0'}%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Protocol Health</h2>
          <p className="text-sm text-gray-500">Live snapshots from Zest, Bitflow, ALEX, and Stacking</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {snapshots.map(snapshot => (
          <ProtocolHealthCard
            key={snapshot.protocol}
            snapshot={snapshot}
            onSelectForVault={handleSelectForVault}
          />
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">How protocol monitoring works</h3>
        <p className="text-sm text-gray-600 mb-3">
          Lava continuously queries each protocol&apos;s on-chain state via the StacksMCPServer data layer.
          Snapshots are taken every 5 minutes. If a protocol&apos;s risk score or utilization rate breaches
          your vault&apos;s exit conditions, the condition engine automatically triggers an exit and returns
          your sBTC to your wallet.
        </p>
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
          <div><span className="font-medium text-green-600">●</span> Risk 0–39: Safe to deploy</div>
          <div><span className="font-medium text-yellow-600">●</span> Risk 40–69: Monitor closely</div>
          <div><span className="font-medium text-red-600">●</span> Risk 70+: Exit recommended</div>
        </div>
      </div>
    </div>
  );
}
