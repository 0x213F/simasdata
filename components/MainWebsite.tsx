'use client'

// Import view components
import HomeView from './views/HomeView';
import ProjectsView from './views/ProjectsView';
import ArtistsView from './views/ArtistsView';

interface MainWebsiteProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isMobileLandscape?: boolean;
}

export default function MainWebsite({ currentRoute, onNavigate, isMobileLandscape = false }: MainWebsiteProps) {
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView isMobileLandscape={isMobileLandscape} />;
      case 'projects':
        return <ProjectsView />;
      case 'artists':
        return <ArtistsView />;
      default:
        return <HomeView isMobileLandscape={isMobileLandscape} />;
    }
  };

  return (
    <main 
      className={
        isMobileLandscape 
          ? "fixed inset-0 overflow-auto" 
          : "fixed top-20 bottom-20 left-0 right-0 overflow-auto"
      }
    >
      <div className="transition-opacity duration-300 h-full">
        {renderCurrentView()}
      </div>
    </main>
  );
}