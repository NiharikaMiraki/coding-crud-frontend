import { Deal } from '@/types/deals';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const dealsService = {
  async createDeal(deal: Omit<Deal, 'id'>) {
    const response = await fetch(`${API_URL}/deals/addDeals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deal),
    });
    return response.json();
  },

  async getAllDeals() {
    const response = await fetch(`${API_URL}/deals/getAllDeals`);
    return response.json();
  },

  async updateDeal(id: string, deal: Omit<Deal, 'id'>) {
    const response = await fetch(`${API_URL}/deals/updateDeal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deal),
    });
    return response.json();
  },

  async deleteDeal(id: string) {
    const response = await fetch(`${API_URL}/deals/deleteDeal/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
}; 