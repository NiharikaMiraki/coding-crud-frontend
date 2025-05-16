'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import type { Deal, DealStage } from '@/types/deal';

interface DealCardProps {
  deal: Deal;
  onUpdate: (id: string, changes: Partial<Deal>) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, stage: DealStage) => void;
}

const STAGE_COLORS: Record<DealStage, string> = {
  lead: 'bg-gray-100 text-gray-800',
  qualified: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
};

export const DealCard = memo(({ deal, onUpdate, onDelete, onStageChange }: DealCardProps) => {
  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStageChange(deal.id, e.target.value as DealStage);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-gray-900">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${STAGE_COLORS[deal.stage]}`}>
          {deal.stage.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{deal.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Value</p>
          <p className="font-medium text-gray-900">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(deal.value)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Probability</p>
          <p className="font-medium text-gray-900">{deal.probability}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expected Close</p>
          <p className="font-medium text-gray-900">{format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Assigned To</p>
          <p className="font-medium text-gray-900">{deal.assignedTo}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <select
          value={deal.stage}
          onChange={handleStageChange}
          className="border rounded px-2 py-1 text-sm text-gray-900 bg-white"
        >
          {Object.keys(STAGE_COLORS).map((stage) => (
            <option key={stage} value={stage}>
              {stage.replace('_', ' ')}
            </option>
          ))}
        </select>

        <div className="space-x-2">
          <button
            onClick={() => onUpdate(deal.id, { ...deal })}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(deal.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

DealCard.displayName = 'DealCard'; 