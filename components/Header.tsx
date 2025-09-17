'use client'

interface HeaderProps {
  currentRoute: string;
  onNavigate: (routeId: string) => void;
}

export default function Header({ currentRoute, onNavigate }: HeaderProps) {
  const navigation = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'artists', label: 'Artists', href: '/artists' }
  ];

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
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: headerStyle }} />
      <div
        id="header"
        className="fixed top-0 left-0 w-full z-30 header-container bg-slate-50/40 backdrop-blur-md"
        style={{
          height: '80px',
          display: 'flex',
          justifyContent: 'space-between',
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
              <button
                onClick={() => onNavigate(item.id)}
                className={currentRoute === item.id ? 'active' : ''}
                style={{
                  color: 'var(--black)',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  transition: 'var(--transition)',
                  padding: '10px 0',
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span className={`nav-text ${item.id === 'home' ? 'lift-right' : 'lift-left'}`}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      </div>
    </>
  );
}