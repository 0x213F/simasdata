import { getGradientColors } from './utils';

interface Project {
  id: string;
  name: string;
  description: string;
  imgurl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div key={`project-${project.id}-${index}`} className="card rounded-lg overflow-hidden">
      {project.imgurl ? (
        <div className="h-80 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${project.imgurl})` }}>
        </div>
      ) : (
        <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-medium mb-4">{project.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
}