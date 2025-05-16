'use client';

import { memo } from 'react';
import type { DealStage } from '@/types/deal';

interface DealFiltersProps {
  filters: {
    stage?: DealStage;
    assignee?: string;
    minValue?: number;
    maxValue?: number;
    dateRange: {
      start?: Date;
      end?: Date;
    };
  };
  onFilterChange: (filters: DealFiltersProps['filters']) => void;
  onClearFilters: () => void;
}

export const DealFilters = memo(({ filters, onFilterChange, onClearFilters }: DealFiltersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [name]: new Date(value),
      },
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
          <select
            name="stage"
            value={filters.stage || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Stages</option>
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <input
            type="text"
            name="assignee"
            value={filters.assignee || ''}
            onChange={handleChange}
            placeholder="Filter by assignee"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
          <input
            type="number"
            name="minValue"
            value={filters.minValue || ''}
            onChange={handleChange}
            placeholder="Minimum value"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
          <input
            type="number"
            name="maxValue"
            value={filters.maxValue || ''}
            onChange={handleChange}
            placeholder="Maximum value"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="start"
            value={filters.dateRange?.start ? new Date(filters.dateRange.start).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="end"
            value={filters.dateRange?.end ? new Date(filters.dateRange.end).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
});

DealFilters.displayName = 'DealFilters'; 