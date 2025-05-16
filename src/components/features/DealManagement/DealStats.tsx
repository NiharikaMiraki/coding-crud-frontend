'use client';

import { memo, useMemo } from 'react';
import type { Deal } from '@/types/deal';

interface DealStatsProps {
  deals: Deal[];
}

export const DealStats = memo(({ deals }: DealStatsProps) => {
  const stats = useMemo(() => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const stageCounts = deals.reduce((counts, deal) => {
      counts[deal.stage] = (counts[deal.stage] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    const weightedValue = deals.reduce(
      (sum, deal) => sum + deal.value * (deal.probability / 100),
      0
    );

    return {
      totalValue,
      stageCounts,
      weightedValue,
    };
  }, [deals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Total Deals</h3>
        <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Weighted Value</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.weightedValue)}</p>
      </div>
      <div className="col-span-full bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Pipeline Stages</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats.stageCounts).map(([stage, count]) => (
            <div key={stage} className="text-center">
              <p className="text-sm text-gray-500">{stage.replace('_', ' ').toUpperCase()}</p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

DealStats.displayName = 'DealStats'; 