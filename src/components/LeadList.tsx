import { Lead } from '@/types/lead';
import { format } from 'date-fns';
import Link from 'next/link';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface LeadListProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadList({ leads, onEdit, onDelete }: LeadListProps) {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-[#F79B72] text-white';
      case 'contacted':
        return 'bg-[#2A4759] text-white';
      case 'qualified':
        return 'bg-[#F79B72]/80 text-white';
      case 'lost':
        return 'bg-[#2A4759]/80 text-white';
      default:
        return 'bg-[#EEEEEE] text-[#2A4759]';
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-medium text-[#2A4759] mb-2">No leads found</h3>
        <p className="text-[#2A4759]/80">Get started by adding your first lead.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#DDDDDD]">
          <thead className="bg-[#EEEEEE]">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2A4759] uppercase tracking-wider">
                Contact Info
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2A4759] uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2A4759] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2A4759] uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-[#2A4759] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DDDDDD]">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-[#EEEEEE]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <Link href={`/leads/${lead._id}`} className="text-sm font-medium text-[#2A4759] hover:underline cursor-pointer">
                      {lead.name}
                    </Link>
                    <div className="text-sm text-[#2A4759]/80">{lead.email}</div>
                    <div className="text-sm text-[#2A4759]/80">{lead.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#2A4759]">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2A4759]/80">
                  {format(new Date(lead.updatedAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(lead)}
                    className="text-[#F79B72] hover:text-[#2A4759] mr-4 transition-colors"
                  >
                    <HiPencil className="inline-block w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="text-[#2A4759] hover:text-red-600 transition-colors"
                  >
                      <HiTrash className="inline-block w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 