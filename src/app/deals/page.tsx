'use client';

import { useEffect, useState } from 'react';
import { Deal } from '@/types/deals';
import { dealsService } from '@/services/dealsService';
import DealForm from '@/components/deals/DealForm';
import DealList from '@/components/deals/DealList';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealsService.getAllDeals();
      console.log('Fetch deals response:', response);
      if (response.success) {
        setDeals(response.data);
      } else {
        setError(response.message || 'Failed to fetch deals');
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('An error occurred while fetching deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleCreateDeal = async (deal: Omit<Deal, '_id'>) => {
    try {
      const response = await dealsService.createDeal(deal);
      if (response.success) {
        await fetchDeals();
        setIsFormOpen(false);
      } else {
        setError(response.message || 'Failed to create deal');
      }
    } catch (err) {
      setError('An error occurred while creating the deal');
    }
  };

  const handleUpdateDeal = async (id: string, deal: Omit<Deal, '_id'>) => {
    try {
      const response = await dealsService.updateDeal(id, deal);
      if (response.success) {
        await fetchDeals();
        setSelectedDeal(null);
        setIsFormOpen(false);
      } else {
        setError(response.message || 'Failed to update deal');
      }
    } catch (err) {
      setError('An error occurred while updating the deal');
    }
  };

  const handleDeleteDeal = async (id: string) => {
    console.log('Attempting to delete deal with ID:', id);
    
    if (!id) {
      console.error('No ID provided for deletion');
      setError('Invalid deal ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        setLoading(true);
        console.log('Sending delete request for ID:', id);
        const response = await dealsService.deleteDeal(id);
        console.log('Delete response:', response);
        
        if (response.success) {
          console.log('Delete successful, refreshing deals list');
          await fetchDeals();
        } else {
          console.error('Delete failed:', response.message);
          setError(response.message || 'Failed to delete deal');
        }
      } catch (err) {
        console.error('Error during delete:', err);
        setError('An error occurred while deleting the deal');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Delete cancelled by user');
    }
  };

  const handleSubmit = (id: string | undefined, deal: Omit<Deal, '_id'>) => {
    if (id) {
      handleUpdateDeal(id, deal);
    } else {
      handleCreateDeal(deal);
    }
  };

  return (
    <main className="min-h-screen bg-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2A4759]">Deal Management</h1>
            <p className="mt-2 text-[#2A4759]/80">Manage your deals efficiently</p>
          </div>
          <button
            onClick={() => {
              setSelectedDeal(null);
              setIsFormOpen(true);
            }}
            className="bg-[#F79B72] text-white px-4 py-2 rounded-lg hover:bg-[#2A4759] transition-colors"
          >
            Add New Deal
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-[#2A4759]">Loading deals...</div>
        ) : (
          <>
            {isFormOpen && (
              <div className="mb-8">
                <DealForm
                  deal={selectedDeal}
                  onSubmit={handleSubmit}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedDeal(null);
                  }}
                />
              </div>
            )}
            <DealList
              deals={deals}
              onEdit={(deal: Deal) => {
                setSelectedDeal(deal);
                setIsFormOpen(true);
              }}
              onDelete={handleDeleteDeal}
            />
          </>
        )}
      </div>
    </main>
  );
}
