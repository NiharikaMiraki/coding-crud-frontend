export interface Deal {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 