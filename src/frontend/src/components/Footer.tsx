import { Link } from '@tanstack/react-router';
import { SiInstagram } from 'react-icons/si';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/20">
      <div className="container py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Contact */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="text-2xl font-serif font-bold text-primary">
              {t('footer.name')}
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {t('footer.tagline')}
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
                <span className="leading-relaxed">{t('footer.address')}</span>
              </p>
              <p className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
                <a href={`tel:${t('footer.phone')}`} className="hover:text-primary transition-colors duration-300">
                  {t('footer.phone')}
                </a>
              </p>
              <p className="flex items-center gap-3 group">
                <Mail className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
                <a href={`mailto:${t('footer.email')}`} className="hover:text-primary transition-colors duration-300">
                  {t('footer.email')}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-semibold">{t('footer.quick')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/bewertungen"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('nav.reviews')}
                </Link>
              </li>
              <li>
                <Link
                  to="/verfuegbarkeit"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('nav.calendar')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-semibold">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('footer.impressum')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
            <div className="pt-4">
              <h4 className="text-lg font-serif font-semibold mb-4">{t('footer.follow')}</h4>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 inline-block hover:scale-110"
                aria-label="Instagram"
              >
                <SiInstagram className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5 flex-wrap">
            {t('footer.copyright')} <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" /> {t('footer.using')}{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-all duration-300 font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
