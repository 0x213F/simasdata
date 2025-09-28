import Link from 'next/link';
import { getGradientColors } from './utils';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface ProjectCardProps {
  project: ArtSummary;
  index: number;
  onClick?: (projectId: string) => void;
  isSelected?: boolean;
}

export default function ProjectCard({ project, index, onClick, isSelected = false }: ProjectCardProps) {
  const content = (
    <div
      key={`project-${project.uuid}-${index}`}
      className={`card rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-4 ring-amber-400' : 'hover:shadow-lg'
      }`}
      onClick={onClick ? () => onClick(project.uuid) : undefined}
    >
      {getArtSummaryImageUrl(project) ? (
        <div className="h-80 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${getArtSummaryImageUrl(project)})` }}>
        </div>
      ) : (
        <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-medium mb-4">{getArtSummaryName(project)}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {getArtSummaryDescription(project)}
        </p>
      </div>
    </div>
  );

  // If onClick is provided (for modal mode), return content directly
  if (onClick) {
    return content;
  }

  // Otherwise, wrap in Link for navigation
  return (
    <Link href={`/projects/${project.slug}`} className="block">
      {content}
    </Link>
  );
}