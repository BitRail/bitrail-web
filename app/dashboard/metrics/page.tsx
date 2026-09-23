export default function MetricsPage() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Public Metrics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-900 rounded">
          <p className="text-3xl font-bold text-white">42</p>
          <p className="text-sm text-gray-400">Wallets monitored</p>
        </div>
        <div className="p-4 bg-gray-900 rounded">
          <p className="text-3xl font-bold text-white">$2.3M</p>
          <p className="text-sm text-gray-400">Notional tracked</p>
        </div>
        <div className="p-4 bg-gray-900 rounded">
          <p className="text-3xl font-bold text-white">12</p>
          <p className="text-sm text-gray-400">Alerts fired</p>
        </div>
        <div className="p-4 bg-gray-900 rounded">
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-sm text-gray-400">Guarded txs</p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">Last updated: just now</p>
      </div>
    </div>
  );
}