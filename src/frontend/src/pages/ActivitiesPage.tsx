import { Bike, Compass, Mountain, Utensils, Waves, Snowflake } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';

export default function ActivitiesPage() {
  const { t } = useLanguage();

  const activities = [
    {
      icon: Mountain,
      title: t('activities.hiking.title'),
      description: t('activities.hiking.desc'),
      image: '/assets/generated/mountain-terrace.dim_1200x800.jpg',
    },
    {
      icon: Bike,
      title: t('activities.cycling.title'),
      description: t('activities.cycling.desc'),
      image: '/assets/generated/salzkammergut-nature.dim_1200x800.jpg',
    },
    {
      icon: Waves,
      title: t('activities.water.title'),
      description: t('activities.water.desc'),
      image: '/assets/generated/salzkammergut-nature.dim_1200x800.jpg',
    },
    {
      icon: Snowflake,
      title: t('activities.winter.title'),
      description: t('activities.winter.desc'),
      image: '/assets/generated/mountain-terrace.dim_1200x800.jpg',
    },
    {
      icon: Utensils,
      title: t('activities.culinary.title'),
      description: t('activities.culinary.desc'),
      image: '/assets/generated/restaurant-dining.dim_1000x667.jpg',
    },
    {
      icon: Compass,
      title: t('activities.wellness.title'),
      description: t('activities.wellness.desc'),
      image: '/assets/generated/wellness-spa.dim_1200x800.jpg',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t('activities.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('activities.subtitle')}
          </p>
        </div>
      </section>

      {/* Activities Tabs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <Tabs defaultValue="nature" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="nature">{t('activities.nature.title')}</TabsTrigger>
              <TabsTrigger value="culture">{t('activities.culture.title')}</TabsTrigger>
            </TabsList>

            <TabsContent value="nature" className="space-y-8">
              <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('activities.nature.desc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.slice(0, 4).map((activity, index) => (
                  <Card key={index} className="overflow-hidden group bg-white">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg">
                        <activity.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{activity.title}</CardTitle>
                      <CardDescription className="text-base">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="culture" className="space-y-8">
              <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('activities.culture.desc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activities.slice(4).map((activity, index) => (
                  <Card key={index} className="overflow-hidden group bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg">
                        <activity.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-2xl">{activity.title}</CardTitle>
                      <CardDescription className="text-base">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
