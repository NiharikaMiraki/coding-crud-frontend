import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../_db';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().min(2).max(100),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  notes: z.string().max(500).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection('leads');

  if (req.method === 'GET') {
    // Fetch all leads
    const leads = await collection.find({}).sort({ updatedAt: -1 }).toArray();
    return res.status(200).json(leads);
  }

  if (req.method === 'POST') {
    // Add a new lead
    const parse = leadSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }
    const lead = {
      ...parse.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await collection.insertOne(lead);
    return res.status(201).json({ ...lead, _id: result.insertedId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 