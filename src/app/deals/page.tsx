'use client';

import { DealList } from '@/components/features/DealManagement/DealList';

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="container mx-auto py-8">
        <DealList />
      </div>
    </main>
  );
} 