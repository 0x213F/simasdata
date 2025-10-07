'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getArtSummaryName } from '@/lib/supabase';
import ArtSummaryModal from '../../shared/ArtSummaryModal';
import FloatingActionButtons from '@/components/shared/FloatingActionButtons';
import { getGalleryComponent } from '../gallery-themes';

export default function ProjectsView() {
  const router = useRouter()
  const { loading, error, fetchArtSummaries, deleteArtSummary, hasHydrated } = useArtSummaryStore()
  const artSummaries = useArtSummaryStore(state => state.artSummaries)
  const projects = artSummaries.filter(item => item.type === 'project')
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'clone'>('create')

  const selectedProject = selectedProjectId ? projects.find(p => p.uuid === selectedProjectId) : null

  // Fetch art summaries on component mount
  useEffect(() => {
    fetchArtSummaries()
  }, [fetchArtSummaries])

  const handleProjectClick = (projectId: string) => {
    const project = projects.find(p => p.uuid === projectId)
    if (!project) return

    if (user) {
      // User is logged in
      if (selectedProjectId === projectId) {
        // Project is already selected - navigate to detail view
        router.push(`/projects/${project.slug}`)
      } else {
        // Project is not selected - make it selected and return early
        setSelectedProjectId(projectId)
        return
      }
    } else {
      // User is not logged in - navigate immediately to detail view
      router.push(`/projects/${project.slug}`)
    }
  }

  // Get the configured gallery component (theme is set in gallery-themes/theme-config.ts)
  const GalleryComponent = getGalleryComponent();

  return (
    <>
      <div className="min-h-screen bg-surface transition-theme">
        {/* Gallery (theme controlled by gallery-themes/theme-config.ts) */}
        <GalleryComponent
          items={projects}
          type="project"
          onItemClick={handleProjectClick}
          selectedItemId={selectedProjectId}
          loading={loading}
          hasHydrated={hasHydrated}
        />
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
            await deleteArtSummary(selectedProject.uuid);
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
        }}
        mode={modalMode}
        type="project"
        item={selectedProject}
      />
    </>
  );
}