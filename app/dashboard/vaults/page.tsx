'use client';

import { useState, useEffect } from 'react';
import { VaultCard, type Vault } from '@/components/dormant/VaultCard';
import { ConditionBuilder } from '@/components/dormant/ConditionBuilder';
import type { VaultConditions } from '@/components/dormant/VaultCard';

type Step = 'list' | 'create-select' | 'create-conditions' | 'create-confirm';
const protocols = ['zest', 'bitflow', 'alex', 'stacking'] as const;

export default function VaultsPage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('list');
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [amount, setAmount] = useState('');
  const [conditions, setConditions] = useState<VaultConditions>({
    minYieldPercent: 3,
    maxRiskScore: 70,
    exitOnLiquidationRisk: true,
  });

  useEffect(() => {
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('api_key') : null;
    if (!apiKey) { setLoading(false); return; }
    fetch('/api/v1/vaults', {
      headers: { Authorization: `Bearer ${apiKey}` }
    })
      .then(r => r.json())
      .then(data => setVaults(data.vaults || []))
      .finally(() => setLoading(false));
  }, []);

  const handlePause = async (id: string) => {
    const apiKey = localStorage.getItem('api_key');
    try {
      const res = await fetch(`/api/v1/vaults/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ status: 'paused' }),
      });
      if (res.ok) {
        setVaults(prev => prev.map(v => v.id === id ? { ...v, status: 'paused' as const } : v));
      }
    } catch {}
  };

  const handleExit = async (id: string) => {
    const apiKey = localStorage.getItem('api_key');
    try {
      const res = await fetch(`/api/v1/vaults/${id}/exit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        setVaults(prev => prev.map(v => v.id === id ? { ...v, status: 'exiting' as const } : v));
      }
    } catch {}
  };

  const handleDeploy = async () => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) { alert('Please log in first'); return; }
    try {
      const res = await fetch('/api/v1/vaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          protocol: selectedProtocol,
          ownerAddress: localStorage.getItem('stacks_address') || '',
          depositedAmount: Math.floor(parseFloat(amount) * 1e8),
          conditions,
        }),
      });
      if (res.ok) {
        const vault = await res.json();
        setVaults(prev => [vault, ...prev]);
        setStep('list');
        setAmount('');
        setSelectedProtocol('');
      } else {
        const err = await res.json();
        alert(err.error?.message || 'Failed to create vault');
      }
    } catch {
      alert('Failed to create vault');
    }
  };

  const totalDeposited = vaults.reduce((sum, v) => sum + v.depositedAmount, 0);
  const activeVaults = vaults.filter(v => v.status === 'active').length;
  const avgApy = vaults.reduce((sum, v) => sum + (v.currentYield || 0), 0) / (vaults.length || 1);

  if (loading) {
    return <div className="max-w-5xl mx-auto"><p className="text-gray-500">Loading vaults...</p></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {step === 'list' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Total Deployed</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalDeposited / 1e8).toFixed(4)} <span className="text-sm text-gray-500">sBTC</span>
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Active Vaults</p>
              <p className="text-2xl font-bold text-orange-600">{activeVaults}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Avg APY</p>
              <p className="text-2xl font-bold text-green-600">{avgApy.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Vaults</h2>
              <p className="text-sm text-gray-500">Autonomous sBTC deployment with condition-based exits</p>
            </div>
            <button
              onClick={() => setStep('create-select')}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Vault
            </button>
          </div>

          {vaults.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No vaults yet</h3>
              <p className="text-xs text-gray-500 mb-4">Deploy idle sBTC into DeFi with automatic risk protection.</p>
              <button onClick={() => setStep('create-select')} className="text-sm text-orange-600 font-medium hover:text-orange-700">
                Create your first vault →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaults.map(vault => (
                <VaultCard
                  key={vault.id}
                  vault={vault}
                  onPause={handlePause}
                  onExit={handleExit}
                />
              ))}
            </div>
          )}
        </>
      )}

      {step === 'create-select' && (
        <div className="max-w-lg mx-auto">
          <button onClick={() => setStep('list')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Choose protocol</h2>
          <p className="text-sm text-gray-500 mb-6">Select the DeFi protocol where your sBTC will be deployed.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {protocols.map(p => (
              <button
                key={p}
                onClick={() => setSelectedProtocol(p)}
                className={`border-2 rounded-xl p-4 text-left transition-all capitalize ${
                  selectedProtocol === p ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm text-gray-900">{p}</p>
              </button>
            ))}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (sBTC)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            disabled={!selectedProtocol || !amount}
            onClick={() => setStep('create-conditions')}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Set exit conditions →
          </button>
        </div>
      )}

      {step === 'create-conditions' && (
        <div className="max-w-lg mx-auto">
          <button onClick={() => setStep('create-select')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Set exit conditions</h2>
          <p className="text-sm text-gray-500 mb-6">Your vault exits automatically when any condition is breached.</p>
          <ConditionBuilder onChange={setConditions} />
          <button
            onClick={() => setStep('create-confirm')}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Review & deploy →
          </button>
        </div>
      )}

      {step === 'create-confirm' && (
        <div className="max-w-lg mx-auto">
          <button onClick={() => setStep('create-conditions')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm vault deployment</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 mb-6 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Protocol</span><span className="font-medium capitalize">{selectedProtocol}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium">{amount} sBTC</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Min APY</span><span className="font-medium">{conditions.minYieldPercent}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Max risk score</span><span className="font-medium">{conditions.maxRiskScore}/100</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Exit on liquidation risk</span><span className="font-medium">{conditions.exitOnLiquidationRisk ? 'Yes' : 'No'}</span></div>
          </div>
          <button
            onClick={handleDeploy}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Deploy vault
          </button>
        </div>
      )}
    </div>
  );
}
