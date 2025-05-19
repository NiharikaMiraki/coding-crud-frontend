export interface Deal {
  _id?: string;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
} 