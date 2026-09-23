'use client';

import { useState } from 'react';
import type { VaultConditions } from './VaultCard';

interface ConditionBuilderProps {
  initial?: Partial<VaultConditions>;
  onChange: (conditions: VaultConditions) => void;
}

const defaults: VaultConditions = {
  minYieldPercent: 3,
  maxRiskScore: 70,
  exitBtcPriceBelow: undefined,
  exitOnLiquidationRisk: true,
};

export function ConditionBuilder({ initial, onChange }: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<VaultConditions>({ ...defaults, ...initial });

  const update = (patch: Partial<VaultConditions>) => {
    const next = { ...conditions, ...patch };
    setConditions(next);
    onChange(next);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum yield (% APY)
        </label>
        <p className="text-xs text-gray-500 mb-2">Exit the vault if the protocol APY drops below this.</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={conditions.minYieldPercent}
            onChange={e => update({ minYieldPercent: parseFloat(e.target.value) })}
            className="flex-1 accent-orange-500"
          />
          <span className="text-sm font-semibold text-orange-600 w-12 text-right">
            {conditions.minYieldPercent}%
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum risk score
        </label>
        <p className="text-xs text-gray-500 mb-2">Exit if the protocol risk score exceeds this (0 = safest, 100 = most risky).</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={conditions.maxRiskScore}
            onChange={e => update({ maxRiskScore: parseInt(e.target.value) })}
            className="flex-1 accent-orange-500"
          />
          <span className={`text-sm font-semibold w-12 text-right ${
            conditions.maxRiskScore < 40 ? 'text-green-600' :
            conditions.maxRiskScore < 70 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {conditions.maxRiskScore}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exit if BTC price drops below (USD) — optional
        </label>
        <p className="text-xs text-gray-500 mb-2">Leave blank to ignore price movements.</p>
        <input
          type="number"
          placeholder="e.g. 50000"
          value={conditions.exitBtcPriceBelow ?? ''}
          onChange={e => update({ exitBtcPriceBelow: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="liquidation-risk"
          checked={conditions.exitOnLiquidationRisk}
          onChange={e => update({ exitOnLiquidationRisk: e.target.checked })}
          className="mt-0.5 accent-orange-500"
        />
        <div>
          <label htmlFor="liquidation-risk" className="text-sm font-medium text-gray-700 cursor-pointer">
            Exit on liquidation risk
          </label>
          <p className="text-xs text-gray-500">Automatically exit if protocol utilization exceeds 95%.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-orange-800 mb-2">Your vault will exit if:</p>
        <ul className="space-y-1 text-xs text-orange-700 list-disc list-inside">
          <li>APY drops below <strong>{conditions.minYieldPercent}%</strong></li>
          <li>Risk score exceeds <strong>{conditions.maxRiskScore}/100</strong></li>
          {conditions.exitBtcPriceBelow && (
            <li>BTC price drops below <strong>${conditions.exitBtcPriceBelow.toLocaleString()}</strong></li>
          )}
          {conditions.exitOnLiquidationRisk && (
            <li>Protocol utilization exceeds <strong>95%</strong></li>
          )}
        </ul>
      </div>
    </div>
  );
}
