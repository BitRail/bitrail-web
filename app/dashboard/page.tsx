export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">Connect your wallet to view your Bitrail portfolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<div className="p-6 bg-gray-900 rounded-xl">Loading...</div>}>
          {/* Placeholder for wallet connection and data fetching */}
          <div className="p-6 bg-gray-900 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-4">Bitrail Portfolio</h2>
            <p className="text-gray-400">Connect a wallet to see your positions and health score.</p>
          </div>
        </Suspense>
      </div>
    </div>
  );
}