'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import AddProjectModal from './AddProjectModal';
import FloatingAddButton from './FloatingAddButton';
import ProjectCard from './ProjectCard';

export default function ProjectsView() {
  const { projects, loading, error, refetchProjects } = useProjectStore()
  const [isModalOpen, setIsModalOpen] = useState(false)


  return (
    <>
      <div className="min-h-screen">

        {/* Projects Grid */}
        <div className="px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 mb-4">
                  Error loading projects: {error}
                </div>
                <button
                  onClick={refetchProjects}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No active projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map((project, index) => (
                  <ProjectCard key={`project-${project.id}-${index}`} project={project} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onOpenModal={() => setIsModalOpen(true)} />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}