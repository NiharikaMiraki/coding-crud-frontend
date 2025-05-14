import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../_db';
import { ObjectId } from 'mongodb';
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
  const { id } = req.query;

  if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid or missing id' });
  }

  if (req.method === 'GET') {
    const lead = await collection.findOne({ _id: new ObjectId(id) });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    return res.status(200).json(lead);
  }

  if (req.method === 'PUT') {
    const parse = leadSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }
    const update = {
      ...parse.data,
      updatedAt: new Date().toISOString(),
    };
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Lead not found' });
    return res.status(200).json({ ...update, _id: id });
  }

  if (req.method === 'DELETE') {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Lead not found' });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 