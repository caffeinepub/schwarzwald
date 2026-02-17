import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  navItems: Array<{ path: string; label: string }>;
  properties: Array<{ path: string; label: string }>;
  domizileLabel: string;
  homeLabel: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  currentPath,
  navItems,
  properties,
  domizileLabel,
  homeLabel,
}: MobileMenuProps) {
  const [isDomizileOpen, setIsDomizileOpen] = useState(false);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      
      return () => {
        // Restore original overflow
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.style.top = '';
      };
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    setIsDomizileOpen(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ease-out"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Off-canvas menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full h-full bg-[#FAFAF5] z-[9999] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-sm opacity-70 ring-offset-white transition-all duration-300 hover:opacity-100 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
          aria-label="Menü schließen"
        >
          <X className="h-6 w-6 text-foreground" />
        </button>

        {/* Navigation content */}
        <nav className="h-full overflow-y-auto px-6 py-20">
          <ul className="flex flex-col space-y-6">
            {/* Home link */}
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className={`block text-lg font-medium transition-all duration-300 hover:text-primary hover:translate-x-1 ${
                  currentPath === '/' ? 'text-primary' : 'text-foreground'
                }`}
              >
                {homeLabel}
              </Link>
            </li>

            {/* Domizile accordion */}
            <li>
              <button
                onClick={() => setIsDomizileOpen(!isDomizileOpen)}
                className="flex items-center justify-between w-full text-lg font-medium text-foreground hover:text-primary transition-all duration-300"
                aria-expanded={isDomizileOpen}
              >
                <span>{domizileLabel}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isDomizileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {/* Domizile submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isDomizileOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="flex flex-col space-y-4 pl-4">
                  {properties.map((property) => (
                    <li key={property.path}>
                      <Link
                        to={property.path}
                        onClick={handleLinkClick}
                        className={`block text-base transition-all duration-300 hover:text-primary hover:translate-x-1 ${
                          currentPath === property.path
                            ? 'text-primary'
                            : 'text-foreground'
                        }`}
                      >
                        {property.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Other navigation items */}
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`block text-lg font-medium transition-all duration-300 hover:text-primary hover:translate-x-1 ${
                    currentPath === item.path
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
