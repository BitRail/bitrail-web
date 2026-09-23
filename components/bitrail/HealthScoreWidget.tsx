import { HealthScore } from '@/types';

interface Props {
  health: HealthScore | null;
  loading: boolean;
}

export function HealthScoreWidget({ health, loading }: Props) {
  if (loading) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl animate-pulse">
        <div className="h-6 w-2/3 bg-gray-700 rounded mb-3" />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-700 rounded h-6" />
          <div className="bg-gray-700 rounded h-6" />
        </div>
      </div>
    );
  }

  if (!health) {
    return <div className="p-6 bg-gray-900 rounded-xl">No health data</div>;
  }

  const { healthFactor, status, totalCollateralUSD, totalDebtUSD, liquidationDistancePct, liquidationDistanceUSD, liquidationDistanceBTC, assumptions, computedAt } = health;
  const statusColor = status === 'safe' ? 'green-500' : status === 'watch' ? 'yellow-500' : 'red-500';
  const statusText = status === 'safe' ? 'SAFE' : status === 'watch' ? 'WATCH' : 'DANGER';

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-gray-900">{healthFactor?.toFixed(2)}</h1>
          <p className="text-gray-600">Health Score</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium {statusColor}">
          {statusText}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Colateral</p>
          <p className="text-2xl font-medium">${totalCollateralUSD.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deuda</p>
          <p className="text-2xl font-medium">${totalDebtUSD.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Distancia a la liquidación</p>
        <p className="text-xl font-medium">{liquidationDistancePct.toFixed(1)}% | ${liquidationDistanceUSD.toFixed(2)} | {liquidationDistanceBTC.toFixed(4)} BTC</p>
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-blue-600 underline">Ver suposiciones</summary>
        <div className="mt-3 text-sm">
          <ul>
            {assumptions.map((a, i) => (
              <li key={i} className="text-gray-600">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </details>

      <p className="mt-6 text-xs text-gray-500">Modelo: bitrail-risk-v0.1</p>
      <p className="mt-2 text-xs text-gray-400">Última actualización: {new Date(computedAt).toLocaleString()}</p>
    </div>
  );
}