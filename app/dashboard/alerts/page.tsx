export default function AlertsPage() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Alerts</h1>

      {/* Active alerts list */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Alerts</h2>
        <div className="space-y-4">
          {/* Placeholder for alerts list */}
          <div className="p-4 bg-gray-900 rounded">
            <p className="text-gray-400">No active alerts</p>
          </div>
        </div>
      </div>

      {/* Create alert form */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Alert</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert type
            </label>
            <select className="w-full px-3 py-2 border border-gray-400 rounded">
              <option value="health_below">health_below</option>
              <option value="liquidation_near">liquidation_near</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Threshold
            </label>
            <input type="number" className="w-full px-3 py-2 border border-gray-400 rounded" placeholder="e.g. 1.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL (optional)
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-400 rounded" placeholder="https://example.com/webhook" />
          </div>
          <button type="submit" className="w-full px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
            Create Alert
          </button>
        </form>
      </div>
    </div>
  );
}