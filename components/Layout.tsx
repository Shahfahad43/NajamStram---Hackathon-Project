import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, MonitorPlay, Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import Button from './Button';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Live Streams', path: '/streams', icon: <MonitorPlay className="w-4 h-4 mr-2" /> },
    { label: 'Match Schedule', path: '/schedule', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { label: 'Creator Hub', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                {/* Redesigned Logo */}
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-tr from-saudi-dark to-saudi-green rounded-xl shadow-md flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300 border border-saudi-light/20">
                     {/* Optical alignment: ml-0.5 pushes play button slightly right to look centered */}
                     <svg className="w-4 h-4 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                       <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                  </div>
                  {/* Star Accent */}
                  <div className="absolute -top-1.5 -right-1.5 bg-white dark:bg-gray-900 rounded-full p-0.5">
                    <svg className="w-4 h-4 text-gold fill-current animate-pulse" viewBox="0 0 24 24">
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                    </svg>
                  </div>
                </div>
                
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white flex flex-col leading-none">
                  <span>Najam<span className="text-saudi-green">Stream</span></span>
                </span>
              </Link>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-saudi-green text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-200" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 mr-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'bg-saudi-green/10 border-saudi-green text-saudi-green'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800'
                    }`
                  }
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.label}
                  </div>
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-4 space-x-3">
                 {user ? (
                   <Button onClick={handleLogout} variant="ghost" className="w-full justify-center">Log Out ({user.name})</Button>
                 ) : (
                   <>
                    <Button onClick={() => navigate('/login')} variant="ghost" className="w-full justify-center">Log In</Button>
                    <Button onClick={() => navigate('/signup')} variant="primary" className="w-full justify-center">Sign Up</Button>
                   </>
                 )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6 md:order-2">
               <Link to="/privacy" className="text-gray-400 hover:text-gray-500">Privacy</Link>
               <Link to="/terms" className="text-gray-400 hover:text-gray-500">Terms</Link>
               <a 
                 href="https://www.linkedin.com/in/shah-fahad-344aaa285/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-gray-500"
               >
                 Contact
               </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} NajamStream.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;