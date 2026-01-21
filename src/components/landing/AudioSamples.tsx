'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Quote, MapPin, Play, Heart, Cake, Building2, Users } from 'lucide-react';
import { AudioPlayer } from '@/components/shared/AudioPlayer';
import { StoryCard } from '@/components/shared/StoryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { songStories, getFeaturedStories } from '@/lib/stories-data';

// Featured stories for homepage (show 1 featured + 3 compact)
const homepageFeatured = getFeaturedStories().slice(0, 1);
const homepageStories = songStories.filter(s => !s.featured).slice(0, 4);

// Category quick links for browsing
const categories = [
  { key: 'wedding', icon: Heart, label: 'Hochzeit', color: 'from-rose-500 to-pink-600' },
  { key: 'birthday', icon: Cake, label: 'Geburtstag', color: 'from-amber-500 to-orange-600' },
  { key: 'corporate', icon: Building2, label: 'Firma', color: 'from-blue-500 to-indigo-600' },
  { key: 'friendship', icon: Users, label: 'Freunde', color: 'from-purple-500 to-violet-600' },
];

export function AudioSamples() {
  const router = useRouter();

  const handleSelectStyle = (storyId: string) => {
    const story = songStories.find(s => s.id === storyId);
    if (story) {
      const occasionMap: Record<string, string> = {
        wedding: 'hochzeit',
        birthday: 'geburtstag',
        corporate: 'firma',
        family: 'andere',
        friendship: 'andere',
      };
      router.push(`/bestellen?anlass=${occasionMap[story.category] || 'andere'}`);
    }
  };

  return (
    <section id="beispiele" className="section-padding bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gold-100 text-gold-700 border-0 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Echte Geschichten
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Songs mit Geschichte
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jeder dieser Songs erzaehlt eine wahre Geschichte.
            Lass dich inspirieren und entdecke, was moeglich ist.
          </p>
        </motion.div>

        {/* Category Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.key}
                variant="outline"
                size="sm"
                className="border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                onClick={() => router.push(`/echte-geschichten#stories`)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Featured Story (Full Width) */}
        {homepageFeatured.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <StoryCard
              story={story}
              variant="featured"
              onSelectStyle={handleSelectStyle}
            />
          </motion.div>
        ))}

        {/* Story Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {homepageStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StoryCard
                story={story}
                variant="compact"
                index={index}
                onSelectStyle={handleSelectStyle}
              />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-primary-200 text-primary-700 hover:bg-primary-50"
            onClick={() => router.push('/echte-geschichten')}
          >
            Alle {songStories.length} Geschichten entdecken
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-gray-500 text-sm mt-4">
            Finde Inspiration fuer deinen eigenen personalisierten Song
          </p>
        </motion.div>
      </div>
    </section>
  );
}
