'use client';

import { useState } from 'react';

export interface VaultConditions {
  minYieldPercent: number;
  maxRiskScore: number;
  exitBtcPriceBelow?: number;
  exitOnLiquidationRisk: boolean;
}

export interface Vault {
  id: string;
  ownerAddress: string;
  protocol: 'zest' | 'bitflow' | 'alex' | 'stacking';
  depositedAmount: number; // microsBTC
  currentYield?: number;
  status: 'active' | 'paused' | 'exiting' | 'closed';
  conditions: VaultConditions;
  createdAt: string;
  updatedAt: string;
}

interface VaultCardProps {
  vault: Vault;
  onPause?: (id: string) => void;
  onExit?: (id: string) => void;
}

const protocolColors: Record<string, string> = {
  zest: 'bg-green-100 text-green-800',
  bitflow: 'bg-blue-100 text-blue-800',
  alex: 'bg-purple-100 text-purple-800',
  stacking: 'bg-orange-100 text-orange-800',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  exiting: 'bg-red-100 text-red-700',
  closed: 'bg-gray-100 text-gray-500',
};

export function VaultCard({ vault, onPause, onExit }: VaultCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatSBTC = (micro: number) => (micro / 1e8).toFixed(6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${protocolColors[vault.protocol]}`}>
              {vault.protocol}
            </span>
            <p className="text-xs text-gray-400 mt-0.5">{vault.id.slice(0, 8)}...</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[vault.status]}`}>
          {vault.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Deposited</p>
          <p className="text-lg font-semibold text-gray-900">{formatSBTC(vault.depositedAmount)} <span className="text-sm text-gray-500">sBTC</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Current APY</p>
          <p className="text-lg font-semibold text-green-600">
            {vault.currentYield != null ? `${vault.currentYield.toFixed(2)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Conditions toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
      >
        <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Exit conditions
      </button>

      {expanded && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1 text-xs text-gray-600">
          <p>Min yield: <span className="font-medium">{vault.conditions.minYieldPercent}%</span></p>
          <p>Max risk score: <span className="font-medium">{vault.conditions.maxRiskScore}/100</span></p>
          {vault.conditions.exitBtcPriceBelow && (
            <p>Exit if BTC below: <span className="font-medium">${vault.conditions.exitBtcPriceBelow.toLocaleString()}</span></p>
          )}
          <p>Exit on liquidation risk: <span className="font-medium">{vault.conditions.exitOnLiquidationRisk ? 'Yes' : 'No'}</span></p>
        </div>
      )}

      {/* Actions */}
      {vault.status === 'active' && (
        <div className="flex gap-2">
          <button
            onClick={() => onPause?.(vault.id)}
            className="flex-1 text-xs border border-gray-300 text-gray-600 hover:bg-gray-50 py-1.5 rounded-lg transition-colors"
          >
            Pause
          </button>
          <button
            onClick={() => onExit?.(vault.id)}
            className="flex-1 text-xs border border-red-300 text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
          >
            Exit Vault
          </button>
        </div>
      )}
    </div>
  );
}
