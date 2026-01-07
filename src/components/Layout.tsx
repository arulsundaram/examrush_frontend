import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Trophy,
  Award,
  MessageSquare,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: BookOpen, label: 'Catalog', path: '/catalog' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: Award, label: 'Certification', path: '/certification' },
    { icon: MessageSquare, label: 'AI Mentor', path: '/ai-mentor' },
  ];

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 'Home';
    if (path.startsWith('/catalog')) return 'Catalog';
    if (path.startsWith('/videos')) return 'Video';
    if (path.startsWith('/achievements')) return 'Achievements';
    if (path.startsWith('/certification')) return 'Certification';
    if (path.startsWith('/ai-mentor')) return 'AI Mentor';
    if (path.startsWith('/exams')) return 'Tutor Mode';
    return 'AI Learning';
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Single Horizontal Header Section */}
      <header className="bg-white px-6 py-4 flex items-center justify-between gap-6">
        {/* LHS: Menu Section */}
        <div className="flex items-center gap-6">
          {/* AI Learning Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-base">AI</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">AI Learning</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/home' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-light transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                  }`}
                  style={{ letterSpacing: '0.3px' }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RHS: User Profile Section */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area - Filters and Cards */}
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <div className="w-full h-full">{children}</div>
      </main>
    </div>
  );
}

