'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import AddProjectModal from './AddProjectModal';
import FloatingActionButtons from '../HomeView/FloatingActionButtons';
import ProjectCard from './ProjectCard';

export default function ProjectsView() {
  const { projects, loading, error, refetchProjects, deleteProject } = useProjectStore()
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
                  <ProjectCard key={`project-${project.uuid}-${index}`} project={project} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onAdd={() => setIsModalOpen(true)}
        onCopy={() => {}} // Disabled - no action
        onEdit={() => {}} // Disabled - no action
        onDelete={async () => {
          if (projects.length === 0) {
            alert('No projects to delete');
            return;
          }

          // Create a simple selection dialog
          const projectNames = projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
          const selection = prompt(`Select a project to delete:\n\n${projectNames}\n\nEnter the number (1-${projects.length}):`);

          if (selection) {
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < projects.length) {
              const project = projects[index];
              if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
                await deleteProject(project.uuid);
              }
            } else {
              alert('Invalid selection');
            }
          }
        }}
        onAdmin={() => {
          window.open('/admin-portal', '_blank');
        }}
        disabledButtons={{
          copy: true,
          edit: true,
          delete: false
        }}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}