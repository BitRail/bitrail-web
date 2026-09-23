'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VaultStats {
  active: number;
  totalSBTC: number;
  avgApy: number;
}

export function VaultSummary() {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('api_key') : null;
    if (!apiKey) { setLoading(false); return; }
    fetch('/api/v1/vaults', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then(r => r.json())
      .then(data => {
        const vaults = data.vaults || [];
        const active = vaults.filter((v: any) => v.status === 'active').length;
        const totalSBTC = vaults.reduce((sum: number, v: any) => sum + v.depositedAmount, 0);
        const avgApy = vaults.length > 0
          ? vaults.reduce((sum: number, v: any) => sum + (v.currentYield || 0), 0) / vaults.length
          : 0;
        setStats({ active, totalSBTC: totalSBTC / 1e8, avgApy });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Dormant Vaults</h2>
        <p className="text-sm text-gray-400">Loading vault data...</p>
      </div>
    );
  }

  if (!stats || stats.active === 0) {
    return (
      <div className="mt-6">
        <Link href="/dashboard/vaults" className="text-lg font-semibold text-gray-900 mb-3 hover:text-orange-600 inline-block">Dormant Vaults →</Link>
        <p className="text-sm text-gray-400">No active vaults. Deploy idle sBTC into DeFi with automatic risk protection.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Link href="/dashboard/vaults" className="text-lg font-semibold text-gray-900 mb-3 hover:text-orange-600 inline-block">Dormant Vaults</Link>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Active Vaults</p>
          <p className="text-2xl font-bold text-orange-600">{stats.active}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Deployed</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalSBTC.toFixed(4)} <span className="text-sm">sBTC</span></p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Avg APY</p>
          <p className="text-2xl font-bold text-blue-600">{stats.avgApy.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}
