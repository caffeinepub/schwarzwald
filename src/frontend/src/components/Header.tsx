import { useState, useEffect, useRef } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, ChevronDown } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../backend';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  const properties = [
    { path: '/domizile/waldhaus-tannenhof', label: t('nav.waldhaus') },
    { path: '/domizile/forsthaus-hirschgrund', label: t('nav.forsthaus') },
    { path: '/domizile/fichtenberg', label: t('nav.fichtenberg') },
    { path: '/domizile/schwarzwaldblick', label: t('nav.schwarzwaldblick') },
  ];

  const navItems = [
    { path: '/bewertungen', label: t('nav.reviews') },
    { path: '/verfuegbarkeit', label: t('nav.calendar') },
  ];

  // Check if we're on a page with hero image (Home or Property pages)
  const isHeroPage = currentPath === '/' || currentPath.startsWith('/domizile/');
  const shouldUseWhiteText = isHeroPage && !isScrolled;

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  // Dynamic language button label and dropdown options based on current language
  const languageButtonLabel = language === Language.de ? 'Sprache' : 'Language';
  const languageOptions = language === Language.de 
    ? [
        { value: Language.de, label: 'Deutsch' },
        { value: Language.en, label: 'Englisch' }
      ]
    : [
        { value: Language.en, label: 'English' },
        { value: Language.de, label: 'German' }
      ];

  return (
    <>
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-background/98 backdrop-blur-md border-b border-border/40 shadow-soft'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container flex h-20 lg:h-24 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className={`text-xl md:text-2xl lg:text-3xl font-serif font-semibold transition-all duration-300 ${
              shouldUseWhiteText
                ? 'text-white drop-shadow-lg'
                : 'text-primary'
            } group-hover:opacity-80`}>
              Schwarzwald
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {/* Home Button - Plain text appearance */}
            <Link
              to="/"
              className={`px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 hover:opacity-80 rounded-md ${
                currentPath === '/' 
                  ? shouldUseWhiteText ? 'text-white' : 'text-primary'
                  : shouldUseWhiteText
                  ? 'text-white/90 hover:text-white'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Domizile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    currentPath.startsWith('/domizile')
                      ? shouldUseWhiteText ? 'text-white bg-white/10' : 'text-primary bg-primary/5'
                      : shouldUseWhiteText
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {t('nav.domizile')}
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className={`w-64 shadow-elegant-lg backdrop-blur-md transition-all duration-300 ${
                  shouldUseWhiteText
                    ? 'bg-black/40 border-white/30'
                    : 'bg-background/98 border-border/50'
                }`}
              >
                {properties.map((property) => (
                  <DropdownMenuItem 
                    key={property.path} 
                    asChild
                    className={`transition-all duration-300 ${
                      shouldUseWhiteText
                        ? 'text-white border-b border-white/20 last:border-b-0 hover:bg-white/10 focus:bg-white/10'
                        : 'text-foreground border-b border-border/30 last:border-b-0 hover:bg-primary/5 focus:bg-primary/5'
                    }`}
                  >
                    <Link
                      to={property.path}
                      className="w-full cursor-pointer py-3 px-4 text-base"
                    >
                      {property.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-primary rounded-md whitespace-nowrap ${
                  currentPath === item.path
                    ? shouldUseWhiteText ? 'text-white bg-white/10' : 'text-primary bg-primary/5'
                    : shouldUseWhiteText
                    ? 'text-white/90 hover:text-white'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Dynamic Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className={`px-3 py-2 text-sm font-serif transition-all duration-300 relative group ${
                  shouldUseWhiteText
                    ? 'text-white/90 hover:text-white'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                aria-label="Select language"
                aria-expanded={isLangDropdownOpen}
              >
                <span className="relative">
                  {languageButtonLabel}
                  <span className={`absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${
                    shouldUseWhiteText ? 'bg-white' : 'bg-[#D4AF37]'
                  }`}></span>
                </span>
              </button>

              {/* Language Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg backdrop-blur-md transition-all duration-300 origin-top ${
                  isLangDropdownOpen
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                } ${
                  shouldUseWhiteText
                    ? 'bg-black/40 border border-white/30'
                    : 'bg-background/98 border border-border/50'
                }`}
              >
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLanguageSelect(option.value)}
                    className={`w-full text-left px-4 py-3 text-sm font-serif transition-all duration-300 ${
                      language === option.value
                        ? shouldUseWhiteText
                          ? 'bg-white/20 text-white'
                          : 'bg-primary/10 text-primary'
                        : shouldUseWhiteText
                        ? 'text-white/90 hover:bg-white/10 hover:text-white'
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instagram Link */}
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className={`transition-all duration-300 hover:bg-primary/5 hover:text-primary ${
                shouldUseWhiteText ? 'text-white/90 hover:text-white hover:bg-white/10' : ''
              }`}
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`lg:hidden transition-all duration-300 hover:bg-primary/5 ${
                shouldUseWhiteText ? 'text-white/90 hover:text-white hover:bg-white/10' : ''
              }`}
              onClick={() => setIsOpen(true)}
              aria-label="Menü öffnen"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas Menu */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentPath={currentPath}
        navItems={navItems}
        properties={properties}
        domizileLabel={t('nav.domizile')}
        homeLabel={t('nav.home')}
      />
    </>
  );
}
