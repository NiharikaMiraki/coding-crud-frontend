import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Deal } from '@/types/deals';

const dealSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(50, 'Title must be less than 50 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  status: z.enum(['active', 'pending', 'completed']),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal: Deal | null;
  onSubmit: (id: string | undefined, deal: Omit<Deal, '_id'>) => void;
  onClose: () => void;
}

export default function DealForm({ deal, onSubmit, onClose }: DealFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      status: 'active',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title,
        description: deal.description,
        price: deal.price,
        status: deal.status as 'active' | 'pending' | 'completed',
      });
    }
  }, [deal, reset]);

  const onSubmitForm = async (data: DealFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(deal?._id, data);
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
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#b0c4d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2A4759]">{deal ? 'Edit Deal' : 'Add Deal'}</h2>
            <div className="text-xs text-[#2A4759]/70">Deal Information</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium text-[#2A4759] bg-white border border-[#DDDDDD] rounded hover:bg-[#EEEEEE] transition"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="deal-form"
            disabled={submitting}
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#F79B72] rounded hover:bg-[#2A4759] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : deal ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
      {/* Form Body */}
      <form id="deal-form" onSubmit={handleSubmit(onSubmitForm)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-[#2A4759] mb-1">Title</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="title"
                className={`w-full px-3 py-2 rounded border ${errors.title ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter deal title"
              />
            )}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="price" className="block text-xs font-semibold text-[#2A4759] mb-1">Price</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="price"
                className={`w-full px-3 py-2 rounded border ${errors.price ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter price"
                min="0"
                step="1"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-xs font-semibold text-[#2A4759] mb-1">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="description"
                rows={3}
                className={`w-full px-3 py-2 rounded border ${errors.description ? 'border-red-500' : 'border-[#DDDDDD]'} bg-[#EEEEEE] text-black text-sm focus:ring-2 focus:ring-[#F79B72] focus:border-transparent transition-colors`}
                placeholder="Enter deal description"
              />
            )}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>
        {submitError && <div className="md:col-span-2 text-red-600 text-sm mt-2">{submitError}</div>}
      </form>
    </div>
  );
} 