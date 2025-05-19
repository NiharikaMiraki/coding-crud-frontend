import { Deal } from '@/types/deals';
import { format } from 'date-fns';
import Link from 'next/link';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface DealListProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

export default function DealList({ deals, onEdit, onDelete }: DealListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#F79B72] text-white';
      case 'pending':
        return 'bg-[#2A4759] text-white';
      case 'completed':
        return 'bg-[#F79B72]/80 text-white';
      default:
        return 'bg-[#EEEEEE] text-[#2A4759]';
    }
  };

  if (deals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-medium text-[#2A4759] mb-2">No deals found</h3>
        <p className="text-[#2A4759]/80">Get started by adding your first deal.</p>
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
                Deal Info
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#2A4759] uppercase tracking-wider">
                Price
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
            {deals.map((deal) => (
              <tr key={deal._id} className="hover:bg-[#EEEEEE]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <Link href={`/deals/${deal._id}`} className="text-sm font-medium text-[#2A4759] hover:underline cursor-pointer">
                      {deal.title}
                    </Link>
                    <div className="text-sm text-[#2A4759]/80 max-w-xs truncate">{deal.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#2A4759]">₹{deal.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(deal.status)}`}>
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2A4759]/80">
                  {deal.updatedAt ? format(new Date(deal.updatedAt), 'MMM d, yyyy') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(deal)}
                    className="text-[#F79B72] hover:text-[#2A4759] mr-4 transition-colors"
                  >
                    <HiPencil className="inline-block w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deal._id && onDelete(deal._id)}
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