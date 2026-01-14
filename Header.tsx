import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="w-6 h-6" />
            <span className="font-heading text-xl font-semibold">CampusConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-sm transition-opacity ${
                isActive('/') ? 'opacity-100 font-semibold' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className={`font-paragraph text-sm transition-opacity ${
                isActive('/profile') ? 'opacity-100 font-semibold' : 'opacity-80 hover:opacity-100'
              }`}
            >
              My Profile
            </Link>
            <Link
              to="/applications"
              className={`font-paragraph text-sm transition-opacity ${
                isActive('/applications') ? 'opacity-100 font-semibold' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Applications
            </Link>
            <Link
              to="/feedback"
              className={`font-paragraph text-sm transition-opacity ${
                isActive('/feedback') ? 'opacity-100 font-semibold' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Feedback
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded hover:opacity-90 transition-opacity"
            >
              <User className="w-4 h-4" />
              <span className="font-paragraph text-sm font-medium">Account</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-foreground/20">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-sm transition-opacity ${
                  isActive('/') ? 'opacity-100 font-semibold' : 'opacity-80'
                }`}
              >
                Opportunities
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-sm transition-opacity ${
                  isActive('/profile') ? 'opacity-100 font-semibold' : 'opacity-80'
                }`}
              >
                My Profile
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-sm transition-opacity ${
                  isActive('/applications') ? 'opacity-100 font-semibold' : 'opacity-80'
                }`}
              >
                Applications
              </Link>
              <Link
                to="/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-sm transition-opacity ${
                  isActive('/feedback') ? 'opacity-100 font-semibold' : 'opacity-80'
                }`}
              >
                Feedback
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
