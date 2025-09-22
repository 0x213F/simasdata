import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface FloatingActionButtonsProps {
  isMobileLandscape?: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAdmin: () => void;
}

export default function FloatingActionButtons({
  isMobileLandscape,
  onAdd,
  onEdit,
  onDelete,
  onAdmin
}: FloatingActionButtonsProps) {
  const { user } = useAuthStore();

  if (!user || isMobileLandscape) return null;

  return (
    <div className="absolute bottom-6 right-6 flex flex-row gap-3 z-50 bg-green-100 p-3 rounded-lg shadow-sm">
      {/* Admin Button */}
      <button
        onClick={onAdmin}
        className="px-4 py-3 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 hover:shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
        title="Admin login"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="px-4 py-3 bg-red-400 text-white rounded-md shadow-sm hover:bg-red-500 hover:shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
        title="Delete current post"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="px-4 py-3 bg-amber-400 text-white rounded-md shadow-sm hover:bg-amber-500 hover:shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
        title="Edit current post"
      >
        <Edit className="w-4 h-4" />
      </button>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="px-4 py-3 bg-blue-400 text-white rounded-md shadow-sm hover:bg-blue-500 hover:shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
        title="Add new post"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}