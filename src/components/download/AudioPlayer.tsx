'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  coverUrl?: string;
}

export function AudioPlayer({ src, title, artist = 'MelodieMacher', coverUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progress = progressRef.current;
    if (!audio || !progress) return;

    const rect = progress.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Waveform visualization (simplified bars) */}
      <div className="flex items-end justify-center gap-1 h-16 mb-6">
        {Array.from({ length: 40 }).map((_, i) => {
          const barProgress = (i / 40) * 100;
          const isActive = barProgress <= progress;
          const height = 20 + Math.sin(i * 0.5) * 15 + Math.random() * 10;

          return (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-t from-gold-400 to-gold-300'
                  : 'bg-white/30'
              } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
              style={{
                height: `${height}px`,
                animationDelay: `${i * 50}ms`
              }}
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-2 bg-white/20 rounded-full cursor-pointer mb-4 overflow-hidden"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-gold-400 to-gold-300 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-sm text-white/70 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{isLoaded ? formatTime(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => skip(-10)}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Skip back 10 seconds"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-primary-900 shadow-lg shadow-gold-400/30 hover:shadow-gold-400/50 transition-all hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" fill="currentColor" />
          ) : (
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={() => skip(10)}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <button
          onClick={toggleMute}
          className="p-2 text-white/70 hover:text-white transition-colors ml-4"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Song info */}
      <div className="text-center mt-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/70">{artist}</p>
      </div>
    </div>
  );
}
