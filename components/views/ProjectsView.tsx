'use client'

import { useProjectStore } from '../../lib/store'

export default function ProjectsView() {
  const { projects, loading, error, refetchProjects } = useProjectStore()

  const getGradientColors = (index: number) => {
    const gradients = [
      'from-blue-100 to-blue-200',
      'from-purple-100 to-purple-200',
      'from-green-100 to-green-200',
      'from-orange-100 to-orange-200',
      'from-pink-100 to-pink-200',
      'from-teal-100 to-teal-200',
      'from-indigo-100 to-indigo-200',
      'from-red-100 to-red-200',
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="min-h-screen">

      {/* Projects Grid */}
      <div className="pt-8 px-8">
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
                <div key={`project-${project.id}-${index}`} className="card rounded-lg overflow-hidden">
                  {project.image_url ? (
                    <div className="h-80 bg-cover bg-center bg-no-repeat"
                         style={{ backgroundImage: `url(${project.image_url})` }}>
                    </div>
                  ) : (
                    <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-medium mb-2">{project.name}</h3>
                    <p className="text-gray-600 mb-4">{project.medium}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}