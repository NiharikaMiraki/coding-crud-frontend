import { Lead } from '@/types/lead';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  let lead: Lead | null = null;
  let error: string | null = null;
  try {
    const headersList = await headers(); // headers() is synchronous
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const res = await fetch(`${baseUrl}/api/leads/${params.id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Lead not found');
    lead = await res.json();
  } catch (err: any) {
    error = err.message || 'Failed to fetch lead';
  }

  if (error) {
    return <div className="max-w-4xl mx-auto mt-12 text-center text-red-600">{error}</div>;
  }
  if (!lead) {
    notFound();
  }

  // Helper for avatar initials
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white border border-[#E5E7EB] rounded-2xl shadow p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#2A4759] text-3xl font-bold shadow-sm">
          {getInitials(lead.name)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#2A4759] mb-1">{lead.name}</h1>
          <div className="text-base text-[#2A4759]/70 mb-1">{lead.company}</div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#2A4759]">
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
        <div>
          <div className="text-xs text-[#2A4759]/70 mb-1">Email</div>
          <div className="text-base text-[#2A4759]">{lead.email}</div>
        </div>
        <div>
          <div className="text-xs text-[#2A4759]/70 mb-1">Phone</div>
          <div className="text-base text-[#2A4759]">{lead.phone}</div>
        </div>
        <div>
          <div className="text-xs text-[#2A4759]/70 mb-1">Created At</div>
          <div className="text-base text-[#2A4759]">{new Date(lead.createdAt).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-[#2A4759]/70 mb-1">Last Updated</div>
          <div className="text-base text-[#2A4759]">{new Date(lead.updatedAt).toLocaleString()}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs text-[#2A4759]/70 mb-1">Notes</div>
          <div className="text-base text-[#2A4759] whitespace-pre-line">{lead.notes || '-'}</div>
        </div>
      </div>
    </div>
  );
} 