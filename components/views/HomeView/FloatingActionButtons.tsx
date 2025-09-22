import { Plus, Edit, Trash2, Settings, CopyPlus } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface FloatingActionButtonsProps {
  isMobileLandscape?: boolean;
  onAdd: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAdmin: () => void;
  disabledButtons?: {
    copy?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
}

export default function FloatingActionButtons({
  isMobileLandscape,
  onAdd,
  onCopy,
  onEdit,
  onDelete,
  onAdmin,
  disabledButtons = {}
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
        onClick={disabledButtons.delete ? undefined : onDelete}
        disabled={disabledButtons.delete}
        className={`px-4 py-3 rounded-md shadow-sm flex items-center justify-center transition-all duration-200 ${
          disabledButtons.delete
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-400 text-white hover:bg-red-500 hover:shadow-md cursor-pointer'
        }`}
        title={disabledButtons.delete ? "Delete (disabled)" : "Delete current post"}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Edit Button */}
      <button
        onClick={disabledButtons.edit ? undefined : onEdit}
        disabled={disabledButtons.edit}
        className={`px-4 py-3 rounded-md shadow-sm flex items-center justify-center transition-all duration-200 ${
          disabledButtons.edit
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-amber-400 text-white hover:bg-amber-500 hover:shadow-md cursor-pointer'
        }`}
        title={disabledButtons.edit ? "Edit (disabled)" : "Edit current post"}
      >
        <Edit className="w-4 h-4" />
      </button>

      {/* Copy Button */}
      <button
        onClick={disabledButtons.copy ? undefined : onCopy}
        disabled={disabledButtons.copy}
        className={`px-4 py-3 rounded-md shadow-sm flex items-center justify-center transition-all duration-200 ${
          disabledButtons.copy
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-400 text-white hover:bg-green-500 hover:shadow-md cursor-pointer'
        }`}
        title={disabledButtons.copy ? "Copy (disabled)" : "Copy current post to create new"}
      >
        <CopyPlus className="w-4 h-4" />
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