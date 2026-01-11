'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AudioPlayerProps {
  src: string;
  title: string;
  genre: string;
  mood: string;
  occasion?: string;
  onSelect?: () => void;
  showSelectButton?: boolean;
  compact?: boolean;
}

export function AudioPlayer({
  src,
  title,
  genre,
  mood,
  occasion,
  onSelect,
  showSelectButton = false,
  compact = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-900/5 overflow-hidden transition-all duration-300 hover:shadow-xl',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-start gap-4">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className={cn(
            'flex-shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-gold-400 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95',
            compact ? 'w-12 h-12' : 'w-14 h-14'
          )}
        >
          {isPlaying ? (
            <Pause className={cn(compact ? 'w-5 h-5' : 'w-6 h-6')} fill="currentColor" />
          ) : (
            <Play className={cn(compact ? 'w-5 h-5' : 'w-6 h-6', 'ml-0.5')} fill="currentColor" />
          )}
        </button>

        {/* Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className={cn('font-semibold text-gray-900 truncate', compact ? 'text-sm' : 'text-base')}>
                {title}
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <Badge variant="outline" className="text-xs">
                  {genre}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {mood}
                </Badge>
                {occasion && (
                  <Badge variant="secondary" className="text-xs">
                    {occasion}
                  </Badge>
                )}
              </div>
            </div>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-10">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-gold-400 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs text-gray-500 w-10 text-right">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Select Button */}
      {showSelectButton && onSelect && (
        <button
          onClick={onSelect}
          className="w-full mt-4 py-2.5 px-4 rounded-lg border-2 border-primary-600 text-primary-600 font-medium text-sm hover:bg-primary-50 transition-colors"
        >
          Diesen Stil waehlen
        </button>
      )}
    </div>
  );
}
