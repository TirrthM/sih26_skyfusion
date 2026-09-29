'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  fallbackText?: string;
  className?: string;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src, fallbackText, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    if (!Number.isFinite(duration) || duration <= 0) return; // Prevent non-finite error
    
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
    setProgress(pos * 100);
  };

  return (
    <div className={`relative group w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
      {src ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div className="text-slate-400 text-xs font-mono">{fallbackText || 'Video unavailable'}</div>
      )}

      {/* Play/Pause Center Button Overlay */}
      {src && (
        <div 
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}
        >
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm pointer-events-auto hover:bg-black/80 hover:scale-110 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Bottom Progress Bar (YT Style) */}
      {src && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 cursor-pointer group-hover:h-2 transition-all" onClick={handleSeek}>
          <div 
            className="h-full bg-red-600 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all" />
          </div>
        </div>
      )}
    </div>
  );
};
