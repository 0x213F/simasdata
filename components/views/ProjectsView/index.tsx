'use client';

import { useState, useEffect } from 'react';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getArtSummaryName } from '@/lib/supabase';
import ArtSummaryModal from '../../shared/ArtSummaryModal';
import FloatingActionButtons from '../HomeView/FloatingActionButtons';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import DetailViewTransition from '../../DetailViewTransition';

export default function ProjectsView() {
  const { loading, error, fetchArtSummaries, refetchArtSummaries, deleteProject, hasHydrated } = useArtSummaryStore()
  const artSummaries = useArtSummaryStore(state => state.artSummaries)
  const projects = artSummaries.filter(item => item.type === 'project')
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'clone'>('create')
  const [showDetailView, setShowDetailView] = useState(false)

  const selectedProject = selectedProjectId ? projects.find(p => p.uuid === selectedProjectId) : null

  // Fetch art summaries on component mount
  useEffect(() => {
    fetchArtSummaries()
  }, [fetchArtSummaries])

  // Debug: Log the data we're getting
  useEffect(() => {
    console.log('ProjectsView - All artSummaries:', useArtSummaryStore.getState().artSummaries)
    console.log('ProjectsView - Filtered projects:', projects)
  }, [projects])

  const handleProjectClick = (projectId: string) => {
    if (user) {
      // User is logged in
      if (selectedProjectId === projectId) {
        // Project is already selected - take them to detail view
        setShowDetailView(true)
      } else {
        // Project is not selected - make it selected and return early
        setSelectedProjectId(projectId)
        return
      }
    } else {
      // User is not logged in - take them immediately to detail view
      setSelectedProjectId(projectId)
      setShowDetailView(true)
    }
  }

  const handleCloseDetailView = () => {
    setShowDetailView(false)
    // Keep the selected project for logged-in users, clear for non-logged-in users
    if (!user) {
      setSelectedProjectId(null)
    }
  }

  // Wrap the entire component with transition
  return (
    <>
      <DetailViewTransition isActive={showDetailView}>
        {showDetailView && selectedProject && (
          <ProjectDetail project={selectedProject} onClose={handleCloseDetailView} />
        )}
      </DetailViewTransition>

      {/* Main projects view - hidden when detail view is active */}
      {!showDetailView && (
        <>
          <div className="min-h-screen bg-surface transition-theme">

        {/* Projects Grid */}
        <div className="px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : !hasHydrated && projects.length === 0 ? (
              // Only show empty state during hydration if we have no data
              <div></div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 mb-4">
                  Error loading projects: {error}
                </div>
                <button
                  onClick={refetchArtSummaries}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              // Show nothing when there are no projects - completely empty
              <div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={`project-${project.uuid}-${index}`}
                    project={project}
                    index={index}
                    onClick={handleProjectClick}
                    isSelected={selectedProjectId === project.uuid}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onAdd={() => {
          setModalMode('create')
          setIsModalOpen(true)
        }}
        onCopy={() => {
          if (selectedProject) {
            setModalMode('clone')
            setIsModalOpen(true)
          }
        }}
        onEdit={() => {
          if (selectedProject) {
            setModalMode('edit')
            setIsModalOpen(true)
          }
        }}
        onDelete={async () => {
          if (!selectedProject) {
            alert('Please select a project to delete');
            return;
          }

          if (window.confirm(`Are you sure you want to delete "${getArtSummaryName(selectedProject)}"? This action cannot be undone.`)) {
            await deleteProject(selectedProject.uuid);
            setSelectedProjectId(null); // Clear selection after deletion
          }
        }}
        onAdmin={() => {
          window.open('/admin-portal', '_blank');
        }}
        disabledButtons={{
          copy: !selectedProject, // Enable copy when a project is selected
          edit: !selectedProject, // Enable edit when a project is selected
          delete: !selectedProject // Enable delete when a project is selected
        }}
      />

      {/* Add Project Modal */}
      <ArtSummaryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProjectId(null) // Clear selection when modal closes
          setShowDetailView(false) // Also close detail view
        }}
        mode={modalMode}
        type="project"
        item={selectedProject}
      />
        </>
      )}
    </>
  );
}