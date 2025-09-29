import ArtSummaryDetail from '@/components/shared/ArtSummaryDetail';
import { ArtSummaryWithDetails } from '@/lib/supabase';

interface ProjectDetailProps {
  project: ArtSummaryWithDetails;
  onClose?: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <ArtSummaryDetail
      artSummary={project}
      type="project"
      onClose={onClose}
    />
  );
}