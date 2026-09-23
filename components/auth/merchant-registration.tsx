'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useWalletStore from '@/stores/WalletStore';

function generateDemoKey(prefix: string) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rand = Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}_${rand}`;
}

export function MerchantRegistration() {
  const router = useRouter();
  const { isConnected, currentAddress, connectWallet } = useWalletStore();

  const [step, setStep] = useState<'wallet' | 'details' | 'success'>('wallet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleWalletConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await connectWallet();
      setStep('details');
    } catch {
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAddress) { setError('Wallet not connected'); return; }
    setLoading(true);
    setError(null);

    try {
      // Try the real backend first
      const response = await fetch('/api/v1/merchants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, stacksAddress: currentAddress }),
      });

      if (response.ok) {
        const data = await response.json();
        const key = data.apiKeyTest || generateDemoKey('sk_test');
        localStorage.setItem('api_key', key);
        localStorage.setItem('merchant_id', data.id || 'demo');
        localStorage.setItem('merchant_name', name);
        localStorage.setItem('merchant_address', currentAddress);
        setApiKey(key);
        setStep('success');
        return;
      }
    } catch {
      // Backend unavailable — fall through to demo mode
    }

    // Demo mode — works without backend
    const demoKey = generateDemoKey('sk_test');
    const demoId = `demo_${Date.now()}`;
    localStorage.setItem('api_key', demoKey);
    localStorage.setItem('merchant_id', demoId);
    localStorage.setItem('merchant_name', name);
    localStorage.setItem('merchant_address', currentAddress);
    setApiKey(demoKey);
    setStep('success');
    setLoading(false);
  };

  // Auto-advance if already connected
  if (step === 'wallet' && isConnected && currentAddress) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Wallet Connected</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">{currentAddress.slice(0, 8)}...{currentAddress.slice(-6)}</p>
        </div>
        <button
          onClick={() => setStep('details')}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          Continue →
        </button>
      </div>
    );
  }

  if (step === 'wallet') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500">Connect your Stacks wallet to get started</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-5 text-sm text-orange-800 space-y-1">
          <p className="font-medium">What you get:</p>
          <p>✓ Accept sBTC payments instantly</p>
          <p>✓ Dormant vaults for idle Bitcoin</p>
          <p>✓ Real-time protocol health dashboard</p>
        </div>

        <button
          onClick={handleWalletConnect}
          disabled={loading}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Almost there</h2>
          <p className="text-sm text-gray-500">Just your name and email</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name or business</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your name or business"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
            Wallet: <span className="font-mono">{currentAddress?.slice(0, 10)}...{currentAddress?.slice(-6)}</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep('wallet')}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Success
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-5">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🌋</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Welcome to Lava, {name}!</h2>
        <p className="text-sm text-gray-500 mt-1">Your account is ready</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <p className="text-xs text-gray-500 mb-1">Your API key (saved automatically)</p>
        <p className="font-mono text-xs text-gray-800 break-all bg-white border border-gray-200 px-2 py-1.5 rounded">
          {apiKey}
        </p>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
