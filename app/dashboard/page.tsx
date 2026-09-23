import { Suspense } from 'react';
import Link from 'next/link';
import { HealthScoreWidget } from '@/components/bitrail/HealthScoreWidget';
import { PositionsTable } from '@/components/bitrail/PositionsTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <Suspense fallback={<div className="p-6 bg-gray-900 rounded-xl animate-pulse" />}>
              <HealthScoreWidget health={null} loading={true} />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<div className="p-6 bg-gray-900 rounded-xl animate-pulse" />}>
              <PositionsTable positions={[]} loading={true} />
            </Suspense>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div>
            <Link href="/dashboard/alerts" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
              Manage Alerts
            </Link>
          </div>
          <div>
            <Link href="/dashboard/actions" className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
              Actions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}