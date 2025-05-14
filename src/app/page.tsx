'use client';

import { useEffect, useState } from 'react';
import LeadForm from '@/components/LeadForm';
import LeadList from '@/components/LeadList';
import { Lead } from '@/types/lead';

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all leads on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/leads')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch leads');
        return res.json();
      })
      .then(data => {
        setLeads(data.map((l: any) => ({ ...l, _id: l._id.toString() })));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  // Add a new lead
  const handleAddLead = async (leadData: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (res.ok) {
      const newLead = await res.json();
      setLeads(prev => [ { ...newLead, _id: newLead._id.toString() }, ...prev ]);
      setIsFormOpen(false);
    } else {
      // handle error
    }
  };

  // Edit a lead (open form)
  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  // Update a lead
  const handleUpdateLead = async (leadData: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingLead) return;
    const res = await fetch(`/api/leads/${editingLead._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (res.ok) {
      const updatedLead = await res.json();
      setLeads(prev => prev.map(l => l._id === updatedLead._id ? { ...updatedLead, _id: updatedLead._id.toString() } : l));
      setEditingLead(undefined);
      setIsFormOpen(false);
    } else {
      // handle error
    }
  };

  // Delete a lead
  const handleDeleteLead = async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLeads(prev => prev.filter(l => l._id !== id));
    } else {
      // handle error
    }
  };

  return (
    <main className="min-h-screen bg-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2A4759]">Lead Management</h1>
            <p className="mt-2 text-[#2A4759]/80">Manage your leads efficiently</p>
          </div>
          <button
            onClick={() => {
              setEditingLead(undefined);
              setIsFormOpen(true);
            }}
            className="bg-[#F79B72] text-white px-4 py-2 rounded-lg hover:bg-[#2A4759] transition-colors"
          >
            Add New Lead
          </button>
        </div>
        {loading && <div className="text-center py-8 text-[#2A4759]">Loading leads...</div>}
        {error && <div className="text-center py-8 text-red-600">{error}</div>}
        {!loading && !error && (
          <>
            {isFormOpen && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#2A4759] mb-4">
                  {editingLead ? 'Edit Lead' : 'Add New Lead'}
                </h2>
                <LeadForm
                  lead={editingLead}
                  onSubmit={editingLead ? handleUpdateLead : handleAddLead}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingLead(undefined);
                  }}
                />
              </div>
            )}
            <LeadList
              leads={leads}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          </>
        )}
      </div>
    </main>
  );
}
