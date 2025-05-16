import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Deal, DealStage } from '@/types/deal';

interface DealState {
  items: Deal[];
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
  loading: boolean;
  error: string | null;
}

const initialState: DealState = {
  items: [],
  filters: {
    dateRange: {},
  },
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals: (state, action: PayloadAction<Deal[]>) => {
      state.items = action.payload;
    },
    addDeal: (state, action: PayloadAction<Deal>) => {
      const deal = {
        ...action.payload,
        expectedCloseDate: new Date(action.payload.expectedCloseDate),
        createdAt: new Date(action.payload.createdAt),
        updatedAt: new Date(action.payload.updatedAt),
      };
      state.items.push(deal);
    },
    updateDeal: (state, action: PayloadAction<Deal>) => {
      const index = state.items.findIndex((deal) => deal.id === action.payload.id);
      if (index !== -1) {
        const updatedDeal = {
          ...action.payload,
          expectedCloseDate: new Date(action.payload.expectedCloseDate),
          createdAt: new Date(action.payload.createdAt),
          updatedAt: new Date(action.payload.updatedAt),
        };
        state.items[index] = updatedDeal;
      }
    },
    deleteDeal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((deal) => deal.id !== action.payload);
    },
    setStage: (state, action: PayloadAction<{ id: string; stage: DealStage }>) => {
      const deal = state.items.find((d) => d.id === action.payload.id);
      if (deal) {
        deal.stage = action.payload.stage;
      }
    },
    setFilters: (state, action: PayloadAction<DealState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setDeals,
  addDeal,
  updateDeal,
  deleteDeal,
  setStage,
  setFilters,
  clearFilters,
} = dealSlice.actions;

export default dealSlice.reducer; 