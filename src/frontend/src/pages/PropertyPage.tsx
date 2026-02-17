import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Check, Bed, Users, Home, Wifi, Car, Flame, Trees, Waves, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyPageProps {
  propertyId: 'waldhaus' | 'forsthaus' | 'fichtenberg' | 'schwarzwaldblick';
}

export default function PropertyPage({ propertyId }: PropertyPageProps) {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const parallaxSpeed = 0.3;
        heroRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const propertyData = {
    waldhaus: {
      title: 'Waldhaus Tannenhof',
      subtitle: t('property.subtitle.waldhaus'),
      tagline: t('property.tagline.waldhaus'),
      heroImage: '/assets/generated/waldhaus-tannenhof.dim_1200x800.jpg',
      description: [
        'Das Waldhaus Tannenhof erzählt Geschichten. Geschichten von Förstern, die hier Zuflucht fanden, von Handwerkern, die mit Liebe zum Detail arbeiteten, von Generationen, die diesen Ort prägten. Wir haben diese Seele bewahrt und behutsam in die Gegenwart gebracht. Massive Holzbalken aus heimischen Tannenwäldern, Natursteinfassaden, die Jahrhunderte überdauert haben, und ein Kachelofen, der Wärme spendet – nicht nur dem Raum, sondern auch dem Herzen.',
        'Umgeben von dichtem Wald und mit direktem Zugang zu Wanderwegen bietet das Waldhaus absolute Privatsphäre. Die großzügige Terrasse öffnet sich zu einem Panorama, das jeden Sonnenuntergang zum Ereignis macht. Der private Waldgarten lädt zu morgendlichen Spaziergängen ein, während die Stille der Natur jeden Gedanken zur Ruhe bringt. Hier spürt man, was es bedeutet, anzukommen.',
        'Mit vier Schlafzimmern und Platz für bis zu acht Personen ist das Waldhaus ideal für Familien oder Freunde, die die Schönheit des Schwarzwalds gemeinsam erleben möchten. Hier vereinen sich Authentizität, Komfort und eine Lage, die ihresgleichen sucht.',
      ],
      amenities: [
        { icon: Users, text: '4 Schlafzimmer, 3 Bäder' },
        { icon: Home, text: '180 m² Wohnfläche' },
        { icon: Flame, text: 'Traditioneller Kachelofen' },
        { icon: Trees, text: 'Großzügige Terrasse mit Waldblick' },
        { icon: Waves, text: 'Privater Waldgarten' },
        { icon: Wifi, text: 'Glasfaser-Internet' },
        { icon: Car, text: 'Überdachte Stellplätze' },
        { icon: Check, text: 'Voll ausgestattete Landhausküche' },
        { icon: Check, text: 'Private finnische Sauna' },
        { icon: Check, text: 'Garten-Grillterrasse' },
        { icon: Check, text: 'Waschmaschine & Trockner' },
        { icon: Check, text: 'Premium-Bettwäsche & Handtücher' },
      ],
      capacity: 8,
      minStay: 3,
      location: 'Das Waldhaus liegt eingebettet in einem Mischwald, nur 10 Gehminuten vom Zentrum von Hinterzarten entfernt. Die Anreise erfolgt über die A5 (Ausfahrt Freiburg-Mitte), von dort sind es 35 Minuten Fahrt. Der Bahnhof Hinterzarten ist 2 km entfernt. In unmittelbarer Nähe finden Sie markierte Wanderwege, traditionelle Gasthöfe und kulturelle Highlights wie das Schwarzwälder Freilichtmuseum Vogtsbauernhof.',
      images: [
        '/assets/generated/waldhaus-tannenhof.dim_1200x800.jpg',
        '/assets/generated/mountain-terrace.dim_1200x800.jpg',
        '/assets/generated/luxury-room.dim_1000x667.jpg',
        '/assets/generated/hotel-lobby.dim_1000x667.jpg',
        '/assets/generated/black-forest-hero.dim_1920x1080.jpg',
        '/assets/generated/restaurant-dining.dim_1000x667.jpg',
      ],
    },
    forsthaus: {
      title: 'Forsthaus Hirschgrund',
      subtitle: t('property.subtitle.forsthaus'),
      tagline: t('property.tagline.forsthaus'),
      heroImage: '/assets/generated/forsthaus-hirschgrund.dim_1200x800.jpg',
      description: [
        'Das Forsthaus Hirschgrund ist ein Ort der Ankunft. Gelegen im Herzen des Schwarzwalds, öffnet sich dieses historische Forsthaus zur Landschaft wie ein gemaltes Bild. Wir haben die ursprüngliche Architektur bewahrt und mit zeitgemäßem Wohnkomfort ergänzt. Große Fenster rahmen den Wald, hochwertige Naturmaterialien schaffen Wärme, und jeder Raum erzählt von der Verbindung zwischen Tradition und Moderne.',
        'Der private Wildbeobachtungspunkt ist das Herzstück dieses Refugiums. Hier können Sie direkt vom Haus aus Rehe und Hirsche in ihrer natürlichen Umgebung beobachten, frühmorgens durch den Wald streifen oder einfach die Füße auf der Terrasse baumeln lassen. Die großzügige Waldterrasse mit Liegestühlen lädt zum Verweilen ein – mit einem Buch, einem Glas Wein oder einfach dem Blick in die Baumkronen.',
        'Mit drei Schlafzimmern und Platz für bis zu sechs Personen ist das Forsthaus perfekt für Familien oder kleine Gruppen. Die Kombination aus exklusiver Lage, durchdachter Ausstattung und unmittelbarer Nähe zur Natur macht dieses Domizil zu einem Ort, an den man immer wieder zurückkehren möchte.',
      ],
      amenities: [
        { icon: Users, text: '3 Schlafzimmer, 2 Bäder' },
        { icon: Home, text: '140 m² Wohnfläche' },
        { icon: Flame, text: 'Historischer Kachelofen' },
        { icon: Trees, text: 'Waldterrasse mit Panoramablick' },
        { icon: Waves, text: 'Privater Wildbeobachtungspunkt' },
        { icon: Wifi, text: 'Glasfaser-Internet' },
        { icon: Car, text: 'Parkplatz am Haus' },
        { icon: Check, text: 'Moderne Küche mit Waldblick' },
        { icon: Check, text: 'Garten mit Grillplatz' },
        { icon: Check, text: 'Fernglas inklusive' },
        { icon: Check, text: 'Waschmaschine' },
        { icon: Check, text: 'Premium-Bettwäsche & Handtücher' },
      ],
      capacity: 6,
      minStay: 3,
      location: 'Das Forsthaus liegt mitten im Schwarzwald, etwa 8 km vom Zentrum von Titisee-Neustadt entfernt. Die Anreise erfolgt über die A5 (Ausfahrt Freiburg-Mitte), von dort sind es 40 Minuten Fahrt. Der Bahnhof Titisee ist 8 km entfernt. Die Umgebung bietet zahlreiche Wandermöglichkeiten, darunter der berühmte Feldbergsteig. Restaurants und Einkaufsmöglichkeiten finden Sie in Titisee-Neustadt und Hinterzarten.',
      images: [
        '/assets/generated/forsthaus-hirschgrund.dim_1200x800.jpg',
        '/assets/generated/black-forest-hero.dim_1920x1080.jpg',
        '/assets/generated/luxury-room.dim_1000x667.jpg',
        '/assets/generated/restaurant-dining.dim_1000x667.jpg',
        '/assets/generated/hotel-lobby.dim_1000x667.jpg',
        '/assets/generated/hotel-exterior.dim_1200x800.jpg',
      ],
    },
    fichtenberg: {
      title: 'Domizil Fichtenberg',
      subtitle: t('property.subtitle.fichtenberg'),
      tagline: t('property.tagline.fichtenberg'),
      heroImage: '/assets/generated/domizil-fichtenberg.dim_1200x800.jpg',
      description: [
        'Domizil Fichtenberg ist eine Hommage an die Schönheit der Einfachheit. Klare Linien, raumhohe Fenster und eine von der Natur inspirierte Farbpalette schaffen eine Atmosphäre zeitloser Eleganz. Hier lenkt nichts vom Wesentlichen ab: dem Blick in den Wald, dem Spiel des Lichts zwischen den Bäumen, dem Rhythmus der Jahreszeiten. Architektur wird hier zur Meditation.',
        'Lichtdurchflutete Räume öffnen sich zur Landschaft, eine offene Raumgestaltung schafft Großzügigkeit, und hochwertige Materialien – von Naturstein bis geölter Eiche – sprechen von Qualität und Handwerkskunst. Die großzügige Terrasse mit direktem Waldzugang ist ein Ort der Kontemplation, während die moderne Küche mit Profi-Ausstattung zu kulinarischen Experimenten einlädt. Smart-Home-Technologie sorgt für Komfort, ohne aufdringlich zu sein.',
        'Mit zwei Schlafzimmern und Platz für bis zu vier Personen ist Domizil Fichtenberg ideal für Paare oder kleine Familien, die Wert auf Design, Privatsphäre und eine direkte Verbindung zur Natur legen. Hier erleben Sie den Schwarzwald von seiner zeitgenössischen Seite.',
      ],
      amenities: [
        { icon: Users, text: '2 Schlafzimmer, 2 Bäder' },
        { icon: Home, text: '120 m² Wohnfläche' },
        { icon: Check, text: 'Raumhohe Panoramafenster' },
        { icon: Trees, text: 'Private Waldterrasse' },
        { icon: Waves, text: 'Direkter Waldzugang' },
        { icon: Wifi, text: 'Glasfaser-Internet' },
        { icon: Car, text: 'Überdachter Carport' },
        { icon: Check, text: 'Designer-Küche mit Profi-Ausstattung' },
        { icon: Check, text: 'Smart-Home-System' },
        { icon: Check, text: 'Klimaanlage' },
        { icon: Check, text: 'Waschmaschine & Trockner' },
        { icon: Check, text: 'Premium-Bettwäsche & Handtücher' },
      ],
      capacity: 4,
      minStay: 3,
      location: 'Domizil Fichtenberg liegt in ruhiger Waldlage, etwa 5 km vom Zentrum von Feldberg entfernt. Die Anreise erfolgt über die A5 (Ausfahrt Freiburg-Mitte), von dort sind es 45 Minuten Fahrt. Der Bahnhof Feldberg-Bärental ist 5 km entfernt. In der Umgebung finden Sie exzellente Restaurants, Wanderwege und kulturelle Angebote. Das moderne Badeparadies Schwarzwald ist nur 10 Minuten entfernt.',
      images: [
        '/assets/generated/domizil-fichtenberg.dim_1200x800.jpg',
        '/assets/generated/hotel-lobby.dim_1000x667.jpg',
        '/assets/generated/black-forest-hero.dim_1920x1080.jpg',
        '/assets/generated/mountain-terrace.dim_1200x800.jpg',
        '/assets/generated/hotel-exterior.dim_1200x800.jpg',
        '/assets/generated/restaurant-dining.dim_1000x667.jpg',
      ],
    },
    schwarzwaldblick: {
      title: 'Domizil Schwarzwaldblick',
      subtitle: t('property.subtitle.schwarzwaldblick'),
      tagline: t('property.tagline.schwarzwaldblick'),
      heroImage: '/assets/generated/domizil-schwarzwaldblick.dim_1200x800.jpg',
      description: [
        'Domizil Schwarzwaldblick ist das Kronjuwel unserer Kollektion – ein Ort, der Luxus neu definiert. In erhöhter Lage thront dieses außergewöhnliche Anwesen über den Baumwipfeln und bietet einen Panoramablick, der jeden Moment zu einem Gemälde macht. Hier verschmelzen höchste Qualitätsansprüche mit der Schönheit der Natur zu einem Gesamterlebnis, das alle Sinne berührt.',
        'Besondere Highlights sind die private Sauna mit Waldblick, der beheizte Infinity-Pool, der mit dem Horizont zu verschmelzen scheint, und der großzügige Wellnessbereich. Hochwertige Materialien wie handverlesener Naturstein und edles Holz aus nachhaltiger Forstwirtschaft schaffen eine Atmosphäre zeitloser Eleganz. Die offene Architektur mit raumhohen Fenstern verwischt die Grenzen zwischen Innen und Außen und macht die Landschaft zum integralen Bestandteil des Wohnraums.',
        'Mit drei Schlafzimmern und Platz für bis zu sechs Personen, plus optionalem Concierge-Service, ist Domizil Schwarzwaldblick perfekt für anspruchsvolle Gäste, die das Außergewöhnliche suchen. Hier vereinen sich Luxus, Natur und Entspannung zu einem unvergesslichen Erlebnis im Herzen des Schwarzwalds.',
      ],
      amenities: [
        { icon: Users, text: '3 Schlafzimmer, 3 Bäder' },
        { icon: Home, text: '200 m² Wohnfläche' },
        { icon: Check, text: 'Private Panorama-Sauna' },
        { icon: Check, text: 'Beheizter Infinity-Pool' },
        { icon: Trees, text: 'Großzügige Panoramaterrasse' },
        { icon: Waves, text: 'Privater Waldzugang' },
        { icon: Wifi, text: 'Glasfaser-Internet' },
        { icon: Car, text: 'Doppelgarage' },
        { icon: Check, text: 'Luxusküche mit Profi-Ausstattung' },
        { icon: Check, text: 'Wellnessbereich mit Ruheraum' },
        { icon: Check, text: 'Concierge-Service (optional)' },
        { icon: Check, text: 'Premium-Bettwäsche & Handtücher' },
      ],
      capacity: 6,
      minStay: 5,
      location: 'Domizil Schwarzwaldblick thront in erhöhter Lage über den Baumwipfeln, etwa 6 km vom Zentrum von Schluchsee entfernt. Die Anreise erfolgt über die A5 (Ausfahrt Freiburg-Mitte), von dort sind es 50 Minuten Fahrt. Der Bahnhof Schluchsee ist 6 km entfernt. Die exklusive Lage bietet absolute Privatsphäre bei gleichzeitiger Nähe zu allen Annehmlichkeiten. Gourmet-Restaurants, Golfplätze und kulturelle Highlights sind nur wenige Minuten entfernt.',
      images: [
        '/assets/generated/domizil-schwarzwaldblick.dim_1200x800.jpg',
        '/assets/generated/wellness-spa.dim_1200x800.jpg',
        '/assets/generated/treatment-room.dim_800x600.jpg',
        '/assets/generated/luxury-room.dim_1000x667.jpg',
        '/assets/generated/mountain-terrace.dim_1200x800.jpg',
        '/assets/generated/hotel-lobby.dim_1000x667.jpg',
      ],
    },
  };

  const property = propertyData[propertyId];

  return (
    <div className="flex flex-col">
      {/* Cinematic Hero Section with Parallax - Light Design */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-cream">
        <div
          ref={heroRef}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={property.heroImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-20 bg-gradient-to-t from-white/95 via-white/85 to-transparent">
          <div className="container">
            <div className="max-w-4xl space-y-6 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground mb-6 tracking-tight">
                {property.title}
              </h1>
              <p className="text-2xl md:text-3xl text-foreground/90 font-light">
                {property.subtitle}
              </p>
              <p className="text-xl md:text-2xl text-foreground/80 font-light italic">
                {property.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32 lg:py-40 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-20">
              {/* Description Section */}
              <div className="animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 tracking-tight">
                  {t('property.description')}
                </h2>
                <div className="space-y-8">
                  {property.description.map((paragraph, index) => (
                    <p key={index} className="text-xl text-muted-foreground leading-relaxed font-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <Separator className="my-16" />

              {/* Amenities Section */}
              <div className="animate-fade-in-up delay-200">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 tracking-tight">
                  {t('property.amenities.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.amenities.map((amenity, index) => {
                    const Icon = amenity.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-500">
                        <Icon className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <span className="text-foreground text-lg">{amenity.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-16" />

              {/* Occupancy & Stay Section */}
              <div className="animate-fade-in-up delay-300">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 tracking-tight">
                  {t('property.occupancy.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="hover:shadow-elegant-lg transition-all duration-500 bg-white">
                    <CardContent className="pt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <Users className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-semibold">{t('property.sidebar.capacity')}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg">
                        {t('property.occupancy.capacity.value').replace('{count}', property.capacity.toString())}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-elegant-lg transition-all duration-500 bg-white">
                    <CardContent className="pt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <Bed className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-semibold">{t('property.sidebar.minstay')}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg">
                        {t('property.occupancy.minstay.value').replace('{count}', property.minStay.toString())}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 p-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground leading-relaxed text-lg font-light">
                    <strong className="text-foreground font-semibold">{t('property.occupancy.note.label')}</strong> {t('property.occupancy.note')}
                  </p>
                </div>
              </div>

              <Separator className="my-16" />

              {/* Gallery Section */}
              <div className="animate-fade-in-up delay-400">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 tracking-tight">
                  {t('property.gallery')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer hover:shadow-elegant-lg transition-all duration-700"
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover image-zoom"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-16" />

              {/* Location Section */}
              <div className="animate-fade-in-up delay-500">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 tracking-tight">
                  {t('property.location.title')}
                </h2>
                <div className="flex items-start gap-6 mb-8">
                  <MapPin className="h-8 w-8 text-primary shrink-0 mt-2" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">{t('property.location.region')}</h3>
                    <p className="text-xl text-muted-foreground leading-relaxed font-light">
                      {property.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-10">
              {/* Pricing Card */}
              <Card className="sticky top-32 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-500 bg-white">
                <CardContent className="pt-8 space-y-8">
                  <div>
                    <Badge variant="secondary" className="text-base px-6 py-3 mb-6">
                      {t('property.sidebar.pricing')}
                    </Badge>
                    <p className="text-muted-foreground leading-relaxed text-lg font-light">
                      {t('property.sidebar.pricing.desc')}
                    </p>
                  </div>

                  <Separator />

                  {/* Quick Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-muted-foreground">{t('property.sidebar.capacity')}</span>
                      <span className="font-semibold">{property.capacity} {property.capacity === 1 ? t('calendar.form.person') : t('calendar.form.persons')}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-muted-foreground">{t('property.sidebar.minstay')}</span>
                      <span className="font-semibold">{t('property.sidebar.minstay.nights').replace('{count}', property.minStay.toString())}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-muted-foreground">{t('property.sidebar.checkin')}</span>
                      <span className="font-semibold">{t('property.sidebar.checkin.time')}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-muted-foreground">{t('property.sidebar.checkout')}</span>
                      <span className="font-semibold">{t('property.sidebar.checkout.time')}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* CTA Section */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif font-semibold">
                      {t('property.sidebar.cta.title')}
                    </h3>
                    <Button 
                      size="lg" 
                      className="luxury-cta-button w-full py-7 text-base font-semibold bg-forest-green text-cream hover:bg-forest-green/90 hover:shadow-elegant-lg focus-visible:ring-2 focus-visible:ring-forest-green focus-visible:ring-offset-2" 
                      asChild
                    >
                      <Link to="/verfuegbarkeit">
                        {t('property.sidebar.cta.button')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info Card */}
              <Card className="shadow-elegant hover:shadow-elegant-lg transition-all duration-500 bg-white">
                <CardContent className="pt-8">
                  <h3 className="text-xl font-semibold mb-6">{t('property.sidebar.contact.title')}</h3>
                  <div className="space-y-4 text-base text-muted-foreground font-light">
                    <p>
                      <strong className="text-foreground font-semibold">{t('property.sidebar.contact.phone')}</strong><br />
                      +49 7652 91780
                    </p>
                    <p>
                      <strong className="text-foreground font-semibold">{t('property.sidebar.contact.email')}</strong><br />
                      welcome@schwarzwald.at
                    </p>
                    <p className="pt-4 text-sm">
                      {t('property.sidebar.contact.note')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
