'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Cake, Building2, Users, Sparkles, ArrowRight, Music, Filter } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { StoryCard, StoryGrid } from '@/components/shared/StoryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  songStories,
  getFeaturedStories,
  getStoriesByCategory,
  categoryLabels,
  categoryDescriptions,
  type SongStory,
} from '@/lib/stories-data';

const categoryIcons = {
  wedding: Heart,
  birthday: Cake,
  corporate: Building2,
  family: Users,
  friendship: Sparkles,
};

const categoryColors = {
  wedding: 'from-rose-500 to-pink-600',
  birthday: 'from-amber-500 to-orange-600',
  corporate: 'from-blue-500 to-indigo-600',
  family: 'from-emerald-500 to-teal-600',
  friendship: 'from-purple-500 to-violet-600',
};

type CategoryKey = SongStory['category'];

export default function EchteGeschichtenPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const featuredStories = getFeaturedStories();

  const categories: CategoryKey[] = ['wedding', 'birthday', 'corporate', 'family', 'friendship'];

  const filteredStories = activeCategory === 'all'
    ? songStories.filter(s => !s.featured)
    : getStoriesByCategory(activeCategory);

  const handleSelectStyle = (storyId: string) => {
    const story = songStories.find(s => s.id === storyId);
    if (story) {
      // Navigate to order page with pre-filled info
      const occasionMap: Record<string, string> = {
        wedding: 'hochzeit',
        birthday: 'geburtstag',
        corporate: 'firma',
        family: 'andere',
        friendship: 'andere',
      };
      router.push(`/bestellen?anlass=${occasionMap[story.category] || 'andere'}&stil=${story.genre.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
          </div>

          <div className="container-wide relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-white/20 text-white border-0 mb-6 text-sm px-4 py-1">
                <Music className="w-4 h-4 mr-2" />
                Echte Geschichten, echte Emotionen
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-display">
                Geschichten, die zu{' '}
                <span className="text-gold-400">Liedern</span> wurden
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Jeder Song auf dieser Seite erzaehlt eine wahre Geschichte.
                Menschen wie du haben uns ihre Momente anvertraut - und wir haben sie in Musik verwandelt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gold-500 hover:bg-gold-600 text-white"
                  onClick={() => router.push('/bestellen')}
                >
                  Deine Geschichte erzaehlen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Geschichten entdecken
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="#f9fafb"
              />
            </svg>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-gray-50 border-b border-gray-100">
          <div className="container-wide px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '1.247+', label: 'Songs erstellt' },
                { value: '98%', label: 'Zufriedenheit' },
                { value: '24h', label: 'Lieferzeit' },
                { value: '12+', label: 'Musikgenres' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Stories Section */}
        <section className="section-padding" id="featured">
          <div className="container-wide px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-gold-100 text-gold-700 border-0 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Ausgewaehlte Geschichten
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
                Unsere beliebtesten Momente
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Diese Geschichten haben uns besonders beruehrt - und unsere Kunden auch.
              </p>
            </motion.div>

            <div className="space-y-8">
              {featuredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  variant="featured"
                  onSelectStyle={handleSelectStyle}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category Filter Section */}
        <section className="section-padding bg-gray-50" id="stories">
          <div className="container-wide px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
                Alle Geschichten entdecken
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Finde Inspiration fuer deinen eigenen Song - sortiert nach Anlass.
              </p>

              {/* Category Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <Button
                  variant={activeCategory === 'all' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setActiveCategory('all')}
                  className={cn(
                    activeCategory === 'all'
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'border-gray-200 hover:bg-gray-100'
                  )}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Alle ({songStories.length})
                </Button>

                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  const count = getStoriesByCategory(category).length;

                  return (
                    <Button
                      key={category}
                      variant={activeCategory === category ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        activeCategory === category
                          ? `bg-gradient-to-r ${categoryColors[category]} hover:opacity-90`
                          : 'border-gray-200 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {categoryLabels[category]} ({count})
                    </Button>
                  );
                })}
              </div>
            </motion.div>

            {/* Category Description */}
            {activeCategory !== 'all' && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-white mb-4",
                  `bg-gradient-to-r ${categoryColors[activeCategory]}`
                )}>
                  {(() => {
                    const Icon = categoryIcons[activeCategory];
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <span className="font-semibold">{categoryLabels[activeCategory]}</span>
                </div>
                <p className="text-gray-600 max-w-xl mx-auto">
                  {categoryDescriptions[activeCategory]}
                </p>
              </motion.div>
            )}

            {/* Stories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  variant="default"
                  index={index}
                  onSelectStyle={handleSelectStyle}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredStories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Keine Geschichten in dieser Kategorie gefunden.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold-400 rounded-full blur-3xl" />
          </div>

          <div className="container-wide px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
                Deine Geschichte koennte die naechste sein
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Jede dieser Geschichten begann mit einer Idee, einem Wunsch, einem besonderen Menschen.
                Was ist deine Geschichte?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="bg-gold-500 hover:bg-gold-600 text-white shadow-lg"
                  onClick={() => router.push('/bestellen')}
                >
                  Jetzt Song erstellen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <p className="text-white/60 text-sm mt-6">
                Ab 49 EUR • In 24 Stunden bei dir • Gaensehaut-Garantie
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
