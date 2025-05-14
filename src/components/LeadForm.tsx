import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead } from '@/types/lead';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^?\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (lead: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
      notes: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: lead.status,
        notes: lead.notes || '',
      });
    }
  }, [lead, reset]);

  const onSubmitForm = async (data: LeadFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#DDDDDD] rounded-xl shadow-lg w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-[#EEEEEE] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#EEEEEE] flex items-center justify-center text-[#2A4759] text-2xl font-bold">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#b0c4d4"/><rect x="4" y="16" width="16" height="6" rx="3" fill="#b0c4d4"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2A4759]">{lead ? 'Edit Lead' : 'Add Lead'}</h2>
            <div className="text-xs text-[#2A4759]/70">Contact Information</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-medium text-[#2A4759] bg-white border border-[#DDDDDD] rounded hover:bg-[#EEEEEE] transition"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="lead-form"
            disabled={submitting}
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#F79B72] rounded hover:bg-[#2A4759] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : lead ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
      {/* Form Body */}
      <form id="lead-form" onSubmit={handleSubmit(onSubmitForm)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-[#2A4759] mb-1">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="name"
                className={`w-full px-3 py-2 rounded border ${errors.name ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter full name"
              />
            )}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#2A4759] mb-1">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                id="email"
                className={`w-full px-3 py-2 rounded border ${errors.email ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter email address"
              />
            )}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-[#2A4759] mb-1">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                id="phone"
                className={`w-full px-3 py-2 rounded border ${errors.phone ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter phone number"
              />
            )}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="company" className="block text-xs font-semibold text-[#2A4759] mb-1">Company</label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="company"
                className={`w-full px-3 py-2 rounded border ${errors.company ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter company name"
              />
            )}
          />
          {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company.message}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-semibold text-[#2A4759] mb-1">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="status"
                className="w-full px-3 py-2 rounded border border-[#DDDDDD] bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-xs font-semibold text-[#2A4759] mb-1">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="notes"
                rows={2}
                className={`w-full px-3 py-2 rounded border ${errors.notes ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter any additional notes"
              />
            )}
          />
          {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>}
        </div>
        {submitError && <div className="md:col-span-2 text-red-600 text-sm mt-2">{submitError}</div>}
      </form>
    </div>
  );
} 