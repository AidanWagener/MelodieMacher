'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Quote, MapPin, Music, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SongStory } from '@/lib/stories-data';

interface StoryCardProps {
  story: SongStory;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
  onSelectStyle?: (storyId: string) => void;
}

export function StoryCard({ story, variant = 'default', index = 0, onSelectStyle }: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!story.audioPreviewUrl) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-rose-50 border-primary-100 shadow-xl">
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gold-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Beliebte Geschichte
            </Badge>
          </div>

          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image/Audio Side */}
              <div
                className="relative aspect-square md:aspect-auto min-h-[300px] bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center cursor-pointer group"
                onClick={togglePlay}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {story.imageUrl ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30"
                      style={{ backgroundImage: `url(${story.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
                  </>
                ) : null}

                <div className={cn(
                  "relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
                  isHovered && "scale-110 bg-white/30",
                  isPlaying && "animate-pulse"
                )}>
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2 font-display">
                    {story.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <Music className="w-3 h-3 mr-1" />
                      {story.genre}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <Heart className="w-3 h-3 mr-1" />
                      {story.mood}
                    </Badge>
                  </div>
                </div>

                {story.audioPreviewUrl && (
                  <audio
                    ref={audioRef}
                    src={story.audioPreviewUrl}
                    onEnded={handleAudioEnded}
                  />
                )}
              </div>

              {/* Content Side */}
              <div className="p-8 flex flex-col justify-center">
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary-200" />
                  <p className="text-lg text-gray-700 italic pl-6 leading-relaxed">
                    {story.hookLine}
                  </p>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {story.storyContext}
                </p>

                <div className="bg-primary-50 rounded-xl p-4 mb-6">
                  <p className="text-primary-800 font-medium italic mb-2">
                    "{story.quote}"
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <span className="font-semibold">{story.quoteAuthor}</span>
                    <span className="text-primary-400">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {story.quoteLocation}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-primary-200 text-primary-700">
                    {story.occasion}
                  </Badge>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  onClick={() => onSelectStyle?.(story.id)}
                >
                  Deine eigene Geschichte erzaehlen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Card
          className={cn(
            "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            "bg-white border-gray-100"
          )}
          onClick={togglePlay}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Play Button */}
              <div className={cn(
                "w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0",
                "transition-colors duration-300 group-hover:bg-primary-600",
                isPlaying && "bg-primary-600"
              )}>
                {isPlaying ? (
                  <Pause className={cn("w-5 h-5 transition-colors", isPlaying ? "text-white" : "text-primary-600 group-hover:text-white")} />
                ) : (
                  <Play className="w-5 h-5 text-primary-600 group-hover:text-white ml-0.5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 truncate">
                  {story.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {story.hookLine}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs border-gray-200">
                    {story.genre}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gray-200">
                    {story.occasion}
                  </Badge>
                </div>
              </div>
            </div>

            {story.audioPreviewUrl && (
              <audio
                ref={audioRef}
                src={story.audioPreviewUrl}
                onEnded={handleAudioEnded}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
          "bg-white border-gray-100 group"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header with Play Button */}
        <div
          className="relative h-48 bg-gradient-to-br from-primary-600 to-primary-800 cursor-pointer"
          onClick={togglePlay}
        >
          {story.imageUrl && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity group-hover:opacity-50"
                style={{ backgroundImage: `url(${story.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent" />
            </>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
              isHovered && "scale-110 bg-white/30",
              isPlaying && "animate-pulse"
            )}>
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white" />
              ) : (
                <Play className="w-7 h-7 text-white ml-1" />
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white font-display">
              {story.title}
            </h3>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Badge className="bg-white/20 text-white border-0 text-xs">
              {story.genre}
            </Badge>
          </div>

          {story.audioPreviewUrl && (
            <audio
              ref={audioRef}
              src={story.audioPreviewUrl}
              onEnded={handleAudioEnded}
            />
          )}
        </div>

        <CardContent className="p-5">
          {/* Hook Line */}
          <p className="text-gray-700 font-medium mb-4 line-clamp-2">
            {story.hookLine}
          </p>

          {/* Quote */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 italic mb-2 line-clamp-2">
              "{story.quote}"
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">{story.quoteAuthor}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {story.quoteLocation}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs border-primary-200 text-primary-700">
              {story.occasion}
            </Badge>
            <Badge variant="outline" className="text-xs border-rose-200 text-rose-700">
              {story.mood}
            </Badge>
          </div>

          {/* CTA */}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-primary-200 text-primary-700 hover:bg-primary-50"
            onClick={(e) => {
              e.stopPropagation();
              onSelectStyle?.(story.id);
            }}
          >
            Diesen Stil waehlen
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Grid wrapper component for story cards
interface StoryGridProps {
  stories: SongStory[];
  variant?: 'default' | 'compact';
  onSelectStyle?: (storyId: string) => void;
}

export function StoryGrid({ stories, variant = 'default', onSelectStyle }: StoryGridProps) {
  const featuredStories = stories.filter(s => s.featured);
  const regularStories = stories.filter(s => !s.featured);

  return (
    <div className="space-y-8">
      {/* Featured Stories */}
      {featuredStories.length > 0 && variant === 'default' && (
        <div className="space-y-6">
          {featuredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              variant="featured"
              onSelectStyle={onSelectStyle}
            />
          ))}
        </div>
      )}

      {/* Regular Stories Grid */}
      <div className={cn(
        "grid gap-6",
        variant === 'default'
          ? "md:grid-cols-2 lg:grid-cols-3"
          : "md:grid-cols-2"
      )}>
        {regularStories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            variant={variant}
            index={index}
            onSelectStyle={onSelectStyle}
          />
        ))}
      </div>
    </div>
  );
}
