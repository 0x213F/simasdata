import { Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function FloatingAddButton({
  isMobileLandscape,
  onOpenModal
}: {
  isMobileLandscape?: boolean;
  onOpenModal: () => void;
}) {
  const { user } = useAuthStore();

  if (!user || isMobileLandscape) return null;

  return (
    <button
      onClick={onOpenModal}
      className="fixed bottom-24 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl flex items-center justify-center transition-all duration-200 z-50"
      title="Add new post"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}