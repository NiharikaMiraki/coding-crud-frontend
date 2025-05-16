'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DealCard } from './DealCard';
import { DealFilters } from './DealFilters';
import { DealForm } from './DealForm';
import { DealStats } from './DealStats';
import {
  setFilters,
  clearFilters,
  updateDeal,
  deleteDeal,
  setStage,
  addDeal,
} from '@/store/slices/dealSlice';
import type { Deal, DealStage } from '@/types/deal';
import type { RootState } from '@/store';

// Compound Component Pattern
export const DealList = memo(() => {
  const dispatch = useDispatch();
  const deals = useSelector((state: RootState) => state.deals.items);
  const filters = useSelector((state: RootState) => state.deals.filters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Memoized handlers
  const handleCreateDeal = useCallback(
    (deal: Deal) => {
      // Convert Date objects to ISO strings before dispatching
      const serializedDeal = {
        ...deal,
        expectedCloseDate: deal.expectedCloseDate.toISOString(),
        createdAt: deal.createdAt.toISOString(),
        updatedAt: deal.updatedAt.toISOString(),
      };
      dispatch(addDeal(serializedDeal));
      setIsFormOpen(false);
    },
    [dispatch]
  );

  const handleUpdateDeal = useCallback(
    (deal: Deal) => {
      // Convert Date objects to ISO strings before dispatching
      const serializedDeal = {
        ...deal,
        expectedCloseDate: deal.expectedCloseDate.toISOString(),
        createdAt: deal.createdAt.toISOString(),
        updatedAt: deal.updatedAt.toISOString(),
      };
      dispatch(updateDeal(serializedDeal));
      setEditingDeal(null);
    },
    [dispatch]
  );

  const handleDeleteDeal = useCallback(
    (id: string) => {
      dispatch(deleteDeal(id));
    },
    [dispatch]
  );

  const handleStageChange = useCallback(
    (id: string, stage: DealStage) => {
      dispatch(setStage({ id, stage }));
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleEditClick = useCallback((deal: Deal) => {
    setEditingDeal(deal);
    setIsFormOpen(true);
  }, []);

  // Memoized filtered deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (filters.stage && deal.stage !== filters.stage) return false;
      if (filters.assignedTo && deal.assignedTo !== filters.assignedTo) return false;
      if (filters.minValue && deal.value < filters.minValue) return false;
      if (filters.maxValue && deal.value > filters.maxValue) return false;
      if (filters.dateRange) {
        const dealDate = new Date(deal.expectedCloseDate);
        if (dealDate < filters.dateRange.start || dealDate > filters.dateRange.end) return false;
      }
      return true;
    });
  }, [deals, filters]);

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deal Management</h1>
        <button
          onClick={() => {
            setEditingDeal(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Deal
        </button>
      </div>

      {/* Compound Components */}
      <DealList.Stats deals={deals} />
      <DealList.Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredDeals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onUpdate={handleEditClick}
            onDelete={handleDeleteDeal}
            onStageChange={handleStageChange}
          />
        ))}
      </div>

      {isFormOpen && (
        <DealForm
          deal={editingDeal || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDeal(null);
          }}
          onSubmit={editingDeal ? handleUpdateDeal : handleCreateDeal}
        />
      )}
    </div>
  );
});

// Compound Components
DealList.Stats = DealStats;
DealList.Filters = DealFilters;
DealList.Form = DealForm; 