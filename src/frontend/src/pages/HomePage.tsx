import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const parallaxSpeed = 0.4;
        heroRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const properties = [
    {
      id: 'schwarzwaldblick',
      title: t('property.schwarzwaldblick.title'),
      description: t('home.property.schwarzwaldblick.desc'),
      image: '/assets/generated/wellness-spa.dim_1200x800.jpg',
      path: '/domizile/schwarzwaldblick',
    },
    {
      id: 'forsthaus',
      title: t('property.forsthaus.title'),
      description: t('home.property.forsthaus.desc'),
      image: '/assets/generated/forsthaus-hirschgrund.dim_1200x800.jpg',
      path: '/domizile/forsthaus-hirschgrund',
    },
    {
      id: 'fichtenberg',
      title: t('property.fichtenberg.title'),
      description: t('home.property.fichtenberg.desc'),
      image: '/assets/generated/domizil-fichtenberg.dim_1200x800.jpg',
      path: '/domizile/fichtenberg',
    },
    {
      id: 'waldhaus',
      title: t('property.waldhaus.title'),
      description: t('home.property.waldhaus.desc'),
      image: '/assets/generated/waldhaus-tannenhof.dim_1200x800.jpg',
      path: '/domizile/waldhaus-tannenhof',
    },
  ];

  const reviews = [
    {
      text: t('home.review1.text'),
      author: t('home.review1.author'),
      location: t('home.review1.location'),
    },
    {
      text: t('home.review2.text'),
      author: t('home.review2.author'),
      location: t('home.review2.location'),
    },
    {
      text: t('home.review3.text'),
      author: t('home.review3.author'),
      location: t('home.review3.location'),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Cinematic Hero Section with Parallax */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
        <div
          ref={heroRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url('/assets/generated/black-forest-hero.dim_1920x1080.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 container text-center space-y-8 md:space-y-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-semibold text-white drop-shadow-2xl animate-fade-in-up tracking-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white drop-shadow-xl max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light">
            {t('home.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Introductory Text Section */}
      <section className="py-24 md:py-32 lg:py-40 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-center mb-16 md:mb-20 tracking-tight animate-fade-in-up">
              {t('home.intro.title')}
            </h2>
            <div className="space-y-8 md:space-y-10 text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
              <p className="animate-fade-in-up delay-200">
                {t('home.intro.p1')}
              </p>
              <p className="animate-fade-in-up delay-400">
                {t('home.intro.p2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Properties Section - Magazine Layout with Light Design */}
      <section className="py-24 md:py-32 lg:py-40 bg-muted/20">
        <div className="container">
          <div className="text-center mb-20 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6 md:mb-8 tracking-tight animate-fade-in-up">
              {t('home.properties.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light animate-fade-in-up delay-200">
              {t('home.properties.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {properties.map((property, index) => (
              <Card
                key={property.id}
                className={`overflow-hidden group border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-elegant-2xl hover:-translate-y-2 animate-fade-in-up delay-${(index + 1) * 200} bg-white`}
              >
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover image-zoom"
                    loading="lazy"
                  />
                </div>
                <CardHeader className="space-y-4 md:space-y-6 pt-8 md:pt-10 pb-6 md:pb-8">
                  <CardTitle className="text-2xl md:text-3xl font-serif tracking-tight font-semibold">
                    {property.title}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg leading-relaxed text-foreground/80 font-light">
                    {property.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 md:pb-10">
                  <Button 
                    asChild 
                    className="luxury-property-button w-full group/btn transition-all duration-500 py-6 md:py-7 text-base font-semibold bg-forest-green text-cream hover:bg-forest-green/90 hover:shadow-elegant-lg focus-visible:ring-2 focus-visible:ring-forest-green focus-visible:ring-offset-2"
                  >
                    <Link to={property.path}>
                      {t('home.property.learnmore')}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-500" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Teaser Section */}
      <section className="py-24 md:py-32 lg:py-40 bg-background">
        <div className="container">
          <div className="text-center mb-20 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold tracking-tight animate-fade-in-up">
              {t('home.reviews.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <Card 
                key={index} 
                className={`border-border/50 hover:shadow-elegant-xl transition-all duration-500 hover:border-primary/20 hover:-translate-y-1 animate-fade-in-up delay-${(index + 1) * 200} bg-white`}
              >
                <CardHeader className="space-y-6 md:space-y-8 pb-6 md:pb-8">
                  <Quote className="h-10 w-10 md:h-12 md:w-12 text-primary/20 mb-2 md:mb-4" aria-hidden="true" />
                  <CardDescription className="text-base md:text-lg leading-relaxed text-foreground/80 italic font-light">
                    "{review.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6 border-t border-border/50">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground text-base md:text-lg">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-16 md:mt-20 animate-fade-in-up delay-600">
            <Button 
              asChild 
              className="luxury-secondary-button transition-all duration-500 hover:-translate-y-1 shadow-soft hover:shadow-elegant-lg px-8 md:px-10 py-6 md:py-7 text-base font-semibold bg-cream text-forest-green border-2 border-forest-green hover:bg-forest-green hover:text-cream focus-visible:ring-2 focus-visible:ring-forest-green focus-visible:ring-offset-2"
            >
              <Link to="/bewertungen">
                {t('home.reviews.cta')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section className="py-24 md:py-32 lg:py-40 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container text-center space-y-10 md:space-y-12 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold max-w-5xl mx-auto leading-tight tracking-tight animate-fade-in-up">
            {t('home.contact.title')}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-95 leading-relaxed font-light animate-fade-in-up delay-200">
            {t('home.contact.text')}
          </p>
          <div className="pt-6 md:pt-8 animate-fade-in-up delay-400">
            <Button 
              size="lg" 
              asChild 
              className="luxury-cta-inverted text-base md:text-lg px-10 md:px-12 py-6 md:py-8 shadow-elegant-xl hover:shadow-elegant-2xl transition-all duration-500 hover:-translate-y-1 bg-cream text-forest-green hover:bg-cream/90 font-semibold focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
            >
              <Link to="/verfuegbarkeit">
                {t('home.contact.cta')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
