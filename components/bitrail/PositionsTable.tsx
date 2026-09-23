import { Position } from '@/types';

interface Props {
  positions: Position[];
  loading: boolean;
}

export function PositionsTable({ positions, loading }: Props) {
  if (loading) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl animate-pulse">
        <div className="h-6 w-2/3 bg-gray-700 rounded mb-2" />
        <div className="grid grid-cols-2 gap-1 text-xs">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-700 rounded h-6" />
          ))}
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl">
        <p className="text-center text-gray-500">No positions found. Connect a wallet with Zest or StackingDAO positions.</p>
      </div>
    );
  }

  const typeBadgeColor = {
    collateral: 'bg-blue-100 text-blue-800',
    debt: 'bg-red-100 text-red-800',
    liquid: 'bg-green-100 text-green-800',
    lp: 'bg-purple-100 text-purple-800',
  };

  const typeBadgeText = {
    collateral: 'Colateral',
    debt: 'Deuda',
    liquid: 'Líquido',
    lp: 'LP',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <table className="w-full border-collapse border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Protocolo</th>
            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Activo</th>
            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Tipo</th>
            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Balance (token)</th>
            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Valor (USD)</th>
            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Valor (BTC)</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-200 px-4 py-2 text-sm">{pos.protocol}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm">{pos.asset}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${typeBadgeColor[pos.type]}`}>
                  {typeBadgeText[pos.type]}
                </span>
              </td>
              <td className="border border-gray-200 px-4 py-2 text-sm">{pos.balanceRaw}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm">${pos.balanceUSD.toFixed(2)}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm">{pos.balanceBTC} BTC</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-lg font-medium text-gray-900">Total</p>
        <p className="text-2xl font-bold text-gray-900">${positions.reduce((sum, pos) => sum + pos.balanceUSD, 0).toFixed(2)}</p>
      </div>
    </div>
  );
}