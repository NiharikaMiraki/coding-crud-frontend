export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  title: string;
  description: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: Date;
  customerId: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string[];
  attachments: string[];
  tags: string[];
}

export interface DealState {
  items: Deal[];
  loading: boolean;
  error: string | null;
  filters: {
    stage?: DealStage;
    assignedTo?: string;
    minValue?: number;
    maxValue?: number;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
} 