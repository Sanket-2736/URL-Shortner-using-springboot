import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../services/auth';
import { Button } from './ui/Button';
import {
  Link as LinkIcon,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Plus,
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/create', label: 'Create URL', icon: Plus },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-md-soft">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 hidden sm:inline">
              URLShort
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  flex items-center gap-2
                  ${
                    isActive(path)
                      ? 'gradient-primary text-white shadow-md-soft'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={LogOut}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-200 mt-4 animate-slide-in-up">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200
                  flex items-center gap-2
                  ${
                    isActive(path)
                      ? 'gradient-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
