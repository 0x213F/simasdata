'use client'

import { usePathname } from 'next/navigation';
import { TrackedLink } from '@/lib/navigation-provider';
import ThemeToggle from './ThemeToggle';
import { THEME_CONFIG } from '@/lib/theme-config';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (routeId: string) => void;
}

export default function Header({ currentRoute, onNavigate }: HeaderProps) {
  const pathname = usePathname();
  const navigation = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'artists', label: 'Artists', href: '/artists' }
  ];

  // Determine active route based on pathname
  const getActiveRoute = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/projects')) return 'projects';
    if (pathname.startsWith('/artists')) return 'artists';
    return currentRoute;
  };

  const activeRoute = getActiveRoute();

  const headerStyle = `
    @media (max-width: 767px) {
      .header-container {
        justify-content: center !important;
        padding: 0 20px !important;
      }
      .main-logo {
        display: none !important;
      }
      .nav-list {
        gap: 32px !important;
      }
      .theme-toggle-container {
        display: none !important;
      }
    }
    @media (min-width: 768px) {
      .header-container {
        justify-content: space-between !important;
      }
      .main-nav {
        margin-left: auto;
        margin-right: 20px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: headerStyle }} />
      <div
        id="header"
        className="fixed top-0 left-0 w-full z-40 header-container bg-surface-secondary/95 dark:bg-surface-elevated/95 backdrop-blur-md transition-theme"
        style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px'
        }}
      >
        {/* Logo - Main Logo */}
        <div className="main-logo">
        </div>

      {/* Navigation - Main Nav */}
      <nav className="main-nav">
        <ul
          className="nav-list"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          {navigation.map((item) => (
            <li key={item.id} style={{ margin: 0 }}>
              <TrackedLink
                href={item.href}
                className={`underline-right-to-left ${activeRoute === item.id ? 'active' : ''} text-text-primary dark:text-text-primary hover:text-text-primary/70 dark:hover:text-text-primary/70 transition-theme`}
                style={{
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  transition: 'var(--transition)',
                  padding: '10px 0',
                  position: 'relative',
                  display: 'block'
                }}
              >
                <span className={`nav-text ${item.id === 'home' ? 'lift-right' : 'lift-left'}`}>
                  {item.label}
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme Toggle - Controlled by THEME_CONFIG.SHOW_THEME_TOGGLE */}
      <div className="theme-toggle-container flex items-center">
        {THEME_CONFIG.SHOW_THEME_TOGGLE && <ThemeToggle variant="minimal" />}
      </div>
      </div>
    </>
  );
}