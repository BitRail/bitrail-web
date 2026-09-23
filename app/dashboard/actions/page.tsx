export default function ActionsPage() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Guarded Actions</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Guarded Repay on Zest</h2>

        {/* Current health info */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Health Factor: <span className="font-medium">2.41</span></p>
          <p className="text-sm text-gray-500">Liquidation Distance: <span className="font-medium">15.2% | $1,200 | 0.045 BTC</span></p>
        </div>

        {/* Policy check */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Policy Minimum: <span className="font-medium">1.5</span></p>
          <p className="text-sm text-gray-500">Post-action health: <span className="font-medium">2.41</span> ✓ Above policy minimum</p>
        </div>

        {/* Action button */}
        <div>
          <button className="w-full px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Sign Transaction
          </button>
          <p className="mt-2 text-sm text-gray-500">This action keeps your health above your policy minimum</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 text-center mt-4">
          Not financial advice. Verify on-chain before signing.
        </p>
      </div>
    </div>
  );
}